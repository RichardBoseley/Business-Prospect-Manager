#!/usr/bin/env bash
# Provision the complete single-instance environment for
# business-prospect-manager in ap-southeast-2. Idempotent: safe to re-run;
# existing resources are found and reused, not duplicated.
#
# Usage:
#   ./provision.sh <ssh-cidr> [budget-email]
#
#   ssh-cidr      CIDR allowed to reach port 22 (e.g. 1.2.3.4/32).
#                 Note: GitHub Actions deploys over SSH from GitHub-hosted
#                 runners, whose IPs vary — pass 0.0.0.0/0 if you use the
#                 bundled CI workflow, or restrict and deploy manually.
#   budget-email  Email for the US$25/month billing alert
#                 (default: richard@smallteam.ai — change here or in
#                 AWS Budgets console later).
#
# Creates: S3 backup bucket (versioned, 30-day expiry), IAM role/instance
# profile (SSM + backup-bucket write only), EC2 key pair, security group,
# Elastic IP, t4g.small Ubuntu 24.04 ARM instance (Node 20 + nginx + PM2 via
# user-data), Cognito user pool "smallteam-apps" + app client + admin-created
# user, SSM parameters for runtime env + deploy key, and the billing budget.
# Everything is tagged project=business-prospect-manager.
set -euo pipefail
cd "$(dirname "$0")"
source ./common.sh

SSH_CIDR="${1:?usage: ./provision.sh <ssh-cidr> [budget-email]}"
BUDGET_EMAIL="${2:-richard@smallteam.ai}"

ACCOUNT="$(account_id)"
BUCKET="${PROJECT}-backups-${ACCOUNT}"

# ---------------------------------------------------------------- S3 backups
log "S3 backup bucket: ${BUCKET}"
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" \
    --create-bucket-configuration "LocationConstraint=${REGION}"
fi
aws s3api put-bucket-tagging --bucket "$BUCKET" \
  --tagging "TagSet=[{Key=project,Value=${PROJECT}}]"
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
aws s3api put-bucket-versioning --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "expire-backups-30d",
      "Status": "Enabled",
      "Filter": {"Prefix": "backups/"},
      "Expiration": {"Days": 30},
      "NoncurrentVersionExpiration": {"NoncurrentDays": 30}
    }]
  }'

# ------------------------------------------------------- IAM role + profile
log "IAM role ${ROLE_NAME} (SSM + backup writes only)"
if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE_NAME" --tags $TAGS \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{"Effect": "Allow", "Principal": {"Service": "ec2.amazonaws.com"}, "Action": "sts:AssumeRole"}]
    }'
fi
aws iam attach-role-policy --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name backup-and-env \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {"Effect": "Allow", "Action": ["s3:PutObject"], "Resource": "arn:aws:s3:::'"$BUCKET"'/backups/*"},
      {"Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::'"$BUCKET"'"},
      {"Effect": "Allow", "Action": ["ssm:GetParameter"], "Resource": "arn:aws:ssm:'"$REGION"':'"$ACCOUNT"':parameter'"$SSM_ENV_PARAM"'"}
    ]
  }'
if ! aws iam get-instance-profile --instance-profile-name "$PROFILE_NAME" >/dev/null 2>&1; then
  aws iam create-instance-profile --instance-profile-name "$PROFILE_NAME" --tags $TAGS
  aws iam add-role-to-instance-profile --instance-profile-name "$PROFILE_NAME" --role-name "$ROLE_NAME"
  sleep 10   # instance-profile propagation
fi

# ---------------------------------------------------------------- key pair
log "EC2 key pair ${KEY_NAME}"
KEY_FILE="${OUT_DIR}/deploy_key.pem"
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
  aws ec2 create-key-pair --key-name "$KEY_NAME" \
    --tag-specifications "ResourceType=key-pair,Tags=[{${TAGS}}]" \
    --query KeyMaterial --output text > "$KEY_FILE"
  chmod 600 "$KEY_FILE"
  aws ssm put-parameter --name "$SSM_KEY_PARAM" --type SecureString \
    --value "file://${KEY_FILE}" --overwrite
  echo "Private key written to ${KEY_FILE} and SSM ${SSM_KEY_PARAM}"
else
  echo "Key pair exists. Retrieve the private key with:"
  echo "  aws ssm get-parameter --name ${SSM_KEY_PARAM} --with-decryption --query Parameter.Value --output text"
fi

# ----------------------------------------------------------- security group
log "Security group ${SG_NAME}"
VPC_ID="$(aws ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)"
SG_ID="$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=${SG_NAME}" "Name=vpc-id,Values=${VPC_ID}" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)"
if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]; then
  SG_ID="$(aws ec2 create-security-group --group-name "$SG_NAME" \
    --description "business-prospect-manager web + ssh" --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=security-group,Tags=[{${TAGS}}]" \
    --query GroupId --output text)"
fi
authorize() {
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" \
    --protocol tcp --port "$1" --cidr "$2" 2>/dev/null || true   # ok if rule exists
}
authorize 80 0.0.0.0/0
authorize 443 0.0.0.0/0
authorize 22 "$SSH_CIDR"

# ---------------------------------------------------------------- Elastic IP
log "Elastic IP"
EIP_ALLOC="$(aws ec2 describe-addresses --filters "$TAG_FILTER" \
  --query 'Addresses[0].AllocationId' --output text 2>/dev/null || true)"
if [ -z "$EIP_ALLOC" ] || [ "$EIP_ALLOC" = "None" ]; then
  EIP_ALLOC="$(aws ec2 allocate-address --domain vpc \
    --tag-specifications "ResourceType=elastic-ip,Tags=[{${TAGS}}]" \
    --query AllocationId --output text)"
fi
EIP="$(aws ec2 describe-addresses --allocation-ids "$EIP_ALLOC" \
  --query 'Addresses[0].PublicIp' --output text)"
APP_URL="https://${EIP}"
echo "Elastic IP: ${EIP}"

# ------------------------------------------------------------------- Cognito
log "Cognito user pool ${COGNITO_POOL_NAME} (shared across smallteam apps)"
POOL_ID="$(aws cognito-idp list-user-pools --max-results 60 \
  --query "UserPools[?Name=='${COGNITO_POOL_NAME}'].Id | [0]" --output text)"
if [ -z "$POOL_ID" ] || [ "$POOL_ID" = "None" ]; then
  POOL_ID="$(aws cognito-idp create-user-pool --pool-name "$COGNITO_POOL_NAME" \
    --admin-create-user-config AllowAdminCreateUserOnly=true \
    --username-attributes email \
    --auto-verified-attributes email \
    --policies 'PasswordPolicy={MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}' \
    --user-pool-tags "project=${PROJECT}" \
    --query 'UserPool.Id' --output text)"
fi
ISSUER="https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}"

DOMAIN_PREFIX="smallteam-apps-${ACCOUNT}"
EXISTING_DOMAIN="$(aws cognito-idp describe-user-pool --user-pool-id "$POOL_ID" \
  --query 'UserPool.Domain' --output text)"
if [ -z "$EXISTING_DOMAIN" ] || [ "$EXISTING_DOMAIN" = "None" ]; then
  aws cognito-idp create-user-pool-domain --domain "$DOMAIN_PREFIX" --user-pool-id "$POOL_ID"
else
  DOMAIN_PREFIX="$EXISTING_DOMAIN"
fi
COGNITO_DOMAIN="https://${DOMAIN_PREFIX}.auth.${REGION}.amazoncognito.com"

CLIENT_ID="$(aws cognito-idp list-user-pool-clients --user-pool-id "$POOL_ID" --max-results 60 \
  --query "UserPoolClients[?ClientName=='${COGNITO_CLIENT_NAME}'].ClientId | [0]" --output text)"
CALLBACKS="${APP_URL}/api/auth/callback http://localhost:3000/api/auth/callback"
LOGOUTS="${APP_URL}/ http://localhost:3000/"
if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" = "None" ]; then
  CLIENT_ID="$(aws cognito-idp create-user-pool-client --user-pool-id "$POOL_ID" \
    --client-name "$COGNITO_CLIENT_NAME" --generate-secret \
    --allowed-o-auth-flows code --allowed-o-auth-flows-user-pool-client \
    --allowed-o-auth-scopes openid email profile \
    --supported-identity-providers COGNITO \
    --callback-urls $CALLBACKS --logout-urls $LOGOUTS \
    --query 'UserPoolClient.ClientId' --output text)"
else
  aws cognito-idp update-user-pool-client --user-pool-id "$POOL_ID" \
    --client-id "$CLIENT_ID" \
    --allowed-o-auth-flows code --allowed-o-auth-flows-user-pool-client \
    --allowed-o-auth-scopes openid email profile \
    --supported-identity-providers COGNITO \
    --callback-urls $CALLBACKS --logout-urls $LOGOUTS >/dev/null
fi
CLIENT_SECRET="$(aws cognito-idp describe-user-pool-client --user-pool-id "$POOL_ID" \
  --client-id "$CLIENT_ID" --query 'UserPoolClient.ClientSecret' --output text)"

TEMP_PASSWORD="GameOn-$(openssl rand -hex 4)-2026"
if ! aws cognito-idp admin-get-user --user-pool-id "$POOL_ID" \
    --username "$COGNITO_USERNAME" >/dev/null 2>&1; then
  aws cognito-idp admin-create-user --user-pool-id "$POOL_ID" \
    --username "$COGNITO_USERNAME" \
    --user-attributes "Name=email,Value=${COGNITO_USERNAME}" Name=email_verified,Value=true \
    --temporary-password "$TEMP_PASSWORD" \
    --message-action SUPPRESS >/dev/null
  echo "Created user ${COGNITO_USERNAME} with temporary password ${TEMP_PASSWORD}"
else
  TEMP_PASSWORD="(user already exists — reset via: aws cognito-idp admin-set-user-password)"
fi

# ----------------------------------------------- runtime env (SSM, secret)
log "Runtime env -> SSM ${SSM_ENV_PARAM}"
ENV_CONTENT="COGNITO_ISSUER=${ISSUER}
COGNITO_DOMAIN=${COGNITO_DOMAIN}
COGNITO_CLIENT_ID=${CLIENT_ID}
COGNITO_CLIENT_SECRET=${CLIENT_SECRET}
APP_URL=${APP_URL}
DB_PATH=/var/app/data/app.db"
aws ssm put-parameter --name "$SSM_ENV_PARAM" --type SecureString \
  --value "$ENV_CONTENT" --overwrite >/dev/null

# ------------------------------------------------------------------ instance
log "EC2 instance"
INSTANCE_ID="$(aws ec2 describe-instances \
  --filters "$TAG_FILTER" "Name=instance-state-name,Values=pending,running" \
  --query 'Reservations[0].Instances[0].InstanceId' --output text 2>/dev/null || true)"
if [ -z "$INSTANCE_ID" ] || [ "$INSTANCE_ID" = "None" ]; then
  AMI_ID="$(aws ssm get-parameter \
    --name /aws/service/canonical/ubuntu/server/24.04/stable/current/arm64/hvm/ebs-gp3/ami-id \
    --query Parameter.Value --output text)"
  sed -e "s|__REGION__|${REGION}|g" \
      -e "s|__PROJECT__|${PROJECT}|g" \
      -e "s|__BUCKET__|${BUCKET}|g" \
      -e "s|__REPO_URL__|${REPO_URL}|g" \
      -e "s|__APP_DIR__|${APP_DIR}|g" \
      -e "s|__SSM_ENV_PARAM__|${SSM_ENV_PARAM}|g" \
      user-data.sh.tpl > "${OUT_DIR}/user-data.sh"
  INSTANCE_ID="$(aws ec2 run-instances \
    --image-id "$AMI_ID" --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" --security-group-ids "$SG_ID" \
    --iam-instance-profile "Name=${PROFILE_NAME}" \
    --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=${VOLUME_GB},VolumeType=gp3,DeleteOnTermination=true}" \
    --user-data "file://${OUT_DIR}/user-data.sh" \
    --tag-specifications \
      "ResourceType=instance,Tags=[{${TAGS}},{Key=Name,Value=${PROJECT}}]" \
      "ResourceType=volume,Tags=[{${TAGS}}]" \
    --query 'Instances[0].InstanceId' --output text)"
  echo "Launched ${INSTANCE_ID}; waiting for running state"
  aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
fi
aws ec2 associate-address --instance-id "$INSTANCE_ID" --allocation-id "$EIP_ALLOC" >/dev/null

# ---------------------------------------------------------------- budget
log "Billing budget ${BUDGET_NAME} (US\$${BUDGET_LIMIT_USD}/month -> ${BUDGET_EMAIL})"
if ! aws budgets describe-budget --account-id "$ACCOUNT" \
    --budget-name "$BUDGET_NAME" >/dev/null 2>&1; then
  aws budgets create-budget --account-id "$ACCOUNT" \
    --budget "{
      \"BudgetName\": \"${BUDGET_NAME}\",
      \"BudgetLimit\": {\"Amount\": \"${BUDGET_LIMIT_USD}\", \"Unit\": \"USD\"},
      \"TimeUnit\": \"MONTHLY\",
      \"BudgetType\": \"COST\"
    }" \
    --notifications-with-subscribers "[{
      \"Notification\": {
        \"NotificationType\": \"ACTUAL\",
        \"ComparisonOperator\": \"GREATER_THAN\",
        \"Threshold\": 100,
        \"ThresholdType\": \"PERCENTAGE\"
      },
      \"Subscribers\": [{\"SubscriptionType\": \"EMAIL\", \"Address\": \"${BUDGET_EMAIL}\"}]
    }]"
fi

# ---------------------------------------------------------------- summary
log "Provisioning complete"
cat <<SUMMARY

App URL:            ${APP_URL}   (self-signed certificate — expect a browser warning)
Instance:           ${INSTANCE_ID}  (${INSTANCE_TYPE}, ${REGION})
Elastic IP:         ${EIP}
Backup bucket:      s3://${BUCKET}/backups/  (nightly 03:00 UTC, 30-day expiry)

Cognito
  User pool:        ${POOL_ID}  (${COGNITO_POOL_NAME}, shared)
  Hosted UI:        ${COGNITO_DOMAIN}
  App client:       ${CLIENT_ID}
  Login:            ${COGNITO_USERNAME}
  Temp password:    ${TEMP_PASSWORD}

GitHub Actions secrets (repo Settings -> Secrets and variables -> Actions):
  EC2_HOST          ${EIP}
  EC2_USER          ubuntu
  EC2_SSH_KEY       contents of ${OUT_DIR}/deploy_key.pem
                    (or: aws ssm get-parameter --name ${SSM_KEY_PARAM} --with-decryption --query Parameter.Value --output text)

Billing alert:      US\$${BUDGET_LIMIT_USD}/month -> ${BUDGET_EMAIL}
                    (change in infra/common.sh BUDGET_* or AWS console -> Billing -> Budgets)

First boot takes ~5 minutes (apt + npm ci + build). Check with:
  curl -k ${APP_URL}/api/health
SUMMARY
