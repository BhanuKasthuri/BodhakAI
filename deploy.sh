#!/bin/bash
# Bodhak AI - Ultra-Budget Deployment Script for user 'bhanu'

set -e

echo "🚀 Starting Bodhak AI Ultra-Budget Deployment.!!!"
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
sudo apt install -y software-properties-common curl unzip wget

print_info "Adding deadsnakes PPA..."
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

print_info "Installing Python 3.11 and required packages..."
sudo apt install -y python3.11 python3.11-venv python3.11-distutils

print_info "Installing pip for Python 3.11..."
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3.11 get-pip.py
rm get-pip.py
print_status "Python 3.11 and pip installed."

print_info "Creating user directories..."
mkdir -p ~/bodhak-ai/{backend,frontend,logs,cache,uploads}
print_status "Directories created."

print_info "Setting up Python virtual environment..."
python3.11 -m venv ~/bodhak-ai/venv
source ~/bodhak-ai/venv/bin/activate
print_status "Virtual environment created."

print_info "Checking Ollama CLI installation..."
if ! command -v ollama &>/dev/null; then
  print_info "Ollama CLI not found. Installing..."
  curl -fsSL https://ollama.ai/install | bash
  export PATH="$HOME/.ollama/bin:$PATH"
  echo 'export PATH="$HOME/.ollama/bin:$PATH"' >> ~/.bashrc
  print_status "Ollama CLI installed."
else
  print_status "Ollama CLI already installed."
fi

# Reload bash config for path changes
source ~/.bashrc || true

print_info "Ensuring Ollama CLI is ready..."
if command -v ollama &>/dev/null; then
  if ! ollama list | grep -q 'mistral:7b'; then
    ollama pull mistral:7b
    print_status "Mistral 7b model downloaded."
  else
    print_status "Mistral 7b model already present."
  fi
else
  print_error "Ollama CLI failed to install or not found in PATH."
  print_error "Please verify installation manually and re-run the script."
  exit 1
fi

print_info "Creating environment configuration..."
cat > ~/bodhak-ai/.env <<EOF
# Bodhak AI configuration

OPENAI_API_KEY=
OPENAI_ORG_ID=

DATABASE_URL=sqlite:///\$HOME/bodhak-ai/bodhak_ai.db

SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://www.bodhakai.com,https://bodakai.com,http://localhost:8000

DAILY_API_LIMIT=1000
FREE_QUERIES=5
BASIC_QUERIES=50
PREMIUM_QUERIES=200

CACHE_TTL=168
EOF
print_status "Environment file created."

print_info "Generating minimal requirements file..."
cat > ~/bodhak-ai/requirements.txt <<EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==0.39.2
aiofiles==0.9.1
python-dotenv==0.21.0
requests==2.28.1
numpy==1.22.4
pandas==1.4.1
sentence-transformers==2.2.0
python-multipart==0.0.5
EOF

print_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r ~/bodhak-ai/requirements.txt
print_status "Python dependencies installed."

print_info "Configuring nginx..."
sudo tee /etc/nginx/sites-available/bodakai.com > /dev/null <<EOL
server {
    listen 80;
    server_name www.bodhakai.com bodakai.com;

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    limit_req_zone \$binary_remote_addr zone=api:10m rate=5r/s;
    limit_req_zone \$binary_remote_addr zone=upload:10m rate=1r/s;

    location / {
        root /home/bhaki-ai/../frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        location ~* \\\.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    location /health {
        proxy_pass http://127.0.0.1:8000/api/health;
        access_log off;
    }
}
EOL

sudo ln -sf /etc/nginx/sites-available/bodakai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

nginx -t && sudo systemctl restart nginx
print_status "nginx configured and restarted."

print_info "Setting up systemd service..."
sudo tee /etc/systemd/system/bodhak-ai.service > /dev/null << EOL
[Unit]
Description=Bodhak AI backend
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
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
print_status "Firewall configured."

print_info "Setting up log rotation..."
sudo tee /etc/logrotate.d/bodhak-ai > /dev/null << EOL
/home/bhaki-ai/logs/*.log {
    daily
    rotate 7
    copytruncate
    missingok
    notifempty
    compress
}
EOL

print_status "Log rotation configured."

print_info "Creating sample frontend page..."
cat > ~/bodhak-ai/frontend/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bodhak AI - Coming Soon</title>
    <style>
        body { background: #0f172a; color: white; font-family: Arial, sans-serif; padding: 50px; }
        .container { max-width: 600px; margin: auto; text-align: center; }
        h1 { font-size: 3rem; color: #0ea0e1; }
        p { font-size: 1.2rem; }
        .box { background: #1e293b; padding: 40px; border-radius: 12px; margin-top: 30px; }
    </style>
</head>
<body>
<div class="container">
  <h1>🧠 Bodhak AI</h1>
  <div class="box">
    <p>Preparing your AI-powered NEET & JEE platform.</p>
    <p>Access will be live at www.bodhakai.com soon.</p>
  </div>
</div>
</body>
</html>
EOF
print_status "Sample frontend page created."

echo ""
echo "🎉 Deployment complete!"
echo "Visit https://www.bodhakai.com after DNS setup."
echo "Manage backend: sudo systemctl {start|stop|restart|status} bodhak-ai"
echo "View logs: sudo journalctl -u bodhak-ai -f"
echo ""
