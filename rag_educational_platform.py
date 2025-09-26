
# AI-Based Educational Platform - RAG Framework Implementation
# FastAPI Backend with FAISS Vector Database and GPT-5 Integration

import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime

# FastAPI and web framework imports
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# RAG and AI imports
import openai
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import PyPDF2
import docx
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

# Data processing imports
import pandas as pd
import sqlite3

# Configure OpenAI API (GPT-5)
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI(
    title="EduAI Pro - RAG Backend",
    description="AI-powered educational platform for NEET/JEE preparation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class QueryRequest(BaseModel):
    query: str
    exam_type: str = Field(..., regex="^(NEET|JEE)$")
    subject: Optional[str] = None
    difficulty: Optional[str] = "medium"

class QuestionGenerationRequest(BaseModel):
    exam_type: str = Field(..., regex="^(NEET|JEE)$")
    subject: str
    topic: str
    difficulty: str = Field(..., regex="^(easy|medium|hard)$")
    question_type: str = Field(..., regex="^(MCQ|numerical|theory)$")
    count: int = Field(default=5, ge=1, le=20)

class DocumentUpload(BaseModel):
    filename: str
    content: str
    exam_type: str
    subject: str

class QueryResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[Dict[str, Any]]
    processing_time: float
    hallucination_check: bool

# RAG Framework Class
class EducationalRAGFramework:
    def __init__(self):
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embedding_dimension = 384

        # Initialize FAISS indices for different exam types
        self.faiss_indices = {
            'NEET': faiss.IndexFlatL2(self.embedding_dimension),
            'JEE': faiss.IndexFlatL2(self.embedding_dimension)
        }

        # Document storage
        self.document_storage = {
            'NEET': [],
            'JEE': []
        }

        # Text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        # Initialize database
        self.init_database()

    def init_database(self):
        """Initialize SQLite database for storing metadata"""
        self.conn = sqlite3.connect('educational_rag.db', check_same_thread=False)
        cursor = self.conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT,
                exam_type TEXT,
                subject TEXT,
                upload_date TIMESTAMP,
                chunk_count INTEGER,
                processed BOOLEAN
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT,
                response TEXT,
                exam_type TEXT,
                timestamp TIMESTAMP,
                confidence FLOAT,
                hallucination_detected BOOLEAN
            )
        ''')

        self.conn.commit()

    async def process_document(self, content: str, filename: str, exam_type: str, subject: str):
        """Process and index a document"""
        try:
            # Split document into chunks
            chunks = self.text_splitter.split_text(content)

            # Create embeddings for chunks
            embeddings = self.embedding_model.encode(chunks)

            # Add to FAISS index
            self.faiss_indices[exam_type].add(embeddings.astype('float32'))

            # Store document metadata
            for i, chunk in enumerate(chunks):
                self.document_storage[exam_type].append({
                    'content': chunk,
                    'filename': filename,
                    'subject': subject,
                    'chunk_id': len(self.document_storage[exam_type]),
                    'embedding_index': len(self.document_storage[exam_type])
                })

            # Update database
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT INTO documents (filename, exam_type, subject, upload_date, chunk_count, processed)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (filename, exam_type, subject, datetime.now(), len(chunks), True))
            self.conn.commit()

            return {"status": "success", "chunks_created": len(chunks)}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def retrieve_relevant_chunks(self, query: str, exam_type: str, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant document chunks for a query"""
        try:
            # Create query embedding
            query_embedding = self.embedding_model.encode([query])

            # Search FAISS index
            distances, indices = self.faiss_indices[exam_type].search(
                query_embedding.astype('float32'), top_k
            )

            # Retrieve relevant chunks
            relevant_chunks = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.document_storage[exam_type]):
                    chunk_data = self.document_storage[exam_type][idx].copy()
                    chunk_data['relevance_score'] = 1 / (1 + distances[0][i])  # Convert distance to similarity
                    relevant_chunks.append(chunk_data)

            return relevant_chunks

        except Exception as e:
            print(f"Error in retrieval: {e}")
            return []

    async def check_hallucination(self, query: str, answer: str, sources: List[Dict]) -> bool:
        """Check if the answer contains hallucinations"""
        try:
            # Prepare context from sources
            context = "\n".join([source['content'] for source in sources])

            # Create verification prompt
            verification_prompt = f"""
            Context: {context}

            Question: {query}
            Answer: {answer}

            Based ONLY on the provided context, is the answer factually correct and grounded in the source material?
            Respond with 'VERIFIED' if the answer is accurate and supported by the context, or 'HALLUCINATION' if it contains unsupported or incorrect information.

            Response:"""

            response = await openai.ChatCompletion.acreate(
                model="gpt-4",  # Using GPT-4 for verification
                messages=[
                    {"role": "system", "content": "You are a fact-checking assistant. Only verify information that is directly supported by the provided context."},
                    {"role": "user", "content": verification_prompt}
                ],
                max_tokens=10,
                temperature=0
            )

            result = response.choices[0].message.content.strip()
            return result == "VERIFIED"

        except Exception as e:
            print(f"Error in hallucination check: {e}")
            return False

    async def generate_response(self, query: str, exam_type: str, subject: Optional[str] = None) -> QueryResponse:
        """Generate AI response using RAG"""
        start_time = asyncio.get_event_loop().time()

        try:
            # Retrieve relevant chunks
            relevant_chunks = await self.retrieve_relevant_chunks(query, exam_type)

            if not relevant_chunks:
                raise HTTPException(status_code=404, detail="No relevant content found")

            # Prepare context
            context = "\n\n".join([
                f"Source {i+1} ({chunk['filename']} - {chunk['subject']}): {chunk['content']}"
                for i, chunk in enumerate(relevant_chunks)
            ])

            # Create GPT-5 prompt
            system_prompt = f"""You are an AI tutor specializing in {exam_type} preparation. 
            Use ONLY the provided context to answer questions. If the context doesn't contain 
            sufficient information, clearly state that. Always cite your sources and provide 
            accurate, helpful explanations suitable for competitive exam preparation."""

            user_prompt = f"""
            Context: {context}

            Question: {query}

            Please provide a comprehensive answer based on the context provided. Include:
            1. A clear, detailed explanation
            2. Key concepts and formulas if applicable
            3. Citations to the source materials
            4. Any tips for {exam_type} exam preparation related to this topic
            """

            # Generate response with GPT-5
            response = await openai.ChatCompletion.acreate(
                model="gpt-5",  # Using GPT-5 as requested
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )

            answer = response.choices[0].message.content

            # Check for hallucinations
            hallucination_check = await self.check_hallucination(query, answer, relevant_chunks)

            # Calculate confidence based on relevance scores
            confidence = sum([chunk['relevance_score'] for chunk in relevant_chunks]) / len(relevant_chunks)

            # Prepare sources
            sources = [
                {
                    'filename': chunk['filename'],
                    'subject': chunk['subject'],
                    'relevance_score': chunk['relevance_score'],
                    'content_preview': chunk['content'][:200] + "..."
                }
                for chunk in relevant_chunks
            ]

            processing_time = asyncio.get_event_loop().time() - start_time

            # Log interaction
            cursor = self.conn.cursor()
            cursor.execute('''
                INSERT INTO interactions (query, response, exam_type, timestamp, confidence, hallucination_detected)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (query, answer, exam_type, datetime.now(), confidence, not hallucination_check))
            self.conn.commit()

            return QueryResponse(
                answer=answer,
                confidence=confidence,
                sources=sources,
                processing_time=processing_time,
                hallucination_check=hallucination_check
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

    async def generate_practice_questions(self, request: QuestionGenerationRequest) -> List[Dict]:
        """Generate practice questions using AI"""
        try:
            # Retrieve relevant content for the topic
            topic_query = f"{request.subject} {request.topic}"
            relevant_chunks = await self.retrieve_relevant_chunks(topic_query, request.exam_type, top_k=3)

            context = "\n".join([chunk['content'] for chunk in relevant_chunks])

            prompt = f"""Based on the following content from {request.exam_type} study materials, 
            generate {request.count} {request.difficulty} level {request.question_type} questions 
            on the topic of {request.topic} in {request.subject}.

            Context: {context}

            For MCQ questions, provide 4 options with the correct answer.
            For numerical questions, provide the question and expected answer format.
            For theory questions, provide clear, conceptual questions.

            Format your response as JSON with the following structure:
            {{
                "questions": [
                    {{
                        "question": "question text",
                        "type": "{request.question_type}",
                        "difficulty": "{request.difficulty}",
                        "topic": "{request.topic}",
                        "options": ["A", "B", "C", "D"] (for MCQ only),
                        "correct_answer": "answer",
                        "explanation": "detailed explanation"
                    }}
                ]
            }}
            """

            response = await openai.ChatCompletion.acreate(
                model="gpt-5",
                messages=[
                    {"role": "system", "content": f"You are an expert {request.exam_type} question creator."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )

            # Parse JSON response
            questions_data = json.loads(response.choices[0].message.content)
            return questions_data["questions"]

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# Initialize RAG framework
rag_framework = EducationalRAGFramework()

# API Endpoints
@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process student query using RAG"""
    return await rag_framework.generate_response(
        request.query, 
        request.exam_type, 
        request.subject
    )

@app.post("/api/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    exam_type: str = "NEET",
    subject: str = "Physics"
):
    """Upload and process educational documents"""
    try:
        # Read file content
        content = await file.read()

        # Process based on file type
        text_content = ""
        if file.filename.endswith('.pdf'):
            # Process PDF (simplified - in production use proper PDF parsing)
            text_content = "PDF content processing would be implemented here"
        elif file.filename.endswith('.docx'):
            # Process DOCX
            text_content = "DOCX content processing would be implemented here"
        elif file.filename.endswith('.txt'):
            text_content = content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        # Process document with RAG framework
        result = await rag_framework.process_document(
            text_content, 
            file.filename, 
            exam_type, 
            subject
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-questions")
async def generate_practice_questions(request: QuestionGenerationRequest):
    """Generate practice questions"""
    questions = await rag_framework.generate_practice_questions(request)
    return {"questions": questions}

@app.get("/api/stats/{exam_type}")
async def get_exam_stats(exam_type: str):
    """Get statistics for an exam type"""
    cursor = rag_framework.conn.cursor()

    # Get document count
    cursor.execute("SELECT COUNT(*) FROM documents WHERE exam_type = ?", (exam_type,))
    doc_count = cursor.fetchone()[0]

    # Get interaction count
    cursor.execute("SELECT COUNT(*) FROM interactions WHERE exam_type = ?", (exam_type,))
    interaction_count = cursor.fetchone()[0]

    # Get average confidence
    cursor.execute("SELECT AVG(confidence) FROM interactions WHERE exam_type = ?", (exam_type,))
    avg_confidence = cursor.fetchone()[0] or 0

    return {
        "exam_type": exam_type,
        "documents_processed": doc_count,
        "total_queries": interaction_count,
        "average_confidence": round(avg_confidence, 2),
        "index_size": rag_framework.faiss_indices[exam_type].ntotal
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "indices_ready": {
            "NEET": rag_framework.faiss_indices["NEET"].ntotal > 0,
            "JEE": rag_framework.faiss_indices["JEE"].ntotal > 0
        }
    }

# Serve static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
