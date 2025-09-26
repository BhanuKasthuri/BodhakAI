# Bodhak AI Educational Platform - Complete Deployment Guide

## Project Overview
Bodhak AI is an advanced AI-powered educational platform for NEET & JEE preparation featuring a RAG framework with GPT-5 integration, document processing, and interactive learning modules.

## System Architecture
```
Frontend (HTML/CSS/JS) → FastAPI Backend → OpenAI GPT-5 API
                      ↓
              FAISS Vector Database + SQLite
```

## Prerequisites
- Python 3.11+
- Node.js 18+ (for development)
- OpenAI API Key (GPT-5 access)
- Git
- Domain name (for production)
- Server/VPS with minimum 4GB RAM, 2 CPU cores, 50GB storage

## 1. Local Development Setup

### 1.1 Clone and Setup Project
```bash
# Create project directory
mkdir bodhak-ai-platform
cd bodhak-ai-platform

# Create folder structure
mkdir -p backend frontend static uploads data logs

# Copy provided files to respective directories
cp index.html frontend/
cp style.css frontend/
cp app.js frontend/
cp rag_educational_platform.py backend/
cp requirements.txt backend/
cp deployment_guide.md .
```

### 1.2 Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create environment file
cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_org_id_here
DATABASE_URL=sqlite:///./educational_rag.db
UPLOAD_DIR=../uploads
MAX_FILE_SIZE=50MB
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
EMBEDDING_MODEL=all-MiniLM-L6-v2
MAX_CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=5
EOF

# Initialize database and download models
python -c "
from sentence_transformers import SentenceTransformer
print('Downloading embedding models...')
SentenceTransformer('all-MiniLM-L6-v2')
print('Models downloaded successfully!')
"

# Start development server
uvicorn rag_educational_platform:app --reload --host 0.0.0.0 --port 8000
```

### 1.3 Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Create a simple HTTP server for development
python3 -m http.server 3000

# Or use Node.js if available
npx serve -p 3000
```

Visit `http://localhost:3000` to see the frontend and `http://localhost:8000/docs` for API documentation.

## 2. Production Deployment

### 2.1 Server Preparation (Ubuntu 22.04 LTS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv nginx certbot python3-certbot-nginx git htop

# Create application user
sudo adduser --system --group bodhak
sudo mkdir -p /var/www/bodhak-ai
sudo chown bodhak:bodhak /var/www/bodhak-ai

# Switch to application user
sudo -u bodhak -s
```

### 2.2 Application Deployment

```bash
# Clone repository
cd /var/www/bodhak-ai
git clone https://github.com/your-repo/bodhak-ai-platform.git .

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Download models
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Create production environment file
cat > .env << EOF
OPENAI_API_KEY=your_production_api_key
OPENAI_ORG_ID=your_org_id
DATABASE_URL=sqlite:///./data/educational_rag.db
UPLOAD_DIR=../uploads
MAX_FILE_SIZE=50MB
SECRET_KEY=your_secure_secret_key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EMBEDDING_MODEL=all-MiniLM-L6-v2
MAX_CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=5
EOF

# Create necessary directories
mkdir -p ../data ../uploads ../logs
```

### 2.3 Systemd Service Configuration

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/bodhak-ai.service << EOF
[Unit]
Description=Bodhak AI Educational Platform
After=network.target

[Service]
User=bodhak
Group=bodhak
WorkingDirectory=/var/www/bodhak-ai/backend
Environment=PATH=/var/www/bodhak-ai/backend/venv/bin
ExecStart=/var/www/bodhak-ai/backend/venv/bin/uvicorn rag_educational_platform:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable bodhak-ai
sudo systemctl start bodhak-ai
sudo systemctl status bodhak-ai
```

### 2.4 Nginx Configuration

```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/bodhak-ai << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend files
    location / {
        root /var/www/bodhak-ai/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Static files
    location /static/ {
        alias /var/www/bodhak-ai/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/bodhak-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.5 SSL Certificate Setup

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 3. Database and Data Setup

### 3.1 Initialize Database

```bash
cd /var/www/bodhak-ai/backend
source venv/bin/activate

# Initialize database
python -c "
from rag_educational_platform import rag_framework
print('Initializing database...')
rag_framework.init_database()
print('Database initialized successfully!')
"
```

### 3.2 Upload Sample Documents

```bash
# Create sample documents
mkdir -p /var/www/bodhak-ai/sample_docs

# Upload via API (example)
curl -X POST "https://yourdomain.com/api/upload-document" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_physics.pdf" \
  -F "exam_type=NEET" \
  -F "subject=Physics"
```

## 4. Monitoring and Maintenance

### 4.1 Log Management

```bash
# Setup log rotation
sudo cat > /etc/logrotate.d/bodhak-ai << EOF
/var/www/bodhak-ai/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 bodhak bodhak
    postrotate
        systemctl reload bodhak-ai
    endscript
}
EOF
```

### 4.2 Backup Strategy

```bash
# Create backup script
cat > /var/www/bodhak-ai/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/bodhak-ai"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup database
cp /var/www/bodhak-ai/backend/educational_rag.db \$BACKUP_DIR/db_backup_\$DATE.db

# Backup uploads
tar -czf \$BACKUP_DIR/uploads_backup_\$DATE.tar.gz /var/www/bodhak-ai/uploads

# Cleanup old backups (keep 30 days)
find \$BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: \$DATE"
EOF

chmod +x /var/www/bodhak-ai/backup.sh

# Setup daily backup cron
sudo crontab -e
# Add: 0 2 * * * /var/www/bodhak-ai/backup.sh
```

### 4.3 Health Monitoring

```bash
# Create health check script
cat > /var/www/bodhak-ai/health_check.sh << EOF
#!/bin/bash
API_URL="https://yourdomain.com/api/health"
RESPONSE=\$(curl -s -o /dev/null -w "%{http_code}" \$API_URL)

if [ \$RESPONSE -eq 200 ]; then
    echo "API is healthy"
else
    echo "API health check failed: \$RESPONSE"
    systemctl restart bodhak-ai
fi
EOF

chmod +x /var/www/bodhak-ai/health_check.sh

# Run every 5 minutes
sudo crontab -e
# Add: */5 * * * * /var/www/bodhak-ai/health_check.sh
```

## 5. Security Hardening

### 5.1 Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw --force enable
```

### 5.2 Rate Limiting (Nginx)

```bash
# Add to nginx.conf
sudo nano /etc/nginx/nginx.conf

# In http block, add:
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/m;

# In server block, add:
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... existing proxy configuration
}
```

## 6. Performance Optimization

### 6.1 Database Optimization

```python
# Add to backend initialization
import sqlite3

def optimize_database():
    conn = sqlite3.connect('educational_rag.db')
    cursor = conn.cursor()
    
    # Create indices for better performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_documents_exam_type ON documents(exam_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp)")
    
    conn.commit()
    conn.close()

optimize_database()
```

### 6.2 Caching Setup (Optional - Redis)

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 512mb
# Set: maxmemory-policy allkeys-lru

sudo systemctl restart redis
```

## 7. Testing and Validation

### 7.1 API Testing

```bash
# Test API endpoints
curl -X GET "https://yourdomain.com/api/health"
curl -X POST "https://yourdomain.com/api/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is photosynthesis?", "exam_type": "NEET"}'
```

### 7.2 Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Run load tests
ab -n 100 -c 10 https://yourdomain.com/api/health
```

## 8. Domain Configuration

### 8.1 DNS Settings
Point your domain to your server's IP address:
- A Record: yourdomain.com → your_server_ip
- CNAME Record: www.yourdomain.com → yourdomain.com

### 8.2 SSL Verification
```bash
# Test SSL configuration
curl -I https://yourdomain.com
```

## 9. Troubleshooting

### 9.1 Common Issues

**API not responding:**
```bash
sudo systemctl status bodhak-ai
sudo journalctl -u bodhak-ai -f
```

**Frontend not loading:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

**Database errors:**
```bash
ls -la /var/www/bodhak-ai/backend/
python -c "import sqlite3; print(sqlite3.sqlite_version)"
```

### 9.2 Log Analysis

```bash
# Application logs
tail -f /var/www/bodhak-ai/logs/app.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u bodhak-ai -f
```

## 10. Updates and Maintenance

### 10.1 Application Updates

```bash
cd /var/www/bodhak-ai
git pull origin main
sudo systemctl restart bodhak-ai
sudo systemctl reload nginx
```

### 10.2 Dependency Updates

```bash
cd /var/www/bodhak-ai/backend
source venv/bin/activate
pip list --outdated
pip install --upgrade package_name
```

## Conclusion

Your Bodhak AI educational platform is now deployed and ready for production use. The system includes:

- ✅ AI-powered RAG framework with GPT-5 integration
- ✅ Interactive web interface with modern design
- ✅ Document processing and vector search
- ✅ Real-time chat interface
- ✅ Practice question generation
- ✅ Analytics and progress tracking
- ✅ Production-ready deployment with security
- ✅ Monitoring and backup systems

For additional support or customization, refer to the API documentation at `/docs` endpoint or contact the development team.

**Live Demo Available at:** https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/4b74af67a08ba7e9fa541f69624ca5df/10f0bd97-1580-4080-8cd1-7e8c74d2c704/index.html