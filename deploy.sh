#!/bin/bash
# Bodhak AI - Ultra-Budget One-Click Deployment Script
# Deploy on Oracle Cloud or Ubuntu server

set -e  # Exit on error

echo "🚀 Starting Bodhak AI Ultra-Budget Deployment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should NOT be run as root for security reasons."
   echo "Please run as a regular user with sudo privileges."
   exit 1
fi

print_info "Checking system requirements..."

# Update system packages
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install base dependencies and Python 3.11
print_info "Installing base dependencies and Python 3.11..."
sudo apt install -y software-properties-common

print_info "Adding deadsnakes PPA for Python versions..."
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

print_info "Installing Python 3.11, venv, and distutils..."
sudo apt install -y python3.11 python3.11-venv python3.11-distutils

# Install pip for Python 3.11 using get-pip.py
print_info "Installing pip for Python 3.11..."
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3.11 get-pip.py
rm get-pip.py

print_status "Python 3.11 and pip installed."

# Create application user if doesn't exist
if ! id "bodhak" &>/dev/null; then
    print_info "Creating application user 'bodhak'..."
    sudo adduser --disabled-password --gecos "" bodhak
    sudo usermod -aG sudo bodhak
    print_status "User 'bodhak' created."
fi

# Setup directories and permissions
print_info "Setting up application directories..."
sudo -u bodhak mkdir -p /home/bodhak/bodhak-ai/{backend,frontend,logs,uploads,cache}
print_status "Directories created."

# Setup Python virtual environment
print_info "Setting up Python virtual environment..."
sudo -u bodhak python3.11 -m venv /home/bodhak/bodhak-ai/venv
print_status "Virtual environment created."

# Install Ollama (optional)
print_info "Installing Ollama for local AI models if not present..."
if ! command -v ollama &>/dev/null; then
    curl -fsSL https://ollama.ai/install | bash
    print_status "Ollama installed."
    print_info "Downloading Mistral 7B model (this may take time)..."
    sudo -u bodhak ollama pull mistral:7b
    print_status "Mistral 7B model downloaded."
else
    print_status "Ollama already installed."
fi

# Setup environment variables file
print_info "Creating environment configuration..."
sudo -u bodhak tee /home/bodhak/bodhak-ai/.env >/dev/null <<EOF
# Bodhak AI Ultra-Budget Configuration

OPENAI_API_KEY=
OPENAI_ORG_ID=

DATABASE_URL=sqlite:///./bodhak_ai_budget.db

SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://www.bodhakai.com,https://bodhakai.com,http://localhost:8000

DAILY_API_LIMIT=1000
FREE_QUERIES_PER_DAY=5
BASIC_QUERIES_PER_DAY=50
PREMIUM_QUERIES_PER_DAY=200

MAX_CONCURRENT_REQUESTS=50
CACHE_TTL_HOURS=168
EOF

print_status "Environment file created."

# Create minimal Python requirements file
print_info "Creating minimal requirements file..."
sudo -u bodhak tee /home/bodhak/bodhak-ai/requirements.txt >/dev/null <<EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.0.12
aiofiles==23.2.1
python-dotenv==1.0.0
requests==2.31.0
numpy==1.24.3
pandas==2.1.4
sentence-transformers==2.2.2
python-multipart==0.0.6
EOF

# Install Python dependencies in virtualenv
print_info "Installing Python dependencies..."
sudo -u bodhak /home/bodhak/bodhak-ai/venv/bin/pip install --upgrade pip
sudo -u bodhak /home/bodhak/bodhak-ai/venv/bin/pip install -r /home/bodhak/bodhak-ai/requirements.txt
print_status "Python dependencies installed."

# Configure Nginx for your domain
print_info "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/bodhakai.com >/dev/null <<EOL
server {
    listen 80;
    server_name www.bodhakai.com bodhakai.com;

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    limit_req_zone \$binary_remote_addr zone=api:10m rate=5r/s;
    limit_req_zone \$binary_remote_addr zone=upload:10m rate=1r/s;

    location / {
        root /home/bodhak/bodhak-ai/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
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

sudo ln -sf /etc/nginx/sites-available/bodhakai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

nginx -t && sudo systemctl restart nginx
print_status "Nginx configured and running."

# Create systemd service
print_info "Creating systemd service for Bodhak AI..."
sudo tee /etc/systemd/system/bodhak-ai.service >/dev/null <<EOL
[Unit]
Description=Bodhak AI Backend Service
After=network.target

[Service]
Type=simple
User=bodhak
Group=bodhak
WorkingDirectory=/home/bodhak/bodhak-ai/backend
Environment=PATH=/home/bodhak/bodhak-ai/venv/bin
Environment=PYTHONPATH=/home/bodhak/bodhak-ai/backend
ExecStart=/home/bodhak/bodhak-ai/venv/bin/python /home/bodhak/bodhak-ai/backend/bodak_ai_budget_backend.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable bodhak-ai
sudo systemctl start bodhak-ai
print_status "Bodhak AI service started."

# Setup firewall rules
print_info "Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
print_status "Firewall configured."

# Create log rotation
sudo tee /etc/logrotate.d/bodhak-ai >/dev/null <<EOL
/home/bodhak/bodhak-ai/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 644 bodhak bodhak
}
EOL

print_status "Log rotation configured."

print_info "Creating sample frontend page..."
sudo -u bodhak tee /home/bodhak/bodhak-ai/frontend/index.html >/dev/null <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bodhak AI - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: white; text-align: center; padding: 50px; }
        h1 { color: #0ea5e9; font-size: 3rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; }
        .box { background: #1e293b; padding: 2rem; border-radius: 10px; margin: 20px auto; max-width: 600px; }
    </style>
</head>
<body>
    <h1>🧠 Bodhak AI</h1>
    <div class="box">
        <p>Preparing your ultimate AI-powered NEET & JEE platform.</p>
        <p>Deployment completed successfully. Upload your content and start learning!</p>
        <p>Stay tuned for live access at <strong>www.bodhakai.com</strong></p>
    </div>
</body>
</html>
EOL

print_status "Sample frontend page created."

echo ""
echo "🎉 Bodhak AI Ultra-Budget Deployment Complete!"
echo "Visit https://www.bodhakai.com when DNS is configured."
echo "To start backend manually: /home/bodhak/bodhak-ai/venv/bin/python /home/bodhak/bodhak-ai/backend/bodak_ai_budget_backend.py"
echo "Manage service: sudo systemctl {start|stop|restart|status} bodhak-ai"
echo ""
