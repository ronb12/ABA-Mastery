// ABA Mastery - Main Application JavaScript
// A product of Bradley Virtual Solutions, LLC

let appData = {
    content: null,
    currentView: 'home',
    currentTopic: null,
    quizState: null,
    flashcardState: null,
    userData: {
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTime: 0,
        topicsStudied: new Set(),
        categoryProgress: {},
        recentActivity: [],
        lastVisit: null
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
    loadUserData();
    setupEventListeners();
    initializePWA();
    hideLoadingScreen();
    updateStats();
});

// Load content from JSON
async function loadContent() {
    try {
        const response = await fetch('content.json?v=1.3.2');
        appData.content = await response.json();
        populateTopics();
        populateCategorySelects();
    } catch (error) {
        console.error('Error loading content:', error);
        showError('Failed to load study content. Please refresh the page.');
    }
}

// Load user data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('abaUserData');
    if (saved) {
        const parsed = JSON.parse(saved);
        appData.userData = {
            ...appData.userData,
            ...parsed,
            topicsStudied: new Set(parsed.topicsStudied || [])
        };
    }
    appData.userData.lastVisit = new Date().toISOString();
    saveUserData();
}

// Save user data to localStorage
function saveUserData() {
    const toSave = {
        ...appData.userData,
        topicsStudied: Array.from(appData.userData.topicsStudied)
    };
    localStorage.setItem('abaUserData', JSON.stringify(toSave));
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('dark-mode-setting')?.addEventListener('change', toggleDarkMode);

    // Mobile menu toggle
    document.getElementById('menu-toggle')?.addEventListener('click', toggleMobileMenu);

    // Quick actions
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (action === 'study') switchView('study');
            else if (action === 'practice') switchView('practice');
            else if (action === 'flashcards') switchView('flashcards');
            else if (action === 'weak-areas') showWeakAreas();
        });
    });

    // Practice exam setup
    document.getElementById('exam-mode')?.addEventListener('change', handleExamModeChange);
    document.getElementById('start-practice')?.addEventListener('click', startPracticeExam);
    document.getElementById('submit-answer')?.addEventListener('click', submitAnswer);
    document.getElementById('next-question')?.addEventListener('click', nextQuestion);
    document.getElementById('finish-quiz')?.addEventListener('click', finishQuiz);
    document.getElementById('prev-question')?.addEventListener('click', previousQuestion);

    // Flashcards
    document.getElementById('flip-card')?.addEventListener('click', flipFlashcard);
    document.getElementById('flashcard')?.addEventListener('click', flipFlashcard);
    document.getElementById('next-card')?.addEventListener('click', () => navigateFlashcard(1));
    document.getElementById('prev-card')?.addEventListener('click', () => navigateFlashcard(-1));
    document.getElementById('flashcard-category')?.addEventListener('change', loadFlashcards);

    // Topic search
    document.getElementById('topic-search')?.addEventListener('input', filterTopics);

    // Settings
    document.getElementById('reset-progress')?.addEventListener('click', resetProgress);
    document.getElementById('export-data')?.addEventListener('click', exportData);
    document.getElementById('sign-out-btn')?.addEventListener('click', handleSignOut);

    // Install prompt
    document.getElementById('install-btn')?.addEventListener('click', installApp);
    document.getElementById('dismiss-install')?.addEventListener('click', dismissInstall);
}

// Switch between views
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${viewName}-view`)?.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
    
    appData.currentView = viewName;

    // Close mobile menu when switching views
    const navMenu = document.getElementById('nav-menu');
    if (navMenu.classList.contains('mobile-open')) {
        toggleMobileMenu();
    }

    if (viewName === 'flashcards') {
        loadFlashcards();
    } else if (viewName === 'progress') {
        updateProgressView();
    }
}

// Populate topics in study view
function populateTopics() {
    const container = document.getElementById('topics-container');
    if (!container || !appData.content) return;

    container.innerHTML = '';
    appData.content.categories.forEach(category => {
        category.topics.forEach(topic => {
            const card = createTopicCard(topic, category);
            container.appendChild(card);
        });
    });
}

// Create topic card element
function createTopicCard(topic, category) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.dataset.category = category.id;
    card.dataset.topicId = topic.id;
    
    const studied = appData.userData.topicsStudied.has(topic.id);
    
    card.innerHTML = `
        <h3>${topic.title}</h3>
        <p>${topic.content.substring(0, 150)}...</p>
        <div class="topic-meta">
            <span class="topic-badge">${category.name}</span>
            ${studied ? '<span>✓ Studied</span>' : ''}
        </div>
    `;
    
    card.addEventListener('click', () => showTopicDetail(topic, category));
    return card;
}

// Show topic detail modal/view
function showTopicDetail(topic, category) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${topic.title}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="topic-category">${category.icon} ${category.name}</div>
                <p class="topic-full-content">${topic.content}</p>
                ${topic.keyPoints ? `
                    <h3>Key Points</h3>
                    <ul>
                        ${topic.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    appData.userData.topicsStudied.add(topic.id);
    saveUserData();
    updateStats();
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
                animation: fadeIn 0.3s;
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius);
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }
            .modal-header {
                padding: 24px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h2 {
                margin: 0;
                font-size: 24px;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 32px;
                cursor: pointer;
                color: var(--text-secondary);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
            }
            .close-btn:hover {
                background: var(--bg-secondary);
            }
            .modal-body {
                padding: 24px;
            }
            .topic-category {
                display: inline-block;
                background: var(--primary-color);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 14px;
                font-weight: 600;
            }
            .topic-full-content {
                line-height: 1.8;
                margin: 20px 0;
            }
            .modal-body h3 {
                margin-top: 24px;
                margin-bottom: 12px;
            }
            .modal-body ul {
                margin-left: 20px;
            }
            .modal-body li {
                margin: 8px 0;
                line-height: 1.6;
            }
            .modal-footer {
                padding: 20px 24px;
                border-top: 1px solid var(--border-color);
                display: flex;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(style);
    }
}

// Filter topics by search
function filterTopics(e) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.topic-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// Populate category selects
function populateCategorySelects() {
    const selects = [
        document.getElementById('practice-category'),
        document.getElementById('flashcard-category')
    ];
    
    selects.forEach(select => {
        if (!select || !appData.content) return;
        
        appData.content.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = `${category.icon} ${category.name}`;
            select.appendChild(option);
        });
    });
}

// Handle exam mode change
function handleExamModeChange() {
    const examMode = document.getElementById('exam-mode').value;
    const customSettings = document.getElementById('custom-settings');
    const helpText = document.getElementById('exam-mode-help');
    const startBtn = document.getElementById('start-practice');
    
    if (examMode === 'practice') {
        customSettings.style.display = 'block';
        helpText.textContent = 'Create a custom practice quiz with your preferred settings';
        startBtn.textContent = 'Start Practice Quiz';
    } else if (examMode === 'bcba') {
        customSettings.style.display = 'none';
        helpText.textContent = 'Full-length BCBA simulation: 100 questions, 2-hour timer, all difficulty levels';
        startBtn.textContent = 'Start BCBA Exam';
    } else if (examMode === 'bcaba') {
        customSettings.style.display = 'none';
        helpText.textContent = 'Full-length BCaBA simulation: 65 questions, 1.5-hour timer, all difficulty levels';
        startBtn.textContent = 'Start BCaBA Exam';
    }
}

// Start practice exam
function startPracticeExam() {
    const examMode = document.getElementById('exam-mode').value;
    let questions = [...appData.content.practiceQuestions];
    let count, examDuration, isFullExam = false;
    
    if (examMode === 'bcba') {
        // Full-length BCBA exam: 100 questions, 2 hours
        count = 100;
        examDuration = 120 * 60 * 1000; // 2 hours in milliseconds
        isFullExam = true;
        questions = shuffle(questions).slice(0, count);
    } else if (examMode === 'bcaba') {
        // Full-length BCaBA exam: 65 questions, 1.5 hours
        count = 65;
        examDuration = 90 * 60 * 1000; // 1.5 hours in milliseconds
        isFullExam = true;
        questions = shuffle(questions).slice(0, count);
    } else {
        // Custom practice quiz
        const category = document.getElementById('practice-category').value;
        count = parseInt(document.getElementById('question-count').value);
        const difficulty = document.getElementById('difficulty-level').value;
        
        // Filter by category
        if (category !== 'all') {
            questions = questions.filter(q => q.category === category);
        }
        
        // Filter by difficulty
        if (difficulty !== 'all') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        // Shuffle and limit
        questions = shuffle(questions).slice(0, Math.min(count, questions.length));
        examDuration = null; // No time limit for practice
    }
    
    if (questions.length === 0) {
        alert('No questions available for selected criteria. Please adjust your selection.');
        return;
    }
    
    if (questions.length < count && isFullExam) {
        alert(`Note: Only ${questions.length} questions available in the question bank. The exam will use all available questions.`);
    }
    
    appData.quizState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        correctCount: 0,
        startTime: Date.now(),
        examMode,
        examDuration,
        isFullExam
    };
    
    document.getElementById('practice-setup').style.display = 'none';
    document.getElementById('practice-quiz').style.display = 'block';
    
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const state = appData.quizState;
    const question = state.questions[state.currentIndex];
    
    document.getElementById('question-number').textContent = 
        `Question ${state.currentIndex + 1} of ${state.questions.length}`;
    document.getElementById('question-text').textContent = question.question;
    
    const container = document.getElementById('answers-container');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-option';
        btn.textContent = option;
        btn.dataset.index = index;
        
        if (state.answers[state.currentIndex] === index) {
            btn.classList.add('selected');
        }
        
        btn.addEventListener('click', () => selectAnswer(index));
        container.appendChild(btn);
    });
    
    // Update progress bar
    const progress = ((state.currentIndex) / state.questions.length) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
    
    // Update buttons
    document.getElementById('prev-question').disabled = state.currentIndex === 0;
    document.getElementById('explanation-container').style.display = 'none';
    document.getElementById('submit-answer').style.display = 
        state.answers[state.currentIndex] === null ? 'inline-flex' : 'none';
    document.getElementById('next-question').style.display = 
        state.answers[state.currentIndex] !== null && state.currentIndex < state.questions.length - 1 ? 'inline-flex' : 'none';
    document.getElementById('finish-quiz').style.display = 
        state.answers[state.currentIndex] !== null && state.currentIndex === state.questions.length - 1 ? 'inline-flex' : 'none';
}

// Select an answer
function selectAnswer(index) {
    const state = appData.quizState;
    if (state.answers[state.currentIndex] !== null) return; // Already answered
    
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    state.selectedAnswer = index;
}

// Submit answer
function submitAnswer() {
    const state = appData.quizState;
    if (state.selectedAnswer === undefined) {
        alert('Please select an answer');
        return;
    }
    
    const question = state.questions[state.currentIndex];
    state.answers[state.currentIndex] = state.selectedAnswer;
    
    const isCorrect = state.selectedAnswer === question.correctAnswer;
    if (isCorrect) state.correctCount++;
    
    // Show correct/incorrect
    document.querySelectorAll('.answer-option').forEach((btn, index) => {
        if (index === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === state.selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
        btn.style.pointerEvents = 'none';
    });
    
    // Show explanation
    const explanationDiv = document.getElementById('explanation-container');
    explanationDiv.innerHTML = `
        <h4>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
        <p>${question.explanation}</p>
    `;
    explanationDiv.style.display = 'block';
    
    // Update user data
    appData.userData.questionsAnswered++;
    if (isCorrect) appData.userData.correctAnswers++;
    saveUserData();
    updateStats();
    
    // Update buttons
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-question').style.display = 
        state.currentIndex < state.questions.length - 1 ? 'inline-flex' : 'none';
    document.getElementById('finish-quiz').style.display = 
        state.currentIndex === state.questions.length - 1 ? 'inline-flex' : 'none';
    
    delete state.selectedAnswer;
}

// Next question
function nextQuestion() {
    appData.quizState.currentIndex++;
    displayQuestion();
}

// Previous question
function previousQuestion() {
    appData.quizState.currentIndex--;
    displayQuestion();
}

// Finish quiz
function finishQuiz() {
    const state = appData.quizState;
    const duration = Math.floor((Date.now() - state.startTime) / 1000 / 60);
    const score = Math.round((state.correctCount / state.questions.length) * 100);
    const isFullExam = state.isFullExam;
    const examMode = state.examMode;
    
    appData.userData.studyTime += duration;
    appData.userData.recentActivity.unshift({
        type: isFullExam ? 'exam' : 'quiz',
        date: new Date().toISOString(),
        score,
        questions: state.questions.length,
        examMode
    });
    if (appData.userData.recentActivity.length > 10) {
        appData.userData.recentActivity = appData.userData.recentActivity.slice(0, 10);
    }
    saveUserData();
    
    document.getElementById('practice-quiz').style.display = 'none';
    const resultsDiv = document.getElementById('practice-results');
    
    // Calculate section breakdown
    const sectionBreakdown = {};
    state.questions.forEach((q, idx) => {
        const section = q.section || 'General';
        if (!sectionBreakdown[section]) {
            sectionBreakdown[section] = { correct: 0, total: 0 };
        }
        sectionBreakdown[section].total++;
        if (state.answers[idx] === q.correctAnswer) {
            sectionBreakdown[section].correct++;
        }
    });
    
    let sectionHTML = '';
    if (isFullExam && Object.keys(sectionBreakdown).length > 1) {
        sectionHTML = '<div class="section-breakdown"><h3>Performance by Section</h3><div class="section-grid">';
        Object.entries(sectionBreakdown).sort().forEach(([section, data]) => {
            const sectionScore = Math.round((data.correct / data.total) * 100);
            sectionHTML += `
                <div class="section-card">
                    <div class="section-name">Section ${section}</div>
                    <div class="section-score">${sectionScore}%</div>
                    <div class="section-detail">${data.correct}/${data.total} correct</div>
                </div>
            `;
        });
        sectionHTML += '</div></div>';
    }
    
    // Pass/fail status for full exams (typically 70% to pass)
    const passingScore = 70;
    const passed = score >= passingScore;
    let passFailHTML = '';
    
    if (isFullExam) {
        const examTitle = examMode === 'bcba' ? 'BCBA' : 'BCaBA';
        passFailHTML = `
            <div class="pass-fail-banner ${passed ? 'passed' : 'failed'}">
                ${passed ? '✅ PASS' : '❌ NOT PASSING'} 
                <span class="pass-fail-detail">(${passingScore}% required)</span>
            </div>
            <p class="exam-note">
                <strong>${examTitle} Practice Exam Results</strong><br>
                Note: This is a practice exam. Actual exam pass scores are determined by the BACB using scaled scoring.
            </p>
        `;
    }
    
    resultsDiv.innerHTML = `
        <h2>${isFullExam ? 'Exam' : 'Quiz'} Complete!</h2>
        ${passFailHTML}
        <div class="results-score ${passed && isFullExam ? 'passing' : ''}">${score}%</div>
        <div class="results-breakdown">
            <div class="stat-card">
                <div class="stat-value">${state.correctCount}/${state.questions.length}</div>
                <div class="stat-label">Questions Correct</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${duration} min</div>
                <div class="stat-label">Time Taken</div>
            </div>
            ${isFullExam ? `
                <div class="stat-card">
                    <div class="stat-value">${Math.round((state.correctCount / state.questions.length) * 100)}</div>
                    <div class="stat-label">Percentile</div>
                </div>
            ` : ''}
        </div>
        ${sectionHTML}
        <div class="quiz-actions">
            <button class="btn btn-secondary" onclick="reviewQuiz()">Review Answers</button>
            <button class="btn btn-primary" onclick="resetPracticeView()">New ${isFullExam ? 'Exam' : 'Quiz'}</button>
            <button class="btn btn-secondary" onclick="switchView('home')">Home</button>
        </div>
    `;
    resultsDiv.style.display = 'block';
    updateStats();
}

// Reset practice view
function resetPracticeView() {
    document.getElementById('practice-results').style.display = 'none';
    document.getElementById('practice-setup').style.display = 'block';
    appData.quizState = null;
}

// Load flashcards
function loadFlashcards() {
    const category = document.getElementById('flashcard-category').value;
    let flashcards = [...appData.content.flashcards];
    
    if (category !== 'all') {
        flashcards = flashcards.filter(fc => fc.category === category);
    }
    
    flashcards = shuffle(flashcards);
    
    appData.flashcardState = {
        cards: flashcards,
        currentIndex: 0
    };
    
    displayFlashcard();
}

// Display current flashcard
function displayFlashcard() {
    const state = appData.flashcardState;
    if (!state || state.cards.length === 0) return;
    
    const card = state.cards[state.currentIndex];
    
    document.getElementById('flashcard-question').textContent = card.question;
    document.getElementById('flashcard-answer').textContent = card.answer;
    document.getElementById('card-counter').textContent = 
        `${state.currentIndex + 1} / ${state.cards.length}`;
    
    // Reset flip
    document.getElementById('flashcard').dataset.flipped = 'false';
    
    // Update navigation buttons
    document.getElementById('prev-card').disabled = state.currentIndex === 0;
    document.getElementById('next-card').disabled = state.currentIndex === state.cards.length - 1;
}

// Flip flashcard
function flipFlashcard() {
    const card = document.getElementById('flashcard');
    const isFlipped = card.dataset.flipped === 'true';
    card.dataset.flipped = isFlipped ? 'false' : 'true';
}

// Navigate flashcards
function navigateFlashcard(direction) {
    const state = appData.flashcardState;
    state.currentIndex += direction;
    state.currentIndex = Math.max(0, Math.min(state.currentIndex, state.cards.length - 1));
    displayFlashcard();
}

// Update statistics on home screen
function updateStats() {
    document.getElementById('total-topics').textContent = 
        appData.content?.categories.reduce((sum, cat) => sum + cat.topics.length, 0) || 0;
    document.getElementById('questions-answered').textContent = appData.userData.questionsAnswered;
    document.getElementById('study-time').textContent = `${appData.userData.studyTime}m`;
    
    const accuracy = appData.userData.questionsAnswered > 0 
        ? Math.round((appData.userData.correctAnswers / appData.userData.questionsAnswered) * 100)
        : 0;
    document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
    
    // Update progress bar
    const totalTopics = appData.content?.categories.reduce((sum, cat) => sum + cat.topics.length, 0) || 1;
    const studiedTopics = appData.userData.topicsStudied.size;
    const progress = (studiedTopics / totalTopics) * 100;
    document.getElementById('overall-progress').style.width = `${progress}%`;
}

// Update progress view
function updateProgressView() {
    // Category breakdown
    const breakdown = document.getElementById('category-breakdown');
    breakdown.innerHTML = '';
    
    appData.content.categories.forEach(category => {
        const categoryQuestions = appData.content.practiceQuestions.filter(q => q.category === category.id);
        const answeredInCategory = categoryQuestions.length; // Simplified - would track actual answers
        const progress = categoryQuestions.length > 0 ? 50 : 0; // Simplified
        
        const item = document.createElement('div');
        item.className = 'category-progress';
        item.innerHTML = `
            <div class="category-progress-header">
                <span>${category.icon} ${category.name}</span>
                <span>${progress}%</span>
            </div>
            <div class="category-progress-bar">
                <div class="category-progress-fill" style="width: ${progress}%"></div>
            </div>
        `;
        breakdown.appendChild(item);
    });
    
    // Recent activity
    const activityDiv = document.getElementById('recent-activity');
    activityDiv.innerHTML = '';
    
    if (appData.userData.recentActivity.length === 0) {
        activityDiv.innerHTML = '<p>No recent activity</p>';
    } else {
        appData.userData.recentActivity.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            const date = new Date(activity.date).toLocaleDateString();
            item.textContent = `${date}: Completed quiz with ${activity.score}% (${activity.questions} questions)`;
            activityDiv.appendChild(item);
        });
    }
}

// Dark mode toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('darkMode', isDark ? 'light' : 'dark');
    
    document.getElementById('dark-mode-setting').checked = !isDark;
    document.getElementById('dark-mode-toggle').querySelector('.icon').textContent = isDark ? '🌙' : '☀️';
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    navMenu.classList.toggle('mobile-open');
    
    // Update hamburger icon
    const icon = menuToggle.querySelector('.icon');
    icon.textContent = navMenu.classList.contains('mobile-open') ? '✕' : '☰';
}

// Load dark mode preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    document.getElementById('dark-mode-setting').checked = true;
    document.getElementById('dark-mode-toggle').querySelector('.icon').textContent = '☀️';
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('abaUserData');
        location.reload();
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(appData.userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aba-mastery-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Utility: Shuffle array
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Show error message
function showError(message) {
    alert(message); // Simple for now
}

// Hide loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
    }, 500);
}

// PWA Installation
let deferredPrompt;

function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js?v=1.0.0')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
    
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('install-prompt').style.display = 'block';
    });
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('install-prompt').style.display = 'none';
        });
    }
}

function dismissInstall() {
    document.getElementById('install-prompt').style.display = 'none';
    localStorage.setItem('installDismissed', 'true');
}

// Timer for practice quiz
let timerInterval;

function startTimer() {
    const timerEl = document.getElementById('timer');
    const quizState = appData.quizState;
    let seconds;
    let isCountdown = false;
    
    if (quizState && quizState.examDuration) {
        // Countdown timer for full-length exams
        seconds = Math.floor(quizState.examDuration / 1000);
        isCountdown = true;
    } else {
        // Count up timer for practice quizzes
        seconds = 0;
        isCountdown = false;
    }
    
    function updateTimer() {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        let display;
        if (hours > 0) {
            display = `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        } else {
            display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        timerEl.textContent = display;
        
        // Color warnings for countdown
        if (isCountdown) {
            if (seconds <= 60) {
                timerEl.style.color = '#ef4444';
            } else if (seconds <= 600) {
                timerEl.style.color = '#f59e0b';
            } else {
                timerEl.style.color = '';
            }
        }
    }
    
    updateTimer();
    
    timerInterval = setInterval(() => {
        if (isCountdown) {
            seconds--;
            if (seconds <= 0) {
                stopTimer();
                alert('Time is up! Your exam will be automatically submitted.');
                finishQuiz();
                return;
            }
            if (seconds === 600) alert('⏰ 10 minutes remaining!');
            if (seconds === 60) alert('⚠️ 1 minute remaining!');
        } else {
            seconds++;
        }
        updateTimer();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Update start practice to include timer
const originalStartPractice = startPracticeExam;
startPracticeExam = function() {
    originalStartPractice();
    startTimer();
};

// Update finish quiz to stop timer
const originalFinishQuiz = finishQuiz;
finishQuiz = function() {
    stopTimer();
    originalFinishQuiz();
};

