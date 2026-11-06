#!/usr/bin/env bash
# AWS Lightsail Ubuntu 22.04 / 24.04 automated setup script
# Run with: sudo bash deploy/lightsail-setup.sh

set -e

echo "=== 1. Updating System Packages ==="
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx

echo "=== 2. Installing Node.js 20 LTS ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "=== 3. Installing PM2 Process Manager ==="
npm install -g pm2
pm2 startup systemd -u $USER --hp $HOME || true

echo "=== 4. Setting Up Firewall (UFW) ==="
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "=== 5. Configuring Storage Directories ==="
mkdir -p /var/lib/vastuvihar/private
mkdir -p /var/www/vastuvihar-website/public/uploads/blogs
mkdir -p /var/www/vastuvihar-website/public/uploads/gallery
chmod -R 755 /var/www/vastuvihar-website/public/uploads || true

echo "=== Setup complete! ==="
echo "Next steps:"
echo "1. Clone or copy code to /var/www/vastuvihar-website"
echo "2. Copy .env.example to .env and configure DATABASE_URL='file:/var/lib/vastuvihar/app.db'"
echo "3. Run: npm ci && npx prisma db push && npm run build"
echo "4. Start app: pm2 start ecosystem.config.js && pm2 save"
echo "5. Link Nginx config: sudo cp deploy/nginx.conf /etc/nginx/sites-available/vastuvihar && sudo ln -s /etc/nginx/sites-available/vastuvihar /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx"
echo "6. Get SSL certificate: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
