#!/usr/bin/env bash
# Shared configuration for the infra scripts. Sourced, not executed.

export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-ap-southeast-2}"
export AWS_PAGER=""

PROJECT="business-prospect-manager"
REGION="$AWS_DEFAULT_REGION"
TAGS="Key=project,Value=${PROJECT}"
TAG_FILTER="Name=tag:project,Values=${PROJECT}"

REPO_URL="https://github.com/RichardBoseley/Business-Prospect-Manager.git"
APP_DIR="/var/app/${PROJECT}"

INSTANCE_TYPE="t4g.small"
VOLUME_GB=20

KEY_NAME="${PROJECT}-deploy"
SG_NAME="${PROJECT}-sg"
ROLE_NAME="${PROJECT}-ec2"
PROFILE_NAME="${PROJECT}-ec2"
SSM_ENV_PARAM="/${PROJECT}/env"
SSM_KEY_PARAM="/${PROJECT}/deploy-key"

COGNITO_POOL_NAME="smallteam-apps"   # shared across all smallteam apps
COGNITO_CLIENT_NAME="${PROJECT}"
COGNITO_USERNAME="${COGNITO_USERNAME:-richard@smallteam.ai}"

BUDGET_NAME="${PROJECT}-monthly"
BUDGET_LIMIT_USD="25"

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/out"
mkdir -p "$OUT_DIR"

account_id() { aws sts get-caller-identity --query Account --output text; }

log() { printf '\n== %s\n' "$*"; }
