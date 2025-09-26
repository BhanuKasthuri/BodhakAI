// Bodhak AI Application JavaScript

// Application Data
const appData = {
  branding: {
    name: "Bodhak AI",
    tagline: "Master NEET & JEE with AI-Powered Learning",
    description: "India's most advanced AI-powered platform for NEET and JEE preparation with personalized learning, intelligent doubt solving, and comprehensive practice tests."
  },
  statistics: {
    totalStudents: "50,000+",
    questionsAnswered: "2.5M+",
    successRate: "94%",
    averageImprovement: "40%"
  },
  examData: {
    NEET: {
      subjects: ["Physics", "Chemistry", "Biology"],
      topics: {
        Physics: ["Mechanics", "Thermodynamics", "Optics", "Electricity & Magnetism", "Modern Physics", "Waves", "Gravitation"],
        Chemistry: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Chemical Bonding", "Thermochemistry", "Equilibrium"],
        Biology: ["Cell Biology", "Genetics", "Human Physiology", "Plant Physiology", "Ecology", "Evolution", "Molecular Biology"]
      },
      stats: {
        totalQuestions: "75,000+",
        previousYearPapers: "25+ Years",
        mockTests: "500+",
        studyHours: "2000+"
      }
    },
    JEE: {
      subjects: ["Physics", "Chemistry", "Mathematics"],
      topics: {
        Physics: ["Mechanics", "Thermodynamics", "Waves & Optics", "Electricity & Magnetism", "Modern Physics", "Rotational Motion"],
        Chemistry: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Chemical Kinetics", "Electrochemistry"],
        Mathematics: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Probability & Statistics", "Vectors", "Complex Numbers"]
      },
      stats: {
        totalQuestions: "80,000+",
        previousYearPapers: "30+ Years",
        mockTests: "600+",
        studyHours: "2500+"
      }
    }
  },
  sampleQuestions: [
    {
      question: "A ball is thrown vertically upward with initial velocity 20 m/s. Find the maximum height reached.",
      options: ["15 m", "20 m", "25 m", "30 m"],
      correct: "20 m",
      explanation: "Using v² = u² - 2gh, at max height v=0, so h = u²/2g = 400/20 = 20m",
      difficulty: "Medium",
      topic: "Mechanics",
      exam: "NEET",
      type: "MCQ"
    },
    {
      question: "Calculate the pH of 0.01 M HCl solution.",
      options: ["1", "2", "12", "14"],
      correct: "2",
      explanation: "For strong acid, pH = -log[H+] = -log(0.01) = 2",
      difficulty: "Easy",
      topic: "Physical Chemistry",
      exam: "NEET",
      type: "MCQ"
    },
    {
      question: "Find the derivative of x³ + 2x² - 5x + 3.",
      options: ["3x² + 4x - 5", "x² + 2x - 5", "3x² + 4x + 3", "6x + 4"],
      correct: "3x² + 4x - 5",
      explanation: "d/dx(x³ + 2x² - 5x + 3) = 3x² + 4x - 5",
      difficulty: "Easy",
      topic: "Calculus",
      exam: "JEE",
      type: "MCQ"
    }
  ],
  progressData: {
    questionsAnswered: 2847,
    topicsCovered: 45,
    timeSpent: "247 hours",
    accuracy: 82,
    weeklyProgress: [68, 74, 71, 85, 78, 83, 87],
    subjectWise: {
      Physics: {accuracy: 78, timeSpent: 89, topicsCompleted: 15},
      Chemistry: {accuracy: 85, timeSpent: 92, topicsCompleted: 18},
      Biology: {accuracy: 83, timeSpent: 66, topicsCompleted: 12}
    }
  }
};

// Global state
let currentExam = 'NEET';
let currentSection = 'hero';
let charts = {};

// DOM Elements
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const examSelect = document.getElementById('examSelect');
const subjectSelect = document.getElementById('subjectSelect');
const topicSelect = document.getElementById('topicSelect');
const difficultySelect = document.getElementById('difficultySelect');
const generateQuestions = document.getElementById('generateQuestions');
const questionsContainer = document.getElementById('questionsContainer');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  setupCharts();
  updateSubjectOptions();
});

// Initialize App
function initializeApp() {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Initialize navigation
  showSection('hero');
  
  // Initialize exam data
  currentExam = examSelect?.value || 'NEET';
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Exam Selection
  document.querySelectorAll('.select-exam-btn').forEach(btn => {
    btn.addEventListener('click', handleExamSelection);
  });
  
  // Chat functionality
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Sample questions
  document.querySelectorAll('.sample-question').forEach(question => {
    question.addEventListener('click', handleSampleQuestion);
  });
  
  // Practice filters
  if (examSelect) {
    examSelect.addEventListener('change', updateSubjectOptions);
  }
  
  if (subjectSelect) {
    subjectSelect.addEventListener('change', updateTopicOptions);
  }
  
  if (generateQuestions) {
    generateQuestions.addEventListener('click', generatePracticeQuestions);
  }
  
  // Show answer buttons
  document.querySelectorAll('.show-answer-btn').forEach(btn => {
    btn.addEventListener('click', showQuestionAnswer);
  });
  
  // File upload
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
  
  if (uploadArea) {
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
  }
}

// Navigation Functions
function handleNavigation(e) {
  e.preventDefault();
  const section = e.target.dataset.section;
  if (section) {
    showSection(section);
    updateActiveNavLink(e.target);
  }
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
    
    // Initialize section-specific functionality
    if (sectionId === 'analytics') {
      setTimeout(() => setupCharts(), 100);
    }
  }
  
  // Update navigation
  const navLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (navLink) {
    updateActiveNavLink(navLink);
  }
}

function updateActiveNavLink(activeLink) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

// Theme Functions
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Exam Selection Functions
function handleExamSelection(e) {
  const examCard = e.target.closest('.exam-card');
  const exam = examCard.dataset.exam;
  
  if (exam) {
    currentExam = exam;
    examSelect.value = exam;
    updateSubjectOptions();
    showSection('dashboard');
    
    // Visual feedback
    examCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      examCard.style.transform = '';
    }, 150);
  }
}

// Practice Functions
function updateSubjectOptions() {
  if (!subjectSelect || !examSelect) return;
  
  const exam = examSelect.value;
  const subjects = appData.examData[exam]?.subjects || [];
  
  subjectSelect.innerHTML = '';
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
  
  updateTopicOptions();
}

function updateTopicOptions() {
  if (!topicSelect || !examSelect || !subjectSelect) return;
  
  const exam = examSelect.value;
  const subject = subjectSelect.value;
  const topics = appData.examData[exam]?.topics[subject] || [];
  
  topicSelect.innerHTML = '';
  topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
}

function generatePracticeQuestions() {
  const exam = examSelect.value;
  const subject = subjectSelect.value;
  const topic = topicSelect.value;
  const difficulty = difficultySelect.value;
  
  // Filter questions based on selection
  const filteredQuestions = appData.sampleQuestions.filter(q => 
    q.exam === exam && q.difficulty === difficulty
  );
  
  // Generate additional questions if needed
  const questions = [...filteredQuestions];
  while (questions.length < 3) {
    questions.push(generateRandomQuestion(exam, subject, topic, difficulty));
  }
  
  displayQuestions(questions.slice(0, 3));
  
  // Visual feedback
  generateQuestions.innerHTML = '<i class="fas fa-check"></i> Generated!';
  generateQuestions.style.background = 'var(--color-success)';
  
  setTimeout(() => {
    generateQuestions.innerHTML = '<i class="fas fa-cogs"></i> Generate Questions';
    generateQuestions.style.background = '';
  }, 2000);
}

function generateRandomQuestion(exam, subject, topic, difficulty) {
  const questionTemplates = [
    {
      question: `What is the fundamental concept in ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: "Option A",
      explanation: `This relates to the basic principles of ${topic} in ${subject}.`,
      difficulty,
      topic,
      exam,
      type: "MCQ"
    },
    {
      question: `Calculate the value in this ${topic} problem.`,
      options: ["10", "20", "30", "40"],
      correct: "20",
      explanation: `Using the standard formula for ${topic}, we get this result.`,
      difficulty,
      topic,
      exam,
      type: "MCQ"
    }
  ];
  
  return questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
}

function displayQuestions(questions) {
  questionsContainer.innerHTML = '';
  
  questions.forEach((question, index) => {
    const questionCard = createQuestionCard(question, index + 1);
    questionsContainer.appendChild(questionCard);
  });
}

function createQuestionCard(question, number) {
  const card = document.createElement('div');
  card.className = 'question-card';
  
  const optionsHtml = question.options.map((option, index) => `
    <div class="option">
      <input type="radio" name="q${number}" id="q${number}${String.fromCharCode(97 + index)}" value="${option}">
      <label for="q${number}${String.fromCharCode(97 + index)}">${option}</label>
    </div>
  `).join('');
  
  card.innerHTML = `
    <div class="question-header">
      <div class="question-number">Question ${number}</div>
      <div class="question-difficulty ${question.difficulty.toLowerCase()}">${question.difficulty}</div>
    </div>
    <div class="question-content">
      <p>${question.question}</p>
      <div class="question-options">
        ${optionsHtml}
      </div>
      <button class="btn btn--secondary show-answer-btn" data-answer="${question.correct}" data-explanation="${question.explanation}">
        Show Answer
      </button>
    </div>
  `;
  
  // Add event listener for show answer button
  const showAnswerBtn = card.querySelector('.show-answer-btn');
  showAnswerBtn.addEventListener('click', showQuestionAnswer);
  
  return card;
}

function showQuestionAnswer(e) {
  const btn = e.target;
  const answer = btn.dataset.answer;
  const explanation = btn.dataset.explanation;
  
  const answerDiv = document.createElement('div');
  answerDiv.className = 'question-answer';
  answerDiv.innerHTML = `
    <div style="margin-top: var(--space-16); padding: var(--space-16); background: var(--color-bg-3); border-radius: var(--radius-base); border-left: 4px solid var(--color-success);">
      <div style="font-weight: var(--font-weight-medium); color: var(--color-success); margin-bottom: var(--space-8);">
        <i class="fas fa-check-circle"></i> Correct Answer: ${answer}
      </div>
      <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
        <strong>Explanation:</strong> ${explanation}
      </div>
    </div>
  `;
  
  btn.parentNode.appendChild(answerDiv);
  btn.style.display = 'none';
}

// Chat Functions
function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const response = generateAIResponse(message);
    addMessage(response, 'ai');
  }, 1000);
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const avatar = sender === 'ai' ? 
    '<div class="ai-avatar"><i class="fas fa-robot"></i></div>' :
    '<div class="user-avatar"><i class="fas fa-user"></i></div>';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      ${avatar}
    </div>
    <div class="message-content">
      <div class="message-text">${text}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
  const responses = [
    "That's a great question! Let me explain the concept step by step...",
    "I can help you with that. The key principle here is...",
    "This is a common topic in exams. Here's what you need to know...",
    "Let me break this down for you with a simple example...",
    "That's an important concept. The best way to understand it is..."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function handleSampleQuestion(e) {
  const question = e.target.dataset.question;
  if (question) {
    addMessage(question, 'user');
    
    setTimeout(() => {
      const response = generateDetailedResponse(question);
      addMessage(response, 'ai');
    }, 1500);
  }
}

function generateDetailedResponse(question) {
  const responses = {
    "Explain the concept of projectile motion": "Projectile motion is the motion of an object thrown into the air subject to only the acceleration of gravity. The object is called a projectile, and its path is called its trajectory. Key points: 1) Horizontal velocity remains constant, 2) Vertical motion follows kinematic equations, 3) Maximum range occurs at 45° angle.",
    "What is the difference between ionic and covalent bonds?": "Ionic bonds form between metals and non-metals through electron transfer, creating charged ions. Covalent bonds form between non-metals through electron sharing. Ionic compounds have high melting points and conduct electricity when dissolved, while covalent compounds typically have lower melting points and don't conduct electricity.",
    "How does natural selection work in evolution?": "Natural selection is the process by which organisms with favorable traits survive and reproduce more successfully. Steps: 1) Variation exists in populations, 2) Some traits are heritable, 3) More offspring are produced than can survive, 4) Individuals with advantageous traits survive and reproduce, 5) These traits become more common over generations."
  };
  
  return responses[question] || "That's an excellent question! Let me provide a detailed explanation with examples and key concepts you need to understand for your exam preparation.";
}

// File Upload Functions
function handleFileUpload(e) {
  const files = Array.from(e.target.files);
  processFiles(files);
}

function handleDragOver(e) {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--color-primary)';
  uploadArea.style.background = 'var(--color-bg-1)';
}

function handleFileDrop(e) {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
  
  uploadArea.style.borderColor = '';
  uploadArea.style.background = '';
}

function processFiles(files) {
  const documentsList = document.querySelector('.documents-list');
  
  files.forEach(file => {
    const documentItem = createDocumentItem(file);
    documentsList.insertBefore(documentItem, documentsList.firstChild);
  });
  
  // Show success message
  showNotification(`${files.length} file(s) uploaded successfully!`, 'success');
}

function createDocumentItem(file) {
  const item = document.createElement('div');
  item.className = 'document-item';
  
  const extension = file.name.split('.').pop().toLowerCase();
  let iconClass = 'fas fa-file';
  let iconBg = 'var(--color-info)';
  
  if (['pdf'].includes(extension)) {
    iconClass = 'fas fa-file-pdf';
    iconBg = 'var(--color-error)';
  } else if (['doc', 'docx'].includes(extension)) {
    iconClass = 'fas fa-file-word';
    iconBg = 'var(--color-primary)';
  } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
    iconClass = 'fas fa-file-image';
    iconBg = 'var(--color-success)';
  }
  
  item.innerHTML = `
    <div class="document-icon" style="background: ${iconBg}">
      <i class="${iconClass}"></i>
    </div>
    <div class="document-info">
      <div class="document-name">${file.name}</div>
      <div class="document-meta">${formatFileSize(file.size)} • Just now</div>
    </div>
    <div class="document-actions">
      <button class="btn btn--sm btn--outline">
        <i class="fas fa-download"></i>
      </button>
      <button class="btn btn--sm btn--outline">
        <i class="fas fa-eye"></i>
      </button>
    </div>
  `;
  
  return item;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analytics and Charts
function setupCharts() {
  if (currentSection !== 'analytics') return;
  
  // Weekly Progress Chart
  const weeklyCtx = document.getElementById('weeklyChart');
  if (weeklyCtx && !charts.weekly) {
    charts.weekly = new Chart(weeklyCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Progress Score',
          data: appData.progressData.weeklyProgress,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  // Subject Performance Chart
  const subjectCtx = document.getElementById('subjectChart');
  if (subjectCtx && !charts.subject) {
    const subjectData = appData.progressData.subjectWise;
    charts.subject = new Chart(subjectCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(subjectData),
        datasets: [{
          data: Object.values(subjectData).map(s => s.accuracy),
          backgroundColor: ['#B4413C', '#FFC185', '#DB4545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Accuracy Trends Chart
  const accuracyCtx = document.getElementById('accuracyChart');
  if (accuracyCtx && !charts.accuracy) {
    charts.accuracy = new Chart(accuracyCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(appData.progressData.subjectWise),
        datasets: [{
          label: 'Accuracy %',
          data: Object.values(appData.progressData.subjectWise).map(s => s.accuracy),
          backgroundColor: ['#B4413C', '#FFC185', '#DB4545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
}

// Utility Functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    padding: var(--space-16);
    background: var(--color-success);
    color: var(--color-white);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    animation: slideInRight 0.3s ease-out;
  `;
  
  if (type === 'error') {
    notification.style.background = 'var(--color-error)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Expose global functions
window.showSection = showSection;
window.toggleTheme = toggleTheme;