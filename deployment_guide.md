
# AI-Based Educational Platform - Deployment Guide

## Project Structure
```
ai-educational-platform/
├── backend/
│   ├── rag_educational_platform.py    # Main FastAPI application
│   ├── requirements.txt               # Python dependencies
│   ├── .env                          # Environment variables
│   ├── models/                       # AI models and embeddings
│   ├── data/                         # Document storage
│   ├── uploads/                      # File upload directory
│   └── educational_rag.db           # SQLite database
├── frontend/
│   ├── index.html                    # Main web interface
│   ├── style.css                     # Styling
│   ├── app.js                        # JavaScript application
│   └── assets/                       # Images and resources
├── docker/
│   ├── Dockerfile                    # Container configuration
│   └── docker-compose.yml           # Multi-service setup
└── docs/
    ├── API.md                        # API documentation
    └── SETUP.md                      # Setup instructions
```

## Environment Setup

### 1. Create .env file
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_gpt5_api_key_here
OPENAI_ORG_ID=your_org_id_here

# Database Configuration
DATABASE_URL=sqlite:///./educational_rag.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=50MB

# Security
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# AI Model Configuration
EMBEDDING_MODEL=all-MiniLM-L6-v2
MAX_CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=5

# Performance
REDIS_URL=redis://localhost:6379  # Optional for caching
CELERY_BROKER_URL=redis://localhost:6379  # Optional for background tasks
```

### 2. Installation Steps

#### Local Development Setup
```bash
# Clone repository
git clone https://github.com/your-repo/ai-educational-platform.git
cd ai-educational-platform

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Download embedding models (first run)
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Initialize database
python -c "from rag_educational_platform import rag_framework; rag_framework.init_database()"

# Start development server
uvicorn rag_educational_platform:app --reload --host 0.0.0.0 --port 8000
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads data models

# Download embedding models
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "rag_educational_platform:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATABASE_URL=sqlite:///./data/educational_rag.db
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./frontend:/usr/share/nginx/html
    depends_on:
      - app

volumes:
  redis_data:
```

### 3. Production Deployment

#### AWS Deployment with EC2
```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# SSH into instance and run:

sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx -y

# Clone and setup application
git clone https://github.com/your-repo/ai-educational-platform.git
cd ai-educational-platform/backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/ai-edu-platform
sudo ln -s /etc/nginx/sites-available/ai-edu-platform /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Setup systemd service
sudo cp ai-edu-platform.service /etc/systemd/system/
sudo systemctl enable ai-edu-platform
sudo systemctl start ai-edu-platform
```

#### Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-edu-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-edu-platform
  template:
    metadata:
      labels:
        app: ai-edu-platform
    spec:
      containers:
      - name: app
        image: your-registry/ai-edu-platform:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: openai-key
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: ai-edu-platform-service
spec:
  selector:
    app: ai-edu-platform
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

### 4. Initial Data Setup

#### Upload Sample Documents
```bash
# Create sample documents directory
mkdir -p data/sample_documents

# Upload NEET/JEE study materials via API
curl -X POST "http://localhost:8000/api/upload-document" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@physics_ncert.pdf" \
  -F "exam_type=NEET" \
  -F "subject=Physics"
```

#### Populate Vector Database
```python
# populate_database.py
import asyncio
from rag_educational_platform import rag_framework

async def populate_initial_data():
    # Sample educational content for NEET Physics
    physics_content = [
        "Newton's First Law states that an object at rest stays at rest...",
        "The photoelectric effect demonstrates the particle nature of light...",
        "Thermodynamics deals with heat, work, temperature, and energy..."
    ]

    for i, content in enumerate(physics_content):
        await rag_framework.process_document(
            content, 
            f"physics_sample_{i+1}.txt", 
            "NEET", 
            "Physics"
        )

    print("Initial data populated successfully!")

if __name__ == "__main__":
    asyncio.run(populate_initial_data())
```

### 5. Monitoring and Maintenance

#### Health Check Endpoints
- `GET /api/health` - Overall system health
- `GET /api/stats/NEET` - NEET-specific statistics
- `GET /api/stats/JEE` - JEE-specific statistics

#### Logging Configuration
```python
# logging_config.py
import logging
from logging.handlers import RotatingFileHandler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler('logs/app.log', maxBytes=10485760, backupCount=5),
        logging.StreamHandler()
    ]
)
```

#### Performance Optimization
1. **Caching**: Use Redis for query result caching
2. **Database Indexing**: Optimize SQLite queries
3. **Model Loading**: Load embedding models once at startup
4. **Connection Pooling**: Use connection pooling for databases
5. **Async Processing**: Use Celery for heavy document processing

### 6. Security Best Practices

#### API Security
```python
# security.py
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Implement JWT token verification
    if not verify_jwt_token(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials.credentials
```

#### Environment Security
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use HTTPS in production
- Regular security updates for dependencies

### 7. Testing

#### Run Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=rag_educational_platform --cov-report=html
```

#### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/health

# Using Locust
locust -f load_test.py --host=http://localhost:8000
```

### 8. Backup and Recovery

#### Database Backup
```bash
# Backup SQLite database
cp educational_rag.db educational_rag_backup_$(date +%Y%m%d_%H%M%S).db

# Backup FAISS indices
tar -czf faiss_indices_backup_$(date +%Y%m%d_%H%M%S).tar.gz *.index
```

#### Recovery Procedures
1. Restore database from backup
2. Rebuild FAISS indices if corrupted
3. Reprocess documents if necessary
4. Verify system health after recovery

This deployment guide ensures a robust, scalable, and maintainable AI educational platform suitable for NEET/JEE preparation.
