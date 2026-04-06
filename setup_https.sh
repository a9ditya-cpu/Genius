#!/bin/bash
# setup_https.sh - Installs Nginx + Certbot on the EC2 instance and configures HTTPS
# This runs automatically via GitHub Actions on every push to main

EC2_DOMAIN="ec2-65-2-188-162.ap-south-1.compute.amazonaws.com"
EMAIL="sinharajaditya@admin"  # Used for Let's Encrypt certificate expiry alerts

echo "=== Setting up HTTPS for $EC2_DOMAIN ==="

# Step 1: Install Nginx and Certbot if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get update -q
    sudo apt-get install -y nginx
fi

if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Step 2: Create certbot webroot directory for ACME challenge
sudo mkdir -p /var/www/certbot

# Step 3: Copy Nginx config (ONLY if it doesn't already have SSL managed by certbot)
if ! grep -q "ssl_certificate" /etc/nginx/sites-available/genius 2>/dev/null; then
    echo "Deploying base Nginx configuration..."
    sudo cp ~/Genius/nginx.conf /etc/nginx/sites-available/genius
    sudo ln -sf /etc/nginx/sites-available/genius /etc/nginx/sites-enabled/genius
    sudo rm -f /etc/nginx/sites-enabled/default
else
    echo "Nginx is already configured with SSL. Skipping base config overwrite."
fi

# Step 4: Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Step 5: Get SSL Certificate from Let's Encrypt (only if not already obtained)
if [ ! -d "/etc/letsencrypt/live/$EC2_DOMAIN" ]; then
    echo "Obtaining SSL Certificate from Let's Encrypt..."
    sudo certbot --nginx \
        -d $EC2_DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --redirect
else
    echo "SSL Certificate already exists, renewing if needed..."
    sudo certbot renew --quiet
fi

# Step 6: Final reload with SSL enabled
sudo systemctl reload nginx

echo "=== HTTPS Setup Complete! ==="
echo "Site is live at: https://$EC2_DOMAIN"
