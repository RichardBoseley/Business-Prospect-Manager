#!/usr/bin/env bash
# Tear down everything provision.sh created, for cost control and reuse.
#
# Usage:
#   ./teardown.sh [--delete-backups] [--delete-cognito-client] [--delete-budget]
#
# By default this KEEPS:
#   - the S3 backup bucket and its contents   (--delete-backups removes it)
#   - the shared Cognito pool, domain + user  (--delete-cognito-client removes
#     only this project's app client; the pool is shared by other apps and is
#     never deleted here)
#   - the billing budget                      (--delete-budget removes it)
set -euo pipefail
cd "$(dirname "$0")"
source ./common.sh

DELETE_BACKUPS=false
DELETE_COGNITO_CLIENT=false
DELETE_BUDGET=false
for arg in "$@"; do
  case "$arg" in
    --delete-backups) DELETE_BACKUPS=true ;;
    --delete-cognito-client) DELETE_COGNITO_CLIENT=true ;;
    --delete-budget) DELETE_BUDGET=true ;;
    *) echo "unknown flag: $arg"; exit 1 ;;
  esac
done

ACCOUNT="$(account_id)"
BUCKET="${PROJECT}-backups-${ACCOUNT}"

log "Terminating instance(s)"
INSTANCE_IDS="$(aws ec2 describe-instances \
  --filters "$TAG_FILTER" "Name=instance-state-name,Values=pending,running,stopping,stopped" \
  --query 'Reservations[].Instances[].InstanceId' --output text)"
if [ -n "$INSTANCE_IDS" ]; then
  aws ec2 terminate-instances --instance-ids $INSTANCE_IDS >/dev/null
  aws ec2 wait instance-terminated --instance-ids $INSTANCE_IDS
fi

log "Releasing Elastic IP"
for ALLOC in $(aws ec2 describe-addresses --filters "$TAG_FILTER" \
    --query 'Addresses[].AllocationId' --output text); do
  aws ec2 release-address --allocation-id "$ALLOC"
done

log "Deleting security group"
SG_ID="$(aws ec2 describe-security-groups --filters "Name=group-name,Values=${SG_NAME}" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)"
if [ -n "$SG_ID" ] && [ "$SG_ID" != "None" ]; then
  aws ec2 delete-security-group --group-id "$SG_ID"
fi

log "Deleting key pair + SSM parameters"
aws ec2 delete-key-pair --key-name "$KEY_NAME" 2>/dev/null || true
aws ssm delete-parameter --name "$SSM_KEY_PARAM" 2>/dev/null || true
aws ssm delete-parameter --name "$SSM_ENV_PARAM" 2>/dev/null || true

log "Deleting IAM instance profile + role"
aws iam remove-role-from-instance-profile --instance-profile-name "$PROFILE_NAME" \
  --role-name "$ROLE_NAME" 2>/dev/null || true
aws iam delete-instance-profile --instance-profile-name "$PROFILE_NAME" 2>/dev/null || true
aws iam detach-role-policy --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore 2>/dev/null || true
aws iam delete-role-policy --role-name "$ROLE_NAME" --policy-name backup-and-env 2>/dev/null || true
aws iam delete-role --role-name "$ROLE_NAME" 2>/dev/null || true

if $DELETE_BACKUPS; then
  log "Deleting backup bucket ${BUCKET} (including all versions)"
  aws s3api list-object-versions --bucket "$BUCKET" \
    --query '{Objects: [Versions,DeleteMarkers][][].{Key: Key, VersionId: VersionId}}' \
    --output json 2>/dev/null > /tmp/bpm-versions.json || true
  if [ -s /tmp/bpm-versions.json ] && [ "$(cat /tmp/bpm-versions.json)" != '{ "Objects": null }' ]; then
    aws s3api delete-objects --bucket "$BUCKET" --delete file:///tmp/bpm-versions.json >/dev/null 2>&1 || true
  fi
  aws s3api delete-bucket --bucket "$BUCKET" 2>/dev/null || true
else
  echo "Keeping backup bucket s3://${BUCKET} (pass --delete-backups to remove)"
fi

if $DELETE_COGNITO_CLIENT; then
  log "Deleting Cognito app client (pool ${COGNITO_POOL_NAME} itself is shared and kept)"
  POOL_ID="$(aws cognito-idp list-user-pools --max-results 60 \
    --query "UserPools[?Name=='${COGNITO_POOL_NAME}'].Id | [0]" --output text)"
  if [ -n "$POOL_ID" ] && [ "$POOL_ID" != "None" ]; then
    CLIENT_ID="$(aws cognito-idp list-user-pool-clients --user-pool-id "$POOL_ID" --max-results 60 \
      --query "UserPoolClients[?ClientName=='${COGNITO_CLIENT_NAME}'].ClientId | [0]" --output text)"
    if [ -n "$CLIENT_ID" ] && [ "$CLIENT_ID" != "None" ]; then
      aws cognito-idp delete-user-pool-client --user-pool-id "$POOL_ID" --client-id "$CLIENT_ID"
    fi
  fi
else
  echo "Keeping Cognito pool, domain, user and app client (pass --delete-cognito-client to remove the client)"
fi

if $DELETE_BUDGET; then
  log "Deleting budget"
  aws budgets delete-budget --account-id "$ACCOUNT" --budget-name "$BUDGET_NAME" 2>/dev/null || true
else
  echo "Keeping billing budget ${BUDGET_NAME} (pass --delete-budget to remove)"
fi

log "Teardown complete"
