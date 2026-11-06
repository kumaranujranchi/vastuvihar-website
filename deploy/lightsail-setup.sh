#!/usr/bin/env bash
# AWS Lightsail Ubuntu 22.04 / 24.04 setup script (Safe for servers with existing websites)
# Run with: sudo bash deploy/lightsail-setup.sh

set -e

echo "=== 1. Checking Swap Space (Prevents out of memory errors) ==="
SWAP_TOTAL=$(free -m | awk '/^Swap:/ {print $2}')
if [ "$SWAP_TOTAL" -lt 1024 ]; then
    echo "Creating 2GB swap file..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    if ! grep -q '/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    echo "2GB Swap file created successfully."
else
    echo "Swap space already available: ${SWAP_TOTAL}MB"
fi

echo "=== 2. Ensuring Node.js 20 & PM2 are Installed ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME || true
fi

echo "=== 3. Ensuring Nginx & Certbot are Installed ==="
apt update
apt install -y nginx certbot python3-certbot-nginx

echo "=== 4. Configuring Dedicated Storage Directories ==="
mkdir -p /var/lib/vastuvihar/private
mkdir -p /var/www/vastuvihar-website/public/uploads/blogs
mkdir -p /var/www/vastuvihar-website/public/uploads/gallery
chmod -R 755 /var/www/vastuvihar-website/public/uploads || true

echo "=== Server setup ready! ==="
echo "Note: Your existing website is untouched."
echo "Vastu Vihar will run independently on port 3001 using PM2."
