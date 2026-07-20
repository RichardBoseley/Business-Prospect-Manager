#!/bin/bash
# EC2 user-data — first-boot setup for the business-prospect-manager instance.
# Placeholders (__NAME__) are substituted by provision.sh before launch.
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y nginx git unzip

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# AWS CLI (for SSM env fetch + S3 backups via the instance role)
snap install aws-cli --classic

# App layout: repo checkout under /var/app, SQLite outside it at /var/app/data
mkdir -p /var/app/data
chown -R ubuntu:ubuntu /var/app

if [ ! -d __APP_DIR__/.git ]; then
  sudo -u ubuntu git clone __REPO_URL__ __APP_DIR__
fi

# Runtime env (Cognito + app URL) from SSM Parameter Store — never in the repo
aws ssm get-parameter --name __SSM_ENV_PARAM__ --with-decryption \
  --region __REGION__ --query Parameter.Value --output text > __APP_DIR__/.env
chown ubuntu:ubuntu __APP_DIR__/.env
chmod 600 __APP_DIR__/.env

sudo -u ubuntu bash -lc 'cd __APP_DIR__ && npm ci && npm run build'

# PM2 service, surviving reboot
sudo -u ubuntu bash -lc 'cd __APP_DIR__ && pm2 start npm --name bpm -- start && pm2 save'
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
systemctl enable pm2-ubuntu

# nginx reverse proxy: 80 -> https, 443 (self-signed) -> :3000
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
  -keyout /etc/nginx/ssl/selfsigned.key -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=__PROJECT__"
cat > /etc/nginx/sites-available/bpm <<'NGINX'
server {
  listen 80 default_server;
  return 301 https://$host$request_uri;
}
server {
  listen 443 ssl default_server;
  ssl_certificate /etc/nginx/ssl/selfsigned.crt;
  ssl_certificate_key /etc/nginx/ssl/selfsigned.key;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
NGINX
rm -f /etc/nginx/sites-enabled/default
ln -sf ../sites-available/bpm /etc/nginx/sites-enabled/bpm
systemctl restart nginx

# Nightly SQLite dump to the private, versioned backup bucket (03:00 UTC)
cat > /etc/cron.d/bpm-backup <<CRON
0 3 * * * ubuntu /snap/bin/aws s3 cp /var/app/data/app.db s3://__BUCKET__/backups/app-\$(date +\%F).db --region __REGION__ >> /var/log/bpm-backup.log 2>&1
CRON
chmod 644 /etc/cron.d/bpm-backup

echo "user-data complete"
