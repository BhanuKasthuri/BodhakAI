#!/bin/bash
# Bodhak AI deployment with HuggingFace local LLM support for user 'bhanu'.

set -e

echo "🚀 !!Starting HuggingFace LLM based BodhAK AI deployment.!!"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_info() { echo -e "${BLUE}[ℹ]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

if [ "$USER" = "root" ]; then
  print_error "Do not run this script as root. Switch to user 'bhanu' and run.";
  exit 1
fi

print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_info "Installing base dependencies..."
sudo apt install -y software-properties-common curl wget unzip build-essential libssl-dev libcurl4-openssl-dev libbz2-dev liblzma-dev zlib1g-dev

print_info "Adding deadsnakes PPA for Python versions..."
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

print_info "Installing Python 3.11, venv and build dependencies..."
sudo apt install -y python3.11 python3.11-venv python3.11-distutils

print_info "Installing pip for Python 3.11..."
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3.11 get-pip.py
rm get-pip.py
print_status "Python 3.11 and pip installed."

print_info "Setting up application directories..."
mkdir -p ~/bodhak-ai/{backend,frontend,logs,uploads,cache}
print_status "Directories created."

print_info "Creating Python virtual environment..."
python3.11 -m venv ~/bodhak-ai/venv
source ~/bodhak-ai/venv/bin/activate
print_status "Virtual environment created."

print_info "Generating requirements.txt..."
cat > ~/bodhak-ai/requirements.txt <<EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
transformers==4.33.2
torch==2.0.1
sentence-transformers==2.2.2
numpy==1.26.1
pandas==2.0.2
aiofiles==23.1.0
python-multipart==0.0.6
python-dotenv==1.0
requests==2.31.0
EOF

print_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r ~/bodhak-ai/requirements.txt
print_status "Python dependencies installed."

print_info "Creating environment configuration..."
cat > ~/bodhak-ai/.env <<EOF
OPENAI_API_KEY=
OPENAI_ORG_ID=

DATABASE_URL=sqlite:///\$HOME/bodhak-ai/bodhak_ai.db

SECRET_KEY=\$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://www.bodhakai.com,https://bodakai.com,http://localhost:8000

DAILY_API_LIMIT=1000
FREE_QUERIES=5
BASIC_QUERIES=50
PREMIUM_QUERIES=200

CACHE_TTL=168
EOF
print_status ".env created."

print_info "Configuring nginx..."

# Ensure nginx config directories exist
print_info "Checking and creating Nginx configuration directories if needed..."
if [ ! -d "/etc/nginx/sites-available" ]; then
  sudo mkdir -p /etc/nginx/sites-available
  print_status "/etc/nginx/sites-available created."
fi

if [ ! -d "/etc/nginx/sites-enabled" ]; then
  sudo mkdir -p /etc/nginx/sites-enabled
  print_status "/etc/nginx/sites-enabled created."
fi

sudo tee /etc/nginx/sites-available/bodhakai.com >/dev/null <<EOL
server {
    listen 80;
    server_name www.bodhakai.com bodakai.com;

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        root /home/bhaki-ai/../frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        location ~* \\\\.\\\\(css|js|png|jpg|jpeg|gif|ico|svg)\\\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:8000/api/health;
        access_log off;
    }
}
EOL

sudo ln -sf /etc/nginx/sites-available/bodhakai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
nginx -t && sudo systemctl restart nginx
print_status "nginx configured/restarted."

print_info "Creating systemd service for BodhAK AI..."
sudo tee /etc/systemd/system/bodhak-ai.service >/dev/null <<EOL
[Unit]
Description=BodhAK AI Backend Service
After=network.target

[Service]
User=bhanu
WorkingDirectory=/home/bhanu/bodhak-ai/backend
Environment=PATH=/home/bhanu/bodhak-ai/venv/bin
ExecStart=/home/bhanu/bodhak-ai/venv/bin/python /home/bhanu/bodhak-ai/backend/bodhak_ai.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable bodhak-ai
sudo systemctl start bodhak-ai
print_status "bodhak-ai service started."

print_info "Setting up firewall..."
sudo ufw allow OpenSSH
if sudo ufw app list | grep -q 'Nginx Full'; then
  sudo ufw allow 'Nginx Full'
else
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
fi

sudo ufw --force enable
print_status "Firewall configured."

print_info "Setting up logrotate..."
sudo tee /etc/logrotate.d/bodhak-ai >/dev/null <<EOL
/home/bhaki-ai/logs/*.log {
    daily
    rotate 7
    copytruncate
    missingok
    notifempty
    compress
}
EOL

print_status "Logrotate configured."

print_info "Creating frontend placeholder..."
cat > ~/bodhak-ai/frontend/index.html <<EOF
<!DOCTYPE html>
<html>
<head><title>BodhAK AI Launching</title>
<style>
body {background:#0b1120; color:#e0e6f1;
font-family: Arial, sans-serif; text-align:center; padding:40px;}
h1 {font-size:3rem; color:#4ca0d3;}
.box {background:#192a46; padding:30px; border-radius:12px; max-width:600px; margin:5% auto;}
</style></head>
<body>
<div class="box">
<h1>BodhAK AI is Preparing Your Learning Experience</h1>
<p>Soon accessible at <strong>www.bodhakai.com</strong></p>
</div>
</body>
</html>
EOF
print_status "Frontend placeholder created."

echo
echo "Deployment Completed! Check http://localhost or your domain when DNS propagates."
echo "Manage service: sudo systemctl {start,stop,restart,status} bodhak-ai"
echo "View logs: sudo journalctl -u bodhak-ai -f"
echo
