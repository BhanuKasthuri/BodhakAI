// Bodhak AI - Complete Educational Platform JavaScript
// Advanced AI-powered NEET & JEE preparation platform

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
        "NEET": {
            subjects: ["Physics", "Chemistry", "Biology"],
            topics: {
                "Physics": ["Mechanics", "Thermodynamics", "Optics", "Electricity & Magnetism", "Modern Physics", "Waves", "Gravitation"],
                "Chemistry": ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Chemical Bonding", "Thermochemistry", "Equilibrium"],
                "Biology": ["Cell Biology", "Genetics", "Human Physiology", "Plant Physiology", "Ecology", "Evolution", "Molecular Biology"]
            },
            stats: {
                totalQuestions: "75,000+",
                previousYearPapers: "25+ Years",
                mockTests: "500+",
                studyHours: "2000+"
            }
        },
        "JEE": {
            subjects: ["Physics", "Chemistry", "Mathematics"],
            topics: {
                "Physics": ["Mechanics", "Thermodynamics", "Waves & Optics", "Electricity & Magnetism", "Modern Physics", "Rotational Motion"],
                "Chemistry": ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Chemical Kinetics", "Electrochemistry"],
                "Mathematics": ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Probability & Statistics", "Vectors", "Complex Numbers"]
            },
            stats: {
                totalQuestions: "80,000+",
                previousYearPapers: "30+ Years",
                mockTests: "600+",
                studyHours: "2500+"
            }
        }
    },
    
    sampleQuestions: {
        "Physics": [
            {
                id: 1,
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
                id: 2,
                question: "What is the efficiency of a Carnot engine operating between 400K and 300K?",
                options: ["25%", "30%", "35%", "40%"],
                correct: "25%",
                explanation: "Efficiency = 1 - T₂/T₁ = 1 - 300/400 = 0.25 or 25%",
                difficulty: "Medium",
                topic: "Thermodynamics",
                exam: "JEE",
                type: "MCQ"
            }
        ],
        "Chemistry": [
            {
                id: 3,
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
                id: 4,
                question: "Which of the following is an example of nucleophilic substitution?",
                options: ["Hydrolysis of alkyl halides", "Dehydration of alcohols", "Oxidation of aldehydes", "Reduction of ketones"],
                correct: "Hydrolysis of alkyl halides",
                explanation: "Nucleophiles attack electron-deficient carbon in alkyl halides",
                difficulty: "Medium",
                topic: "Organic Chemistry",
                exam: "JEE",
                type: "MCQ"
            }
        ],
        "Biology": [
            {
                id: 5,
                question: "What is the primary function of mitochondria?",
                options: ["Protein synthesis", "ATP production", "DNA replication", "Waste removal"],
                correct: "ATP production",
                explanation: "Mitochondria are the powerhouses of cells, producing ATP through cellular respiration",
                difficulty: "Easy",
                topic: "Cell Biology",
                exam: "NEET",
                type: "MCQ"
            }
        ],
        "Mathematics": [
            {
                id: 6,
                question: "Find the derivative of sin(x²) with respect to x",
                options: ["cos(x²)", "2x cos(x²)", "sin(2x)", "2x sin(x²)"],
                correct: "2x cos(x²)",
                explanation: "Using chain rule: d/dx[sin(x²)] = cos(x²) × 2x = 2x cos(x²)",
                difficulty: "Medium",
                topic: "Calculus",
                exam: "JEE",
                type: "MCQ"
            }
        ]
    },
    
    chatExamples: [
        {
            user: "What is the difference between mitosis and meiosis?",
            ai: "Mitosis and meiosis are both cell division processes but serve different purposes:\n\n**Mitosis:**\n- Produces 2 identical diploid cells\n- Purpose: Growth and repair\n- 1 division cycle\n- Chromosome number remains same\n\n**Meiosis:**\n- Produces 4 genetically different haploid gametes\n- Purpose: Sexual reproduction\n- 2 division cycles\n- Chromosome number reduces to half\n\nThis is crucial for NEET Biology as it appears frequently in genetics questions.",
            sources: ["NCERT Biology Class 11 Chapter 10", "Previous Year NEET 2023"]
        },
        {
            user: "Explain the photoelectric effect",
            ai: "The photoelectric effect demonstrates the particle nature of light and was explained by Einstein:\n\n**Key Points:**\n- When light hits a metal surface, electrons are emitted\n- Energy of emitted electrons depends on frequency, not intensity\n- Below threshold frequency, no electrons are emitted\n\n**Einstein's Equation:** E = hf - φ\nWhere:\n- E = Kinetic energy of emitted electron\n- h = Planck's constant\n- f = Frequency of incident light\n- φ = Work function of metal\n\nThis concept is important for JEE Physics Modern Physics section.",
            sources: ["Physics NCERT Class 12 Chapter 11", "JEE Main 2024 Paper"]
        }
    ],
    
    progressData: {
        questionsAnswered: 2847,
        topicsCovered: 45,
        timeSpent: "247 hours",
        accuracy: 82,
        weeklyProgress: [68, 74, 71, 85, 78, 83, 87],
        subjectWise: {
            "Physics": { accuracy: 78, timeSpent: 89, topicsCompleted: 15 },
            "Chemistry": { accuracy: 85, timeSpent: 92, topicsCompleted: 18 },
            "Biology": { accuracy: 83, timeSpent: 66, topicsCompleted: 12 }
        },
        recentActivity: [
            { type: "question", subject: "Physics", topic: "Thermodynamics", time: "2 hours ago", icon: "fa-question-circle" },
            { type: "chat", query: "Explain entropy", time: "4 hours ago", icon: "fa-comments" },
            { type: "practice", subject: "Chemistry", count: 15, time: "1 day ago", icon: "fa-dumbbell" },
            { type: "upload", document: "Biology Notes.pdf", time: "2 days ago", icon: "fa-upload" }
        ]
    },
    
    uploadedDocuments: [
        {
            name: "Physics_NCERT_Class_11.pdf",
            status: "Processed",
            size: "15.2 MB",
            uploadDate: "2024-09-20",
            type: "pdf"
        },
        {
            name: "Chemistry_Previous_Years.pdf",
            status: "Processing",
            size: "8.7 MB",
            uploadDate: "2024-09-25",
            type: "pdf"
        },
        {
            name: "Biology_Notes.docx",
            status: "Processed",
            size: "2.1 MB",
            uploadDate: "2024-09-18",
            type: "docx"
        },
        {
            name: "Mathematics_Formulas.txt",
            status: "Processed",
            size: "245 KB",
            uploadDate: "2024-09-15",
            type: "txt"
        }
    ]
};

// Global Application State
let currentExam = '';
let currentSection = 'home';
let currentTheme = 'dark';
let weeklyChart = null;
let subjectChart = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

function initializeApplication() {
    initializeNavigation();
    initializeThemeToggle();
    initializeExamSelection();
    populateExamDropdown();
    initializeChatInterface();
    initializePracticeGenerator();
    initializeDocumentUpload();
    initializeAnalytics();
    populateInitialData();
    
    // Show home section by default
    showSection('home');
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification("Welcome to Bodhak AI! Start by selecting your target exam.", 'info');
    }, 1000);
}

// Navigation System
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Initialize section-specific functionality
        if (sectionId === 'analytics') {
            setTimeout(initializeCharts, 100);
        }
        if (sectionId === 'practice') {
            // Force refresh practice dropdowns when section is shown
            setTimeout(() => {
                populatePracticeDropdowns();
            }, 100);
        }
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Theme System
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
    
    // Set initial theme
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon();
    showNotification(`Switched to ${currentTheme} theme`, 'info');
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Exam Selection System
function initializeExamSelection() {
    const examSelect = document.getElementById('examSelect');
    const examCards = document.querySelectorAll('.exam-card');
    
    // Handle exam selector dropdown
    if (examSelect) {
        examSelect.addEventListener('change', function() {
            const selectedExam = this.value;
            if (selectedExam) {
                selectExam(selectedExam);
            }
        });
    }
    
    // Handle exam card clicks
    examCards.forEach(card => {
        const examButton = card.querySelector('.btn');
        if (examButton) {
            examButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const exam = card.getAttribute('data-exam');
                selectExam(exam);
            });
        }
        
        card.addEventListener('click', function() {
            const exam = this.getAttribute('data-exam');
            selectExam(exam);
        });
    });
}

function selectExam(exam) {
    currentExam = exam;
    
    // Update exam selector
    const examSelect = document.getElementById('examSelect');
    if (examSelect) {
        examSelect.value = exam;
    }
    
    // Update badge
    const badge = document.getElementById('selectedExamBadge');
    if (badge) {
        badge.innerHTML = `
            <i class="fas fa-graduation-cap"></i>
            <span>${exam} Selected</span>
        `;
    }
    
    // Update subject options in practice generator
    populatePracticeDropdowns();
    
    // Show dashboard
    showSection('dashboard');
    
    // Show success message
    showNotification(`${exam} exam selected successfully! Ready to start learning.`, 'success');
}

function populateExamDropdown() {
    const examSelect = document.getElementById('examSelect');
    if (!examSelect) return;
    
    examSelect.innerHTML = '<option value="">Select Exam</option>';
    
    Object.keys(appData.examData).forEach(exam => {
        const option = document.createElement('option');
        option.value = exam;
        option.textContent = exam;
        examSelect.appendChild(option);
    });
}

// Practice System - COMPLETELY REWRITTEN FOR RELIABILITY
function initializePracticeGenerator() {
    // Wait for DOM to be fully ready, then populate dropdowns
    setTimeout(() => {
        populatePracticeDropdowns();
        initializePracticeEventListeners();
    }, 500);
}

function initializePracticeEventListeners() {
    // Add subject change listener
    const subjectSelect = document.getElementById('subjectSelect');
    if (subjectSelect) {
        // Remove any existing listeners
        subjectSelect.removeEventListener('change', handleSubjectChange);
        // Add the event listener
        subjectSelect.addEventListener('change', handleSubjectChange);
    }
}

function handleSubjectChange(event) {
    const selectedSubject = event.target.value;
    populateTopicDropdown(selectedSubject);
}

function populatePracticeDropdowns() {
    console.log('Populating practice dropdowns...'); // Debug log
    
    // Populate all static dropdowns first
    populateSubjectDropdown();
    populateDifficultyDropdown();
    populateQuestionTypeDropdown();
    
    // Clear topics dropdown initially
    const topicSelect = document.getElementById('topicSelect');
    if (topicSelect) {
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
    }
}

function populateSubjectDropdown() {
    const subjectSelect = document.getElementById('subjectSelect');
    if (!subjectSelect) {
        console.error('Subject select element not found');
        return;
    }
    
    // Clear existing options
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    
    let subjects = [];
    
    if (currentExam && appData.examData[currentExam]) {
        // Use subjects from selected exam
        subjects = appData.examData[currentExam].subjects;
        console.log(`Using subjects for ${currentExam}:`, subjects);
    } else {
        // Show all subjects from both exams
        const allSubjects = new Set();
        Object.values(appData.examData).forEach(exam => {
            exam.subjects.forEach(subject => allSubjects.add(subject));
        });
        subjects = Array.from(allSubjects);
        console.log('Using all subjects:', subjects);
    }
    
    // Populate subject dropdown
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
    
    console.log(`Added ${subjects.length} subjects to dropdown`);
}

function populateTopicDropdown(subject) {
    const topicSelect = document.getElementById('topicSelect');
    if (!topicSelect) {
        console.error('Topic select element not found');
        return;
    }
    
    // Clear existing options
    topicSelect.innerHTML = '<option value="">Select Topic</option>';
    
    if (!subject) {
        console.log('No subject selected, clearing topics');
        return;
    }
    
    let topics = [];
    
    if (currentExam && appData.examData[currentExam] && appData.examData[currentExam].topics[subject]) {
        topics = appData.examData[currentExam].topics[subject];
        console.log(`Using topics for ${currentExam} ${subject}:`, topics);
    } else {
        // Find topics from any exam that has this subject
        Object.values(appData.examData).forEach(exam => {
            if (exam.topics[subject]) {
                topics = [...new Set([...topics, ...exam.topics[subject]])];
            }
        });
        console.log(`Using combined topics for ${subject}:`, topics);
    }
    
    // Populate topic dropdown
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });
    
    console.log(`Added ${topics.length} topics to dropdown`);
}

function populateDifficultyDropdown() {
    const difficultySelect = document.getElementById('difficultySelect');
    if (!difficultySelect) return;
    
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    // Only add if not already populated
    if (difficultySelect.children.length <= 1) {
        difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty;
            option.textContent = difficulty;
            difficultySelect.appendChild(option);
        });
    }
}

function populateQuestionTypeDropdown() {
    const questionTypeSelect = document.getElementById('questionTypeSelect');
    if (!questionTypeSelect) return;
    
    const types = [
        { value: 'MCQ', text: 'Multiple Choice' },
        { value: 'Numerical', text: 'Numerical' },
        { value: 'Theory', text: 'Theory' }
    ];
    
    // Only add if not already populated
    if (questionTypeSelect.children.length <= 1) {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.text;
            questionTypeSelect.appendChild(option);
        });
    }
}

function generateQuestions() {
    const subject = document.getElementById('subjectSelect')?.value;
    const topic = document.getElementById('topicSelect')?.value;
    const difficulty = document.getElementById('difficultySelect')?.value;
    const questionType = document.getElementById('questionTypeSelect')?.value;
    
    console.log('Generate questions called with:', { subject, topic, difficulty, questionType });
    
    if (!subject) {
        showNotification('Please select a subject first!', 'error');
        return;
    }
    
    const questionsContainer = document.getElementById('generatedQuestions');
    if (!questionsContainer) {
        console.error('Questions container not found');
        return;
    }
    
    // Show loading state
    questionsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-shimmer" style="height: 200px; border-radius: 12px; margin-bottom: 16px;"></div>
            <div class="loading-shimmer" style="height: 200px; border-radius: 12px; margin-bottom: 16px;"></div>
            <div class="loading-shimmer" style="height: 200px; border-radius: 12px;"></div>
        </div>
    `;
    
    // Simulate AI generation
    setTimeout(() => {
        displayGeneratedQuestions(subject, topic, difficulty, questionType);
        showNotification('Questions generated successfully!', 'success');
    }, 2500);
}

function displayGeneratedQuestions(subject, topic, difficulty, questionType) {
    const questionsContainer = document.getElementById('generatedQuestions');
    if (!questionsContainer) return;
    
    // Get available questions for the subject
    const availableQuestions = appData.sampleQuestions[subject] || [];
    
    // Filter questions based on criteria
    let filteredQuestions = availableQuestions.filter(q => {
        if (topic && q.topic !== topic) return false;
        if (difficulty && q.difficulty !== difficulty) return false;
        if (questionType && q.type !== questionType) return false;
        return true;
    });
    
    // Generate additional questions if needed
    const totalQuestions = Math.max(3, Math.min(5, filteredQuestions.length + 2));
    const generatedQuestions = [];
    
    for (let i = 0; i < totalQuestions; i++) {
        if (filteredQuestions[i]) {
            generatedQuestions.push(filteredQuestions[i]);
        } else {
            // Generate synthetic question
            generatedQuestions.push(generateSyntheticQuestion(subject, topic, difficulty, questionType, i + 1));
        }
    }
    
    // Render questions
    questionsContainer.innerHTML = generatedQuestions.map((q, index) => {
        const optionsHtml = q.options ? `
            <div class="question-options">
                ${q.options.map((option, i) => `
                    <div class="question-option" onclick="selectQuestionOption(this, ${index})" data-option="${i}">
                        ${String.fromCharCode(65 + i)}. ${option}
                    </div>
                `).join('')}
            </div>
        ` : '';
        
        return `
            <div class="question-card" data-question-id="${index}">
                <div class="question-header">
                    <div class="question-info">
                        <span class="question-tag difficulty">${q.difficulty}</span>
                        <span class="question-tag type">${q.type}</span>
                        <span class="question-tag topic">${q.topic}</span>
                    </div>
                    <span style="color: var(--color-gray-400); font-size: var(--font-size-sm);">Question ${index + 1}</span>
                </div>
                <div class="question-text">${q.question}</div>
                ${optionsHtml}
                ${q.explanation ? `
                    <div class="question-explanation" style="display: none; margin-top: 16px; padding: 16px; background: rgba(14, 165, 233, 0.1); border-radius: 8px; border-left: 3px solid var(--color-bodhak-primary);">
                        <h4 style="margin-bottom: 8px; color: var(--color-gray-200);">Explanation:</h4>
                        <p style="margin: 0; color: var(--color-gray-300); line-height: 1.6;">${q.explanation}</p>
                    </div>
                ` : ''}
                <div class="question-actions" style="margin-top: 16px; text-align: center; display: flex; gap: 12px; justify-content: center;">
                    <button class="btn btn--outline btn--sm" onclick="showExplanation(${index})">
                        <i class="fas fa-lightbulb"></i> Show Explanation
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="bookmarkQuestion(${index})">
                        <i class="fas fa-bookmark"></i> Bookmark
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateSyntheticQuestion(subject, topic, difficulty, questionType, number) {
    const templates = {
        Physics: [
            "A particle moves with velocity v = {value} m/s. Calculate its kinetic energy if mass = 2 kg.",
            "Find the force required to accelerate a {value} kg object at 5 m/s².",
            "Calculate the electric field intensity at distance r = {value} m from a point charge.",
            "A spring with constant k = {value} N/m is compressed by 0.2 m. Find the stored energy."
        ],
        Chemistry: [
            "Calculate the molarity of a solution containing {value} moles in 500 mL.",
            "Find the pH of {value} × 10⁻³ M HCl solution.",
            "Determine the number of atoms in {value} moles of carbon.",
            "What is the oxidation state of sulfur in H₂SO₄?"
        ],
        Biology: [
            "Explain the process of {topic} in cellular metabolism.",
            "What are the main functions of {topic} in living organisms?",
            "Describe the structure and function of {topic}.",
            "How does {topic} contribute to maintaining homeostasis?"
        ],
        Mathematics: [
            "Find the derivative of f(x) = x^{value} + 2x + 1.",
            "Calculate the integral of sin({value}x) dx.",
            "Solve the equation: x² + {value}x + 6 = 0",
            "Find the limit as x approaches 0 of (sin {value}x)/x"
        ]
    };
    
    const subjectTemplates = templates[subject] || templates.Physics;
    const template = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
    const value = Math.floor(Math.random() * 10) + 1;
    
    const question = template
        .replace(/\{value\}/g, value)
        .replace(/\{topic\}/g, topic || 'the given concept');
    
    const options = questionType === 'MCQ' ? [
        `${value * 2} units`,
        `${value * 3} units`,
        `${value * 4} units`,
        `${value * 5} units`
    ] : null;
    
    return {
        id: `synthetic_${number}`,
        question: question,
        options: options,
        correct: options ? options[0] : null,
        explanation: `This is a ${difficulty.toLowerCase()} level question from ${topic || subject}. The solution involves applying fundamental principles and formulas relevant to this topic.`,
        difficulty: difficulty || 'Medium',
        topic: topic || 'General',
        type: questionType || 'MCQ'
    };
}

function selectQuestionOption(element, questionIndex) {
    // Remove previous selections in this question
    const questionCard = element.closest('.question-card');
    const options = questionCard.querySelectorAll('.question-option');
    
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select current option
    element.classList.add('selected');
    
    // Show feedback
    setTimeout(() => {
        showNotification('Answer selected! Check explanation for details.', 'info');
    }, 300);
}

function showExplanation(questionIndex) {
    const questionCard = document.querySelector(`[data-question-id="${questionIndex}"]`);
    const explanation = questionCard?.querySelector('.question-explanation');
    
    if (explanation) {
        const isHidden = explanation.style.display === 'none' || !explanation.style.display;
        explanation.style.display = isHidden ? 'block' : 'none';
        
        const button = questionCard.querySelector('.question-actions button');
        if (button) {
            const icon = button.querySelector('i');
            if (isHidden) {
                icon.className = 'fas fa-eye-slash';
                button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Explanation';
            } else {
                icon.className = 'fas fa-lightbulb';
                button.innerHTML = '<i class="fas fa-lightbulb"></i> Show Explanation';
            }
        }
    }
}

function bookmarkQuestion(questionIndex) {
    showNotification('Question bookmarked for review!', 'success');
}

// Chat System
function initializeChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Initialize sample question buttons
    setTimeout(() => {
        const sampleButtons = document.querySelectorAll('.sample-btn');
        sampleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                let question = '';
                
                if (buttonText.includes('Mitosis')) {
                    question = 'What is the difference between mitosis and meiosis?';
                } else if (buttonText.includes('Photoelectric')) {
                    question = 'Explain the photoelectric effect';
                } else if (buttonText.includes('Harmonic')) {
                    question = 'What are the conditions for Simple Harmonic Motion?';
                } else if (buttonText.includes('Hybridization')) {
                    question = 'Explain hybridization in organic compounds';
                }
                
                if (question) {
                    askSampleQuestion(question);
                }
            });
        });
        
        // Also initialize helper buttons
        const helperButtons = document.querySelectorAll('.helper-btn');
        helperButtons.forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                let text = '';
                
                if (icon.classList.contains('fa-calculator')) {
                    text = 'Calculate the ';
                } else if (icon.classList.contains('fa-question-circle')) {
                    text = 'Explain the concept of ';
                } else if (icon.classList.contains('fa-balance-scale')) {
                    text = 'What is the difference between ';
                }
                
                if (text) {
                    addToInput(text);
                }
            });
        });
    }, 500);
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput?.value?.trim();
    
    if (!message) return;
    
    // Add user message
    addMessageToChat(message, 'user');
    
    // Clear input and disable send button
    chatInput.value = '';
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        generateAIResponse(message);
        if (sendButton) {
            sendButton.disabled = false;
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }, 1500 + Math.random() * 2000);
}

function addMessageToChat(message, type, citations = null) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'user' ? 'fa-user' : 'fa-robot';
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let citationsHtml = '';
    if (citations && citations.length > 0) {
        citationsHtml = `
            <div class="message-citations" style="margin-top: 12px; padding: 12px; background: rgba(14, 165, 233, 0.1); border-radius: 8px; border-left: 3px solid var(--color-bodhak-primary);">
                <div class="citation-label" style="font-size: 12px; color: var(--color-bodhak-primary); font-weight: 500; margin-bottom: 8px;">
                    <i class="fas fa-book"></i> Sources:
                </div>
                ${citations.map(citation => `<div class="citation-item" style="font-size: 13px; color: var(--color-gray-300); margin-bottom: 4px;">• ${citation}</div>`).join('')}
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatar}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${time}</div>
            ${citationsHtml}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        messageDiv.style.transition = 'all 0.3s ease-out';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text" style="display: flex; align-items: center; gap: 8px;">
                <span>AI is thinking</span>
                <div style="display: flex; gap: 4px;">
                    <div style="width: 6px; height: 6px; background: var(--color-bodhak-primary); border-radius: 50%; animation: pulse 1.4s infinite;"></div>
                    <div style="width: 6px; height: 6px; background: var(--color-bodhak-primary); border-radius: 50%; animation: pulse 1.4s infinite 0.2s;"></div>
                    <div style="width: 6px; height: 6px; background: var(--color-bodhak-primary); border-radius: 50%; animation: pulse 1.4s infinite 0.4s;"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response from examples
    let response = "I understand your question. Based on my knowledge of NEET and JEE topics, I can provide you with a comprehensive answer. Let me break this down for you step by step.";
    let citations = ["Bodhak AI Knowledge Base", "NCERT Textbooks"];
    
    // Check for keyword matches
    const matchingExample = appData.chatExamples.find(example => {
        const keywords = example.user.toLowerCase().split(' ');
        return keywords.some(keyword => keyword.length > 3 && lowerMessage.includes(keyword));
    });
    
    if (matchingExample) {
        response = matchingExample.ai;
        citations = matchingExample.sources;
    } else if (lowerMessage.includes('calculate') || lowerMessage.includes('find')) {
        response = "To solve this calculation problem, I'll guide you through the step-by-step approach:\n\n1. **Identify given values** - List all known quantities\n2. **Choose the right formula** - Select the appropriate equation\n3. **Substitute values** - Replace variables with numbers\n4. **Calculate the result** - Perform the mathematical operations\n\nCould you provide the specific numerical values or equation you're working with?";
        citations = ["Mathematical Problem Solving Guide", "NCERT Mathematics"];
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
        response = "I'd be happy to explain this concept! Let me provide a comprehensive explanation:\n\n**Definition:** This is a fundamental concept in " + (currentExam || 'competitive exams') + ".\n\n**Key Points:**\n• Core principles and applications\n• Important formulas or mechanisms\n• Common exam questions and patterns\n• Real-world relevance\n\nWould you like me to elaborate on any specific aspect of this topic?";
        citations = ["Concept Explanation Database", "Previous Year Analysis"];
    } else if (lowerMessage.includes('difference')) {
        response = "Great question! Understanding differences between similar concepts is crucial for exams. Let me compare these concepts:\n\n**Concept A:**\n• Key characteristics\n• Applications and examples\n• Important properties\n\n**Concept B:**\n• Distinguishing features\n• Different applications\n• Unique properties\n\n**Key Differences:**\n• Structure and composition\n• Function and purpose\n• Occurrence and examples\n\nThis type of comparison often appears in " + (currentExam || 'competitive exam') + " questions!";
        citations = ["Comparative Analysis", "NCERT Textbooks", "Previous Year Questions"];
    }
    
    addMessageToChat(response, 'ai', citations);
}

function askSampleQuestion(question) {
    console.log('Sample question clicked:', question);
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = question;
        // Automatically send the message
        setTimeout(() => {
            sendMessage();
        }, 300);
    }
}

function addToInput(text) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += text;
        chatInput.focus();
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Chat cleared! How can I help you with your ${currentExam || 'exam'} preparation?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;
    }
    showNotification('Chat history cleared!', 'info');
}

// Document Management System
function initializeDocumentUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // File input handler
    fileInput.addEventListener('change', (e) => handleFileUpload(e.target.files));
    
    // Initialize document filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterDocuments(this.getAttribute('data-status'));
        });
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFileUpload(files);
}

function handleFileUpload(files) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    Array.from(files).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
            showNotification(`Unsupported file type: ${file.name}`, 'error');
            return;
        }
        
        if (file.size > maxSize) {
            showNotification(`File too large: ${file.name} (Max: 50MB)`, 'error');
            return;
        }
        
        uploadDocument(file);
    });
}

function uploadDocument(file) {
    // Add to documents list with uploading status
    const docItem = {
        name: file.name,
        status: 'Uploading',
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        type: getFileType(file.name)
    };
    
    addDocumentToList(docItem);
    
    // Simulate upload progress
    simulateUploadProgress(file.name);
    
    showNotification(`Started uploading: ${file.name}`, 'info');
}

function simulateUploadProgress(fileName) {
    // Find the document item
    const documentItems = document.getElementById('documentItems');
    const docElement = Array.from(documentItems.children).find(item => 
        item.querySelector('.document-name').textContent === fileName
    );
    
    if (!docElement) return;
    
    const statusElement = docElement.querySelector('.document-status');
    
    // Simulate upload phases
    setTimeout(() => {
        statusElement.textContent = 'Processing';
        statusElement.className = 'document-status processing';
        docElement.setAttribute('data-status', 'processing');
        
        setTimeout(() => {
            statusElement.textContent = 'Processed';
            statusElement.className = 'document-status processed';
            docElement.setAttribute('data-status', 'processed');
            showNotification(`${fileName} processed successfully!`, 'success');
            
            // Add to permanent storage
            appData.uploadedDocuments.unshift({
                name: fileName,
                status: 'Processed',
                size: statusElement.parentElement.querySelector('.document-meta').children[0].textContent,
                uploadDate: new Date().toISOString().split('T')[0],
                type: getFileType(fileName)
            });
            
        }, 3000);
    }, 2000);
}

function addDocumentToList(doc) {
    const documentItems = document.getElementById('documentItems');
    if (!documentItems) return;
    
    const docItem = document.createElement('div');
    docItem.className = 'document-item';
    docItem.setAttribute('data-status', doc.status.toLowerCase());
    
    const iconClass = getFileIcon(doc.type);
    
    docItem.innerHTML = `
        <div class="document-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="document-info">
            <div class="document-name">${doc.name}</div>
            <div class="document-meta">
                <span>${doc.size}</span>
                <span>${new Date(doc.uploadDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="document-status ${doc.status.toLowerCase()}">${doc.status}</div>
    `;
    
    documentItems.insertBefore(docItem, documentItems.firstChild);
}

function filterDocuments(status) {
    const documentItems = document.querySelectorAll('.document-item');
    
    documentItems.forEach(item => {
        if (status === 'all' || item.getAttribute('data-status') === status) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension;
}

function getFileIcon(type) {
    const iconMap = {
        'pdf': 'fa-file-pdf',
        'docx': 'fa-file-word',
        'doc': 'fa-file-word',
        'txt': 'fa-file-text'
    };
    return iconMap[type] || 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Analytics System
function initializeAnalytics() {
    // Chart.js will be initialized when analytics section is shown
}

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping chart initialization');
        return;
    }
    initializeWeeklyProgressChart();
    initializeSubjectComparisonChart();
}

function initializeWeeklyProgressChart() {
    const ctx = document.getElementById('weeklyProgressChart');
    if (!ctx || weeklyChart) return;
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Study Progress (%)',
                data: appData.progressData.weeklyProgress,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f5f5f5'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    }
                }
            }
        }
    });
}

function initializeSubjectComparisonChart() {
    const ctx = document.getElementById('subjectComparisonChart');
    if (!ctx || subjectChart) return;
    
    const subjects = Object.keys(appData.progressData.subjectWise);
    const accuracyData = subjects.map(subject => appData.progressData.subjectWise[subject].accuracy);
    
    subjectChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: subjects,
            datasets: [{
                data: accuracyData,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f5f5f5',
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Data Population
function populateInitialData() {
    populateRecentActivity();
    populateDocuments();
}

function populateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    const activities = appData.progressData.recentActivity;
    
    activityContainer.innerHTML = activities.map(activity => {
        let description = '';
        switch (activity.type) {
            case 'question':
                description = `Solved ${activity.subject} question on ${activity.topic}`;
                break;
            case 'chat':
                description = `Asked: "${activity.query}"`;
                break;
            case 'practice':
                description = `Completed ${activity.count} ${activity.subject} questions`;
                break;
            case 'upload':
                description = `Uploaded document: ${activity.document}`;
                break;
        }
        
        return `
            <div class="activity-item">
                <i class="fas ${activity.icon}"></i>
                <div class="activity-content">
                    <div class="activity-title">${description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function populateDocuments() {
    const documentItems = document.getElementById('documentItems');
    if (!documentItems) return;
    
    // Clear existing items
    documentItems.innerHTML = '';
    
    // Add all documents
    appData.uploadedDocuments.forEach(doc => {
        addDocumentToList(doc);
    });
}

// Notification System
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notifications') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notifications';
    container.className = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// Keyboard Shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for chat focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showSection('chat');
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) chatInput.focus();
            }, 100);
        }
        
        // Ctrl/Cmd + P for practice
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            showSection('practice');
        }
        
        // Ctrl/Cmd + U for upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            showSection('documents');
        }
        
        // Escape to go home
        if (e.key === 'Escape') {
            showSection('home');
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Export functions for global access
window.showSection = showSection;
window.selectExam = selectExam;
window.generateQuestions = generateQuestions;
window.sendMessage = sendMessage;
window.askSampleQuestion = askSampleQuestion;
window.addToInput = addToInput;
window.clearChat = clearChat;
window.selectQuestionOption = selectQuestionOption;
window.showExplanation = showExplanation;
window.bookmarkQuestion = bookmarkQuestion;
window.showNotification = showNotification;