# AWS Lightsail Deployment Guide for Vastu Vihar

This document explains how to host the Vastu Vihar Next.js website on **AWS Lightsail**.

---

## Why AWS Lightsail?
- **No Cold Starts & No 50ms Limits**: Full CPU and RAM dedicated to your Node.js application (no Cloudflare 1102 errors).
- **Persistent Local Storage**: Real disk storage for uploaded blog photos, gallery images, and resumes.
- **Cost Effective**: Plans start at $3.50 – $5 / month with 1GB RAM, 1 vCPU, 40GB SSD, and 1TB–2TB bandwidth.

---

## Option 1: Linux VPS Instance (Recommended)

### Step 1: Create an AWS Lightsail Instance
1. Log in to [AWS Lightsail Console](https://lightsail.aws.amazon.com/).
2. Click **Create instance**.
3. Select your instance location (choose **Mumbai (`ap-south-1`)** for fastest speed in India).
4. Platform: **Linux/Unix**.
5. Blueprint: **OS Only -> Ubuntu 22.04 LTS** (or 24.04 LTS).
6. Plan: **$5/month** (1 GB RAM, 1 vCPU, 40 GB SSD) or **$10/month** (2 GB RAM) for higher traffic.
7. Name your instance: `vastuvihar-web` and click **Create instance**.

### Step 2: Attach a Static IP & Open Ports
1. Go to **Networking** tab in Lightsail.
2. Click **Create static IP** and attach it to your instance (`vastuvihar-web`).
3. Under **IPv4 Firewall**, ensure these ports are open:
   - **HTTP (80)**
   - **HTTPS (443)**
   - **SSH (22)**

### Step 3: Connect and Run Setup Script
Connect via SSH in browser or terminal:
```bash
# Clone the repository
sudo mkdir -p /var/www/vastuvihar-website
sudo chown -R ubuntu:ubuntu /var/www/vastuvihar-website
git clone https://github.com/kumaranujranchi/vastuvihar-website.git /var/www/vastuvihar-website
cd /var/www/vastuvihar-website

# Run the automated Lightsail setup script
sudo bash deploy/lightsail-setup.sh
```

### Step 4: Configure Environment & Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your production details:
nano .env
```
Key settings in `.env`:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="file:/var/lib/vastuvihar/app.db"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
PRIVACY_HASH_SECRET="generate-a-random-32-char-string-here"
RETENTION_CRON_SECRET="generate-a-random-32-char-string-here"
PRIVATE_STORAGE_DIR="/var/lib/vastuvihar/private"
CLIENT_IP_HEADER="x-forwarded-for"
FORCE_HTTPS="1"
```

### Step 5: Install, Initialize Database & Build
```bash
cd /var/www/vastuvihar-website

# Install dependencies
npm ci

# Push database schema to SQLite
npx prisma db push

# Create initial admin user
ADMIN_BOOTSTRAP_PASSWORD="YourSecurePassword123" node scripts/create-admin.mjs info@vastuvihar.org "Vastu Vihar Admin" SUPER_ADMIN

# Build Next.js application
npm run build
```

### Step 6: Start with PM2
```bash
# Start Next.js using PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 7: Configure Nginx & SSL
```bash
# Copy Nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/vastuvihar

# Update domain in config
sudo nano /etc/nginx/sites-available/vastuvihar

# Enable site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/vastuvihar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install free SSL certificate via Let's Encrypt Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 2: AWS Lightsail Container Service (Docker)

If you prefer serverless Docker deployment:
1. Build the Docker image locally or in CI/CD:
   ```bash
   docker build -t vastuvihar-website .
   ```
2. In Lightsail Console, click **Containers** -> **Create container service**.
3. Choose **Nano ($7/mo)** or **Micro ($10/mo)**.
4. Deploy using the built image:
   - Port: `3000` (HTTP)
   - Set environment variables (`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `PRIVACY_HASH_SECRET`, etc.).

---

## Maintenance & Updates
Whenever new code is pushed to GitHub:
```bash
cd /var/www/vastuvihar-website
git pull origin main
npm ci
npx prisma db push
npm run build
pm2 restart vastuvihar-website
```
