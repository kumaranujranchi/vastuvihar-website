# AWS Lightsail Deployment Guide for Vastu Vihar

This document explains how to host the Vastu Vihar Next.js website on **AWS Lightsail**.

---

## 🚀 Scenario A: Hosting on an Existing Lightsail Instance (Alongside Another Website)

If you already have another website (WordPress, PHP, or another Node app) running on your Lightsail instance, follow these safe steps so **your existing website is never affected**.

### Step 1: Check Used Ports
Connect to your Lightsail terminal and check which ports are currently in use:
```bash
sudo lsof -i -P -n | grep LISTEN
# or
sudo ss -tulpn
```
*Note: Your existing site likely runs on port `80`/`443` through Nginx, and if it is Node.js, on `3000`. Vastu Vihar is configured to run on **port 3001**.*

### Step 2: Ensure Swap Memory Exists (Crucial for 1GB RAM Instances)
When running 2 websites on a 1GB or 2GB Lightsail server, swap space prevents memory exhaustion during builds:
```bash
sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi
```

### Step 3: Clone Code in a Dedicated Directory
```bash
sudo mkdir -p /var/www/vastuvihar-website
sudo chown -R $USER:$USER /var/www/vastuvihar-website

git clone https://github.com/kumaranujranchi/vastuvihar-website.git /var/www/vastuvihar-website
cd /var/www/vastuvihar-website
```

### Step 4: Configure Environment File
```bash
cp .env.example .env
nano .env
```
Ensure these values in `.env`:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="file:/var/lib/vastuvihar/app.db"
NEXT_PUBLIC_SITE_URL="https://your-vastuvihar-domain.com"
PRIVACY_HASH_SECRET="generate-a-random-32-char-string-here"
RETENTION_CRON_SECRET="generate-a-random-32-char-string-here"
PRIVATE_STORAGE_DIR="/var/lib/vastuvihar/private"
CLIENT_IP_HEADER="x-forwarded-for"
FORCE_HTTPS="1"
```

Create dedicated storage folder:
```bash
sudo mkdir -p /var/lib/vastuvihar/private
sudo chown -R $USER:$USER /var/lib/vastuvihar
```

### Step 5: Install, Initialize Database & Build
```bash
npm ci
npx prisma db push
npm run build

# Create initial admin account
ADMIN_BOOTSTRAP_PASSWORD="YourPassword123" node scripts/create-admin.mjs info@vastuvihar.org "Vastu Vihar Admin" SUPER_ADMIN
```

### Step 6: Start with PM2 on Port 3001
```bash
pm2 start ecosystem.config.js
pm2 save
```
Check with `pm2 list` — both your old website and `vastuvihar` will show running side-by-side!

### Step 7: Add a New Nginx Server Block (Zero Impact on Old Site)
**Do not touch your existing Nginx files.** Just add a new file for Vastu Vihar:
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/vastuvihar.conf
sudo nano /etc/nginx/sites-available/vastuvihar.conf
```
Replace `vastuvihar.org www.vastuvihar.org` in `server_name` with your actual domain for this site.

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/vastuvihar.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Get Free SSL for New Domain
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🆕 Scenario B: Fresh Lightsail Instance Setup

If you are setting up a completely new instance:
1. Create an Ubuntu 22.04 LTS instance ($5/month).
2. Attach a Static IP & open ports `80`, `443`, `22` in Lightsail Firewall.
3. SSH in and run:
   ```bash
   sudo mkdir -p /var/www/vastuvihar-website
   sudo chown -R $USER:$USER /var/www/vastuvihar-website
   git clone https://github.com/kumaranujranchi/vastuvihar-website.git /var/www/vastuvihar-website
   cd /var/www/vastuvihar-website
   sudo bash deploy/lightsail-setup.sh
   ```
4. Follow Steps 4 through 8 above.

---

## Useful PM2 Commands
- `pm2 list` — List all running websites and apps.
- `pm2 logs vastuvihar` — View live application logs.
- `pm2 restart vastuvihar` — Restart this website without touching other sites.
- `pm2 stop vastuvihar` — Stop this website.
