#!/bin/bash
# Bodhak AI - Ultra-Budget One-Click Deployment Script
# Designed for user 'bhanu' on Ubuntu-based systems.

set -e  # Exit on any error

echo "🚀 Starting Bodhak AI Ultra-Budget Deployment..."
echo ""

RED='\033[0;31m'     # Red color
GREEN='\033[0;32m'   # Green color
YELLOW='\033[1;33m'  # Yellow color
BLUE='\033[0;34m'    # Blue color
NC='\033[0m'         # No color

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_info() { echo -e "${BLUE}[ℹ]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check if running as non-root user
if [ "$USER" = "root" ]; then
  print_error "This script must NOT be run as root."
  echo "Please run as your non-root user 'bhanu' with sudo privileges."
  exit 1
fi

print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_info "Installing base dependencies..."
sudo apt install -y software-properties-common curl unzip wget

print_info "Adding deadsnakes PPA for Python versions..."
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

print_info "Installing Python 3.11 and related packages..."
sudo apt install -y python3.11 python3.11-venv python3.11-distutils

print_info "Installing pip for Python 3.11..."
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3.11 get-pip.py
rm get-pip.py
print_status "Python 3.11 and pip installed."

# Create user-specific directories (as bhanu)
print_info "Creating application directories..."
mkdir -p ~/bodhak-ai/{backend,frontend,logs,uploads,cache}
print_status "Directories created."

# Create and activate Python virtual environment (as bhanu)
print_info "Creating Python virtual environment..."
python3.11 -m venv ~/bodhak-ai/venv
source ~/bodhak-ai/venv/bin/activate
print_status "Virtual environment created."

if ! command -v ollama &> /dev/null; then
  curl -fsSL https://ollama.ai/install | bash
  echo 'export PATH="$HOME/.ollama/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  print_status "Ollama installed."
else
  print_status "Ollama already installed."
fi

if ! ~/.ollama/bin/ollama list | grep -q 'mistral:7b'; then
  print_info "Downloading Mistral 7b model (this may take some time)..."
  ~/.ollama/bin/ollama pull mistral:7b
  print_status "Mistral model downloaded."
else
  print_status "Mistral model already downloaded."
fi


# Creating environment config file with proper permissions
print_info "Generating environment configuration file..."
cat > ~/bodhak-ai/.env <<EOF
# Bodhak AI Ultra-Budget Configuration
OPENAI_API_KEY=
OPENAI_ORG_ID=

DATABASE_URL=sqlite:///$(pwd)/bodhak-ai/bodhak_ai.db

SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://www.bodhakai.com,https://bodhakai.com,http://localhost:8000

DAILY_API_LIMIT=1000
FREE_QUERIES_PER_DAY=5
BASIC_QUERIES_PER_DAY=50
PREMIUM_QUERIES_PER_DAY=200

MAX_CONCURRENT_REQUESTS=50
CACHE_TTL_HOURS=168
EOF
print_status "Environment configuration created."

# Save minimal requirements file
print_info "Creating minimal Python requirements file..."
cat > ~/bodhak-ai/requirements.txt <<EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==0.39.2
aiofiles==23.2.1
python-dotenv==1.0.0
requests==2.31.0
numpy==1.24.3
pandas==2.1.4
sentence-transformers==2.2.2
python-multipart==0.0.6
EOF

print_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r ~/bodhak-ai/requirements.txt
print_status "Python dependencies installed."

# Setup nginx config (run as sudo)
print_info "Setting up nginx configuration..."
sudo tee /etc/nginx/sites-available/bodhakai.com > /dev/null <<EOL
server {
    listen 80;
    server_name www.bodhakai.com bodhakai.com;

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    limit_req_zone \$binary_remote_addr zone=api:10m rate=5r/s;
    limit_req_zone \$binary_remote_addr zone=upload:10m rate=1r/s;

    location / {
        root /home/bhanu/bodhak-ai/frontend;
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

sudo ln -sf /etc/nginx/sites-available/bodhakai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl restart nginx
print_status "Nginx configured and restarted."

# Setup systemd service for bodhak-ai (run as sudo)
print_info "Setting up systemd service for Bodhak AI..."
sudo tee /etc/systemd/system/bodhak-ai.service > /dev/null <<EOL
[Unit]
Description=Bodhak AI Backend Service
After=network.target

[Service]
Type=simple
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
print_status "Bodhak AI service started."

# Setup firewall rules
print_info "Configuring firewall rules..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
print_status "Firewall configured."

# Setup log rotation
print_info "Setting up log rotation..."
sudo tee /etc/logrotate.d/bodhak-ai > /dev/null <<EOL
/home/bhanu/bodhak-ai/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 644 bhanu bhanu
}
EOL
print_status "Log rotation configured."

# Create a simple placeholder frontend page to confirm deployment
print_info "Creating sample frontend page..."
cat > ~/bodhak-ai/frontend/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bodhak AI - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: white; text-align: center; padding: 50px; }
        h1 { color: #0ea0e1; font-size: 3rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; }
        .box { background: #1e293b; padding: 30px; border-radius: 12px; margin: 0 auto; max-width: 600px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>🧠 Bodhak AI is being prepared...</h1>
        <p>We are setting up your AI-powered NEET & JEE platform.</p>
        <p>Access will be available at <strong>www.bodhakai.com</strong> soon.</p>
    </div>
</body>
</html>
EOL
print_status "Sample frontend page created."

echo
echo "🍀 Deployment Complete! Please follow next steps:"
echo " - Ensure DNS for www.bodhakai.com points to this server"
echo " - Run backend via systemd: sudo systemctl start bodhak-ai"
echo " - Monitor logs: sudo journalctl -fu bodhak-ai"
echo " - To update, place backend/frontend code into ~/bodhak-ai/"
echo
