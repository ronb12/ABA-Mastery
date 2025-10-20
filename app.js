// ABA Mastery - Main Application JavaScript
// A product of Bradley Virtual Solutions, LLC

let appData = {
    content: null,
    currentView: 'home',
    currentTopic: null,
    quizState: null,
    flashcardState: null,
    scenarioQuizState: null,
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

// Load content from JSON with retry logic
async function loadContent(retryCount = 0) {
    try {
        const response = await fetch('content.json?v=2.0.0');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        appData.content = await response.json();
        
        // Verify content loaded properly
        if (!appData.content || !appData.content.categories || !Array.isArray(appData.content.categories)) {
            throw new Error('Invalid content structure - missing categories');
        }
        
        if (appData.content.categories.length === 0) {
            throw new Error('Content has no categories');
        }
        
        populateTopics();
        populateCategorySelects();
        
        console.log('✅ Study content loaded successfully');
        
    } catch (error) {
        console.error('Error loading content:', error);
        
        // Retry up to 2 times
        if (retryCount < 2) {
            console.log(`Retrying... (attempt ${retryCount + 1}/2)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return loadContent(retryCount + 1);
        }
        
        // Only show error after retries failed
        console.error('Failed to load content after 3 attempts');
        showError('Failed to load study content. Please check your connection and refresh the page.');
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
    document.getElementById('reshuffle-cards')?.addEventListener('click', reshuffleFlashcards);

    // Scenario Quiz
    document.getElementById('start-scenario-quiz')?.addEventListener('click', startScenarioQuiz);
    document.getElementById('next-scenario')?.addEventListener('click', nextScenario);
    document.getElementById('prev-scenario')?.addEventListener('click', previousScenario);
    document.getElementById('finish-scenario-quiz')?.addEventListener('click', finishScenarioQuiz);

    // Topic search
    document.getElementById('topic-search')?.addEventListener('input', filterTopics);

    // Settings
    document.getElementById('reset-progress')?.addEventListener('click', resetProgress);
    document.getElementById('export-progress-pdf')?.addEventListener('click', generateProgressPDF);
    document.getElementById('export-study-data-pdf')?.addEventListener('click', generateStudyDataPDF);
    document.getElementById('sign-out-btn')?.addEventListener('click', handleSignOut);

    // Install prompt
    document.getElementById('install-btn')?.addEventListener('click', installApp);
    document.getElementById('dismiss-install')?.addEventListener('click', dismissInstall);
}

// Toggle mobile navigation dropdown
function toggleMoreMenu() {
    const dropdown = document.getElementById('nav-dropdown');
    const moreBtn = document.getElementById('nav-more-btn');
    
    if (dropdown && moreBtn) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            // Close dropdown
            dropdown.classList.remove('show');
            moreBtn.classList.remove('active');
        } else {
            // Open dropdown
            dropdown.classList.add('show');
            moreBtn.classList.add('active');
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('nav-dropdown');
    const moreBtn = document.getElementById('nav-more-btn');
    
    if (dropdown && moreBtn && !dropdown.contains(e.target) && !moreBtn.contains(e.target)) {
        dropdown.classList.remove('show');
        moreBtn.classList.remove('active');
    }
});

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
    
    // Close dropdown menu when switching views
    const dropdown = document.getElementById('nav-dropdown');
    const moreBtn = document.getElementById('nav-more-btn');
    if (dropdown && moreBtn && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        moreBtn.classList.remove('active');
    }

    if (viewName === 'flashcards') {
        loadFlashcards();
    } else if (viewName === 'scenarios') {
        loadScenarios();
    } else if (viewName === 'case-studies') {
        loadCaseStudies();
    } else if (viewName === 'progress') {
        updateProgressView();
    } else if (viewName === 'study-groups') {
        if (typeof studyGroupsManager !== 'undefined') {
            studyGroupsManager.displayStudyGroupsView();
        }
    } else if (viewName === 'success-rates') {
        // Load success rates asynchronously
        setTimeout(() => {
            if (typeof examPassTracker !== 'undefined') {
                examPassTracker.displayPassRateDashboard().catch(err => {
                    console.error('Error loading success rates:', err);
                });
            }
        }, 100);
    }
}

// Populate topics in study view
function populateTopics() {
    const debugInfo = document.getElementById('debug-info');
    const debugText = document.getElementById('debug-text');
    const container = document.getElementById('topics-container');
    
    // Show debug panel on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && debugInfo) {
        debugInfo.style.display = 'block';
    }
    
    if (!container) {
        console.error('❌ Topics container not found');
        if (debugText) debugText.innerHTML = '❌ ERROR: Topics container element not found in HTML';
        return;
    }
    
    if (debugText) debugText.innerHTML = 'Container found ✓. Checking content...';
    
    if (!appData.content) {
        console.error('❌ No content loaded');
        if (debugText) debugText.innerHTML = '❌ ERROR: Content not loaded from content.json';
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;"><h3>⚠️ Content not loaded</h3><p>Please refresh the page</p></div>';
        return;
    }
    
    if (debugText) debugText.innerHTML = 'Content loaded ✓. Categories: ' + (appData.content.categories ? appData.content.categories.length : 0);
    
    if (!appData.content.categories || appData.content.categories.length === 0) {
        console.error('❌ No categories in content');
        if (debugText) debugText.innerHTML = '❌ ERROR: No categories found in content';
        container.innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ No study topics available</h3></div>';
        return;
    }

    console.log('✅ Populating topics...', appData.content.categories.length, 'categories');
    container.innerHTML = '';
    
    let topicCount = 0;
    appData.content.categories.forEach(category => {
        if (category.topics && Array.isArray(category.topics)) {
            category.topics.forEach(topic => {
                const card = createTopicCard(topic, category);
                container.appendChild(card);
                topicCount++;
            });
        }
    });
    
    console.log('✅ Added', topicCount, 'topic cards to container');
    if (debugText) debugText.innerHTML = '✅ SUCCESS: Added ' + topicCount + ' topics. Device: ' + navigator.userAgent.substring(0, 50);
    
    // Force display after adding cards
    setTimeout(() => {
        container.style.display = 'grid';
        container.style.visibility = 'visible';
        // Hide debug after 3 seconds if successful
        if (topicCount > 0 && debugInfo) {
            setTimeout(() => debugInfo.style.display = 'none', 3000);
        }
    }, 100);
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
    // Format content: convert \n\n to paragraphs and \n to line breaks
    // Also make section headers (ALL CAPS followed by colon) bold
    const formattedContent = topic.content
        .split('\n\n')
        .map(para => {
            // Check if paragraph starts with section header (ALL CAPS text followed by colon)
            const headerMatch = para.match(/^([A-Z\s&,'()]+:)/);
            if (headerMatch) {
                // Make the header bold
                const header = headerMatch[1];
                const rest = para.substring(header.length);
                return `<p><strong class="section-header">${header}</strong>${rest.replace(/\n/g, '<br>')}</p>`;
            }
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
    
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
                <div class="topic-full-content">${formattedContent}</div>
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
            .topic-full-content {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .topic-full-content p {
                margin-bottom: 1.5em;
                line-height: 1.7;
                display: block !important;
                visibility: visible !important;
            }
            
            .topic-full-content p:last-child {
                margin-bottom: 0;
            }
            
            .section-header {
                display: block;
                color: var(--primary);
                font-size: 1.1em;
                margin-bottom: 0.5em;
                letter-spacing: 0.5px;
            }
            
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex !important;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
                animation: fadeIn 0.3s;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius);
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                box-shadow: var(--shadow-xl);
                position: relative;
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
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                max-height: calc(90vh - 180px);
                display: block !important;
                visibility: visible !important;
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
    
    // Sync to cloud after quiz completion
    if (typeof cloudSync !== 'undefined') {
        cloudSync.pushToCloud('quiz-completion');
    }
    
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

// Reshuffle flashcards
function reshuffleFlashcards() {
    if (!appData.flashcardState || !appData.flashcardState.cards) {
        return;
    }
    
    // Shuffle the current cards
    appData.flashcardState.cards = shuffle(appData.flashcardState.cards);
    appData.flashcardState.currentIndex = 0;
    
    // Show first card of newly shuffled deck
    displayFlashcard();
    
    // Visual feedback
    const btn = document.getElementById('reshuffle-cards');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Shuffled!';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}

// Load and display scenario questions
function loadScenarios() {
    // Show setup screen
    const setupEl = document.getElementById('scenario-setup');
    const quizEl = document.getElementById('scenario-quiz-container');
    const resultsEl = document.getElementById('scenario-results');
    
    if (setupEl) setupEl.style.display = 'block';
    if (quizEl) quizEl.style.display = 'none';
    if (resultsEl) resultsEl.style.display = 'none';
    
    console.log('Scenario view loaded. Available scenarios:', appData.content?.scenarioQuestions?.length || 0);
}

// Start scenario quiz
function startScenarioQuiz() {
    console.log('🎯 Starting scenario quiz...');
    
    const category = document.getElementById('scenario-category-select')?.value || 'all';
    const count = parseInt(document.getElementById('scenario-count')?.value || 10);
    const difficulty = document.getElementById('scenario-difficulty')?.value || 'all';
    
    console.log('Settings:', { category, count, difficulty });
    
    let scenarios = [...(appData.content.scenarioQuestions || [])];
    
    console.log('Total scenarios available:', scenarios.length);
    
    if (scenarios.length === 0) {
        alert('No scenario questions available yet.');
        return;
    }
    
    // Filter by category
    if (category !== 'all') {
        scenarios = scenarios.filter(s => s.category === category);
    }
    
    // Filter by difficulty
    if (difficulty !== 'all') {
        scenarios = scenarios.filter(s => s.difficulty === difficulty);
    }
    
    // Shuffle and limit
    scenarios = shuffle(scenarios).slice(0, Math.min(count, scenarios.length));
    
    if (scenarios.length === 0) {
        alert('No scenarios available for selected criteria. Please adjust your selection.');
        return;
    }
    
    // Initialize scenario quiz state
    appData.scenarioQuizState = {
        scenarios: scenarios,
        currentIndex: 0,
        answers: new Array(scenarios.length).fill(null),
        startTime: Date.now()
    };
    
    // Show quiz, hide setup
    document.getElementById('scenario-setup').style.display = 'none';
    document.getElementById('scenario-quiz-container').style.display = 'block';
    document.getElementById('scenario-results').style.display = 'none';
    
    displayCurrentScenario();
}

// Display current scenario
function displayCurrentScenario() {
    const state = appData.scenarioQuizState;
    const scenario = state.scenarios[state.currentIndex];
    
    // Update progress
    document.getElementById('scenario-current').textContent = state.currentIndex + 1;
    document.getElementById('scenario-total').textContent = state.scenarios.length;
    document.getElementById('scenario-current-category').textContent = scenario.category;
    document.getElementById('scenario-current-difficulty').textContent = scenario.difficulty;
    document.getElementById('scenario-current-difficulty').className = `difficulty-badge difficulty-${scenario.difficulty}`;
    
    // Display scenario and question
    document.getElementById('scenario-text').textContent = scenario.scenario;
    document.getElementById('scenario-question-text').textContent = scenario.question;
    
    // Display options
    const optionsContainer = document.getElementById('scenario-options-container');
    optionsContainer.innerHTML = scenario.options.map((option, idx) => `
        <div class="option-button" data-option="${String.fromCharCode(65 + idx)}" onclick="selectScenarioAnswer('${String.fromCharCode(65 + idx)}')">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="option-text">${option}</span>
        </div>
    `).join('');
    
    // Clear/hide feedback
    const feedbackEl = document.getElementById('scenario-feedback');
    feedbackEl.style.display = 'none';
    feedbackEl.innerHTML = '';
    
    // Update navigation buttons
    document.getElementById('prev-scenario').disabled = state.currentIndex === 0;
    document.getElementById('next-scenario').style.display = 'none';
    document.getElementById('finish-scenario-quiz').style.display = 'none';
    
    // If already answered, show the answer
    if (state.answers[state.currentIndex] !== null) {
        showScenarioFeedback(state.answers[state.currentIndex]);
    }
}

// Handle scenario answer selection
function selectScenarioAnswer(selectedAnswer) {
    const state = appData.scenarioQuizState;
    
    // Save answer
    state.answers[state.currentIndex] = selectedAnswer;
    
    // Show feedback
    showScenarioFeedback(selectedAnswer);
}

// Show feedback for scenario
function showScenarioFeedback(selectedAnswer) {
    const state = appData.scenarioQuizState;
    const scenario = state.scenarios[state.currentIndex];
    const isCorrect = selectedAnswer === scenario.correctAnswer;
    
    // Highlight selected answer
    document.querySelectorAll('.option-button').forEach(btn => {
        const option = btn.dataset.option;
        btn.classList.remove('selected', 'correct', 'incorrect');
        
        if (option === selectedAnswer) {
            btn.classList.add('selected');
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        
        // Show correct answer if user was wrong
        if (!isCorrect && option === scenario.correctAnswer) {
            btn.classList.add('correct');
        }
        
        // Disable all options after answering
        btn.style.pointerEvents = 'none';
    });
    
    // Show feedback
    const feedbackEl = document.getElementById('scenario-feedback');
    if (!feedbackEl) {
        console.error('scenario-feedback element not found');
        return;
    }
    feedbackEl.style.display = 'block';
    feedbackEl.className = `feedback-container ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    feedbackEl.innerHTML = `
        <div class="feedback-header">
            ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </div>
        ${!isCorrect ? `<div class="feedback-correct-answer">The correct answer is: <strong>${scenario.correctAnswer}) ${scenario.options[scenario.correctAnswer.charCodeAt(0) - 65]}</strong></div>` : ''}
        <div class="feedback-explanation">
            <strong>Explanation:</strong> ${scenario.explanation}
        </div>
        ${scenario.bacbTaskList ? `<div class="feedback-task-list"><strong>BACB Task List:</strong> ${scenario.bacbTaskList.join(', ')}</div>` : ''}
        ${scenario.keywords ? `<div class="feedback-keywords"><strong>Keywords:</strong> ${scenario.keywords.join(', ')}</div>` : ''}
    `;
    
    // Show next button
    if (state.currentIndex < state.scenarios.length - 1) {
        document.getElementById('next-scenario').style.display = 'inline-block';
    } else {
        document.getElementById('finish-scenario-quiz').style.display = 'inline-block';
    }
}

// Navigate scenarios
function nextScenario() {
    const state = appData.scenarioQuizState;
    if (state.currentIndex < state.scenarios.length - 1) {
        state.currentIndex++;
        displayCurrentScenario();
    }
}

function previousScenario() {
    const state = appData.scenarioQuizState;
    if (state.currentIndex > 0) {
        state.currentIndex--;
        displayCurrentScenario();
    }
}

// Finish scenario quiz
function finishScenarioQuiz() {
    const state = appData.scenarioQuizState;
    const correctCount = state.answers.filter((ans, idx) => ans === state.scenarios[idx].correctAnswer).length;
    const percentage = Math.round((correctCount / state.scenarios.length) * 100);
    const timeTaken = Math.round((Date.now() - state.startTime) / 1000 / 60);
    
    // Hide quiz, show results
    document.getElementById('scenario-quiz-container').style.display = 'none';
    const resultsEl = document.getElementById('scenario-results');
    resultsEl.style.display = 'block';
    
    resultsEl.innerHTML = `
        <div class="results-container">
            <h2>Scenario Quiz Results</h2>
            <div class="results-summary">
                <div class="result-stat">
                    <div class="stat-value">${percentage}%</div>
                    <div class="stat-label">Score</div>
                </div>
                <div class="result-stat">
                    <div class="stat-value">${correctCount}/${state.scenarios.length}</div>
                    <div class="stat-label">Correct</div>
                </div>
                <div class="result-stat">
                    <div class="stat-value">${timeTaken} min</div>
                    <div class="stat-label">Time</div>
                </div>
            </div>
            <div class="results-message ${percentage >= 80 ? 'pass-message' : 'review-message'}">
                ${percentage >= 90 ? '🎉 Excellent! You\'re mastering clinical application!' : 
                  percentage >= 80 ? '✅ Good job! Keep practicing scenarios.' :
                  percentage >= 70 ? '⚠️ Review the explanations and try again.' :
                  '📚 Study the topics more and practice again.'}
            </div>
            <div class="results-actions">
                <button class="btn btn-primary" onclick="startScenarioQuiz()">Practice More Scenarios</button>
                <button class="btn btn-secondary" onclick="reviewScenarioAnswers()">Review Answers</button>
                <button class="btn btn-secondary" onclick="switchView('home')">Back to Home</button>
            </div>
        </div>
    `;
    
    // Sync to cloud after scenario quiz completion
    if (typeof cloudSync !== 'undefined') {
        cloudSync.pushToCloud('scenario-quiz-completion');
    }
}

// Review scenario answers
function reviewScenarioAnswers() {
    const state = appData.scenarioQuizState;
    state.currentIndex = 0;
    document.getElementById('scenario-results').style.display = 'none';
    document.getElementById('scenario-quiz-container').style.display = 'block';
    displayCurrentScenario();
}

// Load and display published case studies
function loadCaseStudies() {
    const container = document.getElementById('case-studies-container');
    if (!container) return;
    
    const caseStudies = appData.content.publishedCaseStudies || [];
    
    if (caseStudies.length === 0) {
        container.innerHTML = '<p class="no-content">No case studies available yet.</p>';
        return;
    }
    
    // Display case studies
    container.innerHTML = `
        <div class="case-studies-stats">
            <p><strong>${caseStudies.length}</strong> peer-reviewed case studies from JABA, JEAB, and other leading journals</p>
        </div>
        <div class="case-studies-list">
            ${caseStudies.map((study, index) => `
                <div class="case-study-card">
                    <div class="case-study-header">
                        <h3>${index + 1}. ${study.title}</h3>
                        <span class="case-study-category">${study.category}</span>
                    </div>
                    <div class="case-study-citation">
                        <strong>Citation:</strong> ${study.citation}
                        ${study.doi ? `<br><strong>DOI:</strong> <a href="https://doi.org/${study.doi}" target="_blank">${study.doi}</a>` : ''}
                        ${study.accessInfo?.openAccess ? '<span class="open-access-badge">✅ Open Access</span>' : ''}
                    </div>
                    <div class="case-study-content">
                        ${study.study ? `
                            <div class="case-section">
                                <strong>Study Details:</strong>
                                <ul>
                                    <li><strong>Participants:</strong> ${study.study.participants}</li>
                                    <li><strong>Setting:</strong> ${study.study.setting}</li>
                                    <li><strong>Problem Behaviors:</strong> ${study.study.problemBehaviors}</li>
                                    ${study.study.duration ? `<li><strong>Duration:</strong> ${study.study.duration}</li>` : ''}
                                </ul>
                            </div>
                        ` : ''}
                        ${study.results?.quantitativeData ? `
                            <div class="case-section">
                                <strong>Key Results:</strong>
                                <p>${typeof study.results.quantitativeData === 'string' ? study.results.quantitativeData : JSON.stringify(study.results.quantitativeData, null, 2)}</p>
                            </div>
                        ` : ''}
                        ${study.significance ? `
                            <div class="case-section">
                                <strong>Significance:</strong>
                                <p>${study.significance.clinical || study.significance.theoretical}</p>
                            </div>
                        ` : ''}
                        ${study.keyConcepts ? `
                            <div class="case-section">
                                <strong>Key Concepts:</strong> ${study.keyConcepts.join(', ')}
                            </div>
                        ` : ''}
                        ${study.examRelevance ? `
                            <div class="case-section exam-relevance">
                                <strong>Exam Relevance:</strong> ${study.examRelevance}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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

// Update progress view (legacy function - modern dashboard is self-updating)
function updateProgressView() {
    // Category breakdown
    const breakdown = document.getElementById('category-breakdown');
    if (!breakdown) {
        // Element not in current template - this is expected
        // Modern dashboard updates itself via event listeners
        return;
    }
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


// Utility: Shuffle array
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================================================
// PROFESSIONAL PDF PROGRESS REPORT
// ============================================================================

function generateProgressPDF() {
    try {
        console.log('📄 Generating PDF Progress Report...');
        
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }
        
        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF();
        
        const userData = appData.userData || {};
        const stats = calculateOverallStats();
        
        // Page setup
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        let yPos = 20;
        
        // ===== HEADER =====
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('ABA MASTERY', pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Exam Preparation Progress Report', pageWidth / 2, 27, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 200);
        doc.text('Professional Exam Preparation Platform', pageWidth / 2, 37, { align: 'center' });
        
        yPos = 55;
        doc.setTextColor(0, 0, 0);
        
        // ===== REPORT INFO =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        if (userData.email) {
            doc.text(`Student: ${userData.email}`, margin, yPos);
            yPos += 8;
        }
        
        // ===== EXAM READINESS SECTION =====
        doc.setFillColor(46, 204, 113);
        doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('EXAM READINESS', pageWidth / 2, yPos + 4, { align: 'center' });
        
        doc.setFontSize(24);
        const readinessScore = Math.round(stats.averageScore);
        doc.text(`${readinessScore}%`, pageWidth / 2, yPos + 15, { align: 'center' });
        
        yPos += 35;
        doc.setTextColor(0, 0, 0);
        
        // Readiness interpretation
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        let readinessText = '';
        if (readinessScore >= 90) readinessText = '✅ EXCELLENT - Ready to pass exam!';
        else if (readinessScore >= 80) readinessText = '✓ GOOD - Nearly ready, review weak areas';
        else if (readinessScore >= 70) readinessText = '⚠ FAIR - Additional study recommended';
        else readinessText = '⚠ NEEDS WORK - Significant study required';
        
        doc.text(readinessText, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        
        // ===== OVERALL STATISTICS =====
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Overall Statistics', margin, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const overallStats = [
            ['Total Questions Answered:', `${stats.totalAnswered}`],
            ['Correct Answers:', `${stats.totalCorrect} (${readinessScore}%)`],
            ['Practice Quizzes Completed:', `${userData.completedQuizzes || 0}`],
            ['Flashcards Reviewed:', `${userData.flashcardsReviewed || 0}`],
            ['Scenario Quizzes Taken:', `${userData.scenarioQuizzes || 0}`],
            ['Study Streak:', `${userData.studyStreak || 0} days`]
        ];
        
        overallStats.forEach(([label, value]) => {
            doc.text(label, margin + 5, yPos);
            doc.text(value, pageWidth - margin - 5, yPos, { align: 'right' });
            yPos += 7;
        });
        
        yPos += 10;
        
        // ===== PERFORMANCE BY CATEGORY =====
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance by Category', margin, yPos);
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Calculate category stats
        const categoryStats = calculateCategoryStats();
        
        // Table header
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Category', margin + 2, yPos + 2);
        doc.text('Questions', pageWidth - margin - 50, yPos + 2, { align: 'right' });
        doc.text('Score', pageWidth - margin - 10, yPos + 2, { align: 'right' });
        yPos += 10;
        
        // Category rows
        doc.setFont('helvetica', 'normal');
        const topCategories = Object.entries(categoryStats).slice(0, 12);
        
        topCategories.forEach(([category, data], index) => {
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = 20;
            }
            
            const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            
            // Alternating row colors
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 7, 'F');
            }
            
            // Category name (truncate if too long)
            const displayName = category.length > 30 ? category.substring(0, 27) + '...' : category;
            doc.text(displayName, margin + 2, yPos + 1);
            
            // Questions answered
            doc.text(`${data.total}`, pageWidth - margin - 50, yPos + 1, { align: 'right' });
            
            // Score with color coding
            if (score >= 80) doc.setTextColor(39, 174, 96);
            else if (score >= 70) doc.setTextColor(243, 156, 18);
            else doc.setTextColor(231, 76, 60);
            
            doc.text(`${score}%`, pageWidth - margin - 10, yPos + 1, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            
            yPos += 7;
        });
        
        yPos += 10;
        
        // ===== STUDY RECOMMENDATIONS =====
        if (yPos > pageHeight - 80) {
            doc.addPage();
            yPos = 20;
        }
        
        // Section header with purple background
        doc.setFillColor(155, 89, 182);
        doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Study Recommendations', pageWidth / 2, yPos + 8, { align: 'center' });
        yPos += 28;
        doc.setTextColor(0, 0, 0);
        
        // Find weak areas (categories below 70%)
        const weakAreas = Object.entries(categoryStats)
            .filter(([cat, data]) => data.total > 0 && (data.correct / data.total) < 0.70)
            .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
            .slice(0, 5);
        
        // Add spacing before weak areas section
        yPos += 5;
        
        // Weak areas list (if any)
        if (weakAreas.length > 0) {
            yPos += 5;
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            
            weakAreas.forEach(([category, data], index) => {
                const score = Math.round((data.correct / data.total) * 100);
                
                // Highlight box for each weak area
                doc.setFillColor(255, 245, 245);
                doc.rect(margin, yPos - 2, pageWidth - 2 * margin, 10, 'F');
                
                doc.setTextColor(231, 76, 60);
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}.`, margin + 3, yPos + 4);
                
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'normal');
                doc.text(`${category}`, margin + 10, yPos + 4);
                
                doc.setTextColor(231, 76, 60);
                doc.text(`${score}%`, pageWidth - margin - 15, yPos + 4, { align: 'right' });
                
                doc.setTextColor(128, 128, 128);
                doc.setFontSize(7);
                doc.text('needs review', pageWidth - margin - 5, yPos + 4, { align: 'right' });
                
                doc.setTextColor(0, 0, 0);
                yPos += 12;
            });
            
            yPos += 8;
        }
        
        // Add spacing after weak areas
        yPos += 10;
        
        // ===== SPECIFIC STUDY RECOMMENDATIONS =====
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(155, 89, 182);
        doc.text('Recommended Study Actions:', margin, yPos);
        yPos += 10;
        
        // Generate specific recommendations based on performance
        const specificRecommendations = [];
        
        if (readinessScore >= 90) {
            specificRecommendations.push('Continue daily practice with full-length exams (30-45 minutes)');
            specificRecommendations.push('Review 10 scenario questions weekly for application skills');
            specificRecommendations.push('Take timed practice exams monthly to maintain readiness');
            specificRecommendations.push('Focus on maintaining high performance across all categories');
        } else if (readinessScore >= 80) {
            specificRecommendations.push('Focus 60% of study time on weaker categories identified above');
            specificRecommendations.push('Complete 3-4 practice quizzes per week in problem areas');
            specificRecommendations.push('Review 20-30 flashcards daily (15-20 minutes)');
            specificRecommendations.push('Complete all 500 scenario questions for application practice');
            specificRecommendations.push('Schedule 2-3 hour weekly review sessions for challenging topics');
        } else {
            specificRecommendations.push('Increase daily study time to 2-3 hours minimum');
            specificRecommendations.push('Complete all practice questions in weak areas first');
            specificRecommendations.push('Review 40-50 flashcards daily (30+ minutes)');
            specificRecommendations.push('Study core concepts before moving to advanced topics');
            specificRecommendations.push('Consider scheduling exam after reaching 85%+ readiness');
            specificRecommendations.push('Join study groups or find accountability partner');
        }
        
        // Add general best practices
        specificRecommendations.push('Use spaced repetition system for long-term retention');
        specificRecommendations.push('Practice active recall by teaching concepts to others');
        specificRecommendations.push('Take 10-minute breaks every 50 minutes during study sessions');
        specificRecommendations.push('Review all incorrect answers and understand why you missed them');
        
        // Display recommendations
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        specificRecommendations.forEach((rec, index) => {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }
            
            // Numbered list item
            doc.setTextColor(155, 89, 182);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}.`, margin, yPos);
            
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            
            // Wrap text if too long
            const maxWidth = pageWidth - margin - 15;
            const lines = doc.splitTextToSize(rec, maxWidth);
            doc.text(lines, margin + 10, yPos);
            
            yPos += (lines.length * 5) + 3;
        });
        
        // ===== FOOTER (on last page, at bottom) =====
        // Add spacing before footer
        yPos += 15;
        
        // If content is too close to bottom, ensure footer has space
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = pageHeight - 25;
        } else {
            yPos = pageHeight - 25;
        }
        
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('ABA Mastery - Professional Exam Preparation', pageWidth / 2, yPos, { align: 'center' });
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos + 5, { align: 'center' });
        
        // Save PDF
        const fileName = `ABA-Mastery-Progress-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        console.log('✅ PDF Report Generated Successfully!');
        
        // Show success message
        showNotification('✅ Progress report downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        alert('Error generating PDF report. Please try again.');
    }
}

// ============================================================================
// EXPORT STUDY DATA PDF
// ============================================================================

function generateStudyDataPDF() {
    try {
        console.log('📚 Generating Study Data PDF...');
        
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }
        
        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        let yPos = 20;
        
        // ===== HEADER =====
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('ABA MASTERY', pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Study Data Export', pageWidth / 2, 27, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 200);
        doc.text('Complete Study Materials & Content Overview', pageWidth / 2, 37, { align: 'center' });
        
        yPos = 55;
        doc.setTextColor(0, 0, 0);
        
        // ===== CONTENT OVERVIEW =====
        doc.setFillColor(52, 152, 219);
        doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Content Overview', pageWidth / 2, yPos + 8, { align: 'center' });
        yPos += 28;
        doc.setTextColor(0, 0, 0);
        
        // Content statistics
        const content = appData.content;
        const stats = [
            `📚 Study Topics: ${content?.studyTopics?.length || 0}`,
            `❓ Practice Questions: ${content?.practiceQuestions?.length || 0}`,
            `🎴 Flashcards: ${content?.flashcards?.length || 0}`,
            `🎭 Scenario Questions: ${content?.scenarioQuestions?.length || 0}`,
            `📖 Case Studies: ${content?.caseStudies?.length || 0}`,
            `📋 Total Content Items: ${(content?.studyTopics?.length || 0) + (content?.practiceQuestions?.length || 0) + (content?.flashcards?.length || 0) + (content?.scenarioQuestions?.length || 0) + (content?.caseStudies?.length || 0)}`
        ];
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Available Study Materials:', margin, yPos);
        yPos += 10;
        
        doc.setFont('helvetica', 'normal');
        stats.forEach(stat => {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(stat, margin + 10, yPos);
            yPos += 7;
        });
        
        yPos += 10;
        
        // ===== STUDY TOPICS =====
        if (content?.studyTopics?.length > 0) {
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFillColor(155, 89, 182);
            doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 20, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Study Topics', pageWidth / 2, yPos + 8, { align: 'center' });
            yPos += 28;
            doc.setTextColor(0, 0, 0);
            
            // Group topics by category
            const topicsByCategory = {};
            content.studyTopics.forEach(topic => {
                const category = topic.category || 'General';
                if (!topicsByCategory[category]) {
                    topicsByCategory[category] = [];
                }
                topicsByCategory[category].push(topic);
            });
            
            Object.entries(topicsByCategory).forEach(([category, topics]) => {
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(155, 89, 182);
                doc.text(`${category} (${topics.length} topics):`, margin, yPos);
                yPos += 8;
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
                
                topics.forEach(topic => {
                    if (yPos > pageHeight - 20) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(`• ${topic.title}`, margin + 10, yPos);
                    yPos += 6;
                });
                
                yPos += 5;
            });
        }
        
        // ===== SCENARIO QUESTIONS =====
        if (content?.scenarioQuestions?.length > 0) {
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFillColor(46, 204, 113);
            doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 20, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Scenario Questions', pageWidth / 2, yPos + 8, { align: 'center' });
            yPos += 28;
            doc.setTextColor(0, 0, 0);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Total Scenarios Available: ${content.scenarioQuestions.length}`, margin, yPos);
            yPos += 8;
            
            doc.text('These scenarios cover real-world clinical situations that BCBAs encounter:', margin, yPos);
            yPos += 10;
            
            // Show first few scenarios as examples
            const sampleScenarios = content.scenarioQuestions.slice(0, 3);
            sampleScenarios.forEach((scenario, index) => {
                if (yPos > pageHeight - 60) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text(`Scenario ${index + 1}:`, margin, yPos);
                yPos += 6;
                
                doc.setFont('helvetica', 'normal');
                const scenarioText = scenario.scenario.substring(0, 150) + '...';
                doc.text(scenarioText, margin + 10, yPos);
                yPos += 15;
            });
            
            if (content.scenarioQuestions.length > 3) {
                doc.text(`... and ${content.scenarioQuestions.length - 3} more scenarios`, margin + 10, yPos);
                yPos += 8;
            }
        }
        
        // ===== CASE STUDIES =====
        if (content?.caseStudies?.length > 0) {
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFillColor(241, 196, 15);
            doc.rect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 20, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Published Case Studies', pageWidth / 2, yPos + 8, { align: 'center' });
            yPos += 28;
            doc.setTextColor(0, 0, 0);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Total Case Studies: ${content.caseStudies.length}`, margin, yPos);
            yPos += 8;
            
            doc.text('Real published research studies from peer-reviewed journals:', margin, yPos);
            yPos += 10;
            
            // Show case study titles
            content.caseStudies.forEach((study, index) => {
                if (yPos > pageHeight - 20) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(9);
                doc.text(`${index + 1}. ${study.title}`, margin, yPos);
                yPos += 6;
                
                if (study.authors) {
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    doc.text(`Authors: ${study.authors}`, margin + 10, yPos);
                    yPos += 5;
                    doc.setTextColor(0, 0, 0);
                }
            });
        }
        
        // ===== FOOTER =====
        yPos += 15;
        
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = pageHeight - 25;
        } else {
            yPos = pageHeight - 25;
        }
        
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('ABA Mastery - Study Data Export', pageWidth / 2, yPos, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos + 5, { align: 'center' });
        
        // Save PDF
        const fileName = `ABA-Mastery-Study-Data-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        console.log('✅ Study Data PDF Generated Successfully!');
        
        // Show success message
        showNotification('✅ Study data exported successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error generating Study Data PDF:', error);
        alert('Error generating Study Data PDF. Please try again.');
    }
}

// Calculate category statistics for PDF report
function calculateOverallStats() {
    const userData = appData.userData || {};
    let totalAnswered = 0;
    let totalCorrect = 0;
    
    // Count practice questions
    if (userData.practiceAnswers) {
        totalAnswered += Object.keys(userData.practiceAnswers).length;
        Object.entries(userData.practiceAnswers).forEach(([questionId, answer]) => {
            const question = appData.content.practiceQuestions?.find(q => q.id === questionId);
            if (question && answer.userAnswer === question.correctAnswer) {
                totalCorrect++;
            }
        });
    }
    
    // Count scenario questions
    if (userData.scenarioAnswers) {
        totalAnswered += Object.keys(userData.scenarioAnswers).length;
        Object.entries(userData.scenarioAnswers).forEach(([questionId, answer]) => {
            const question = appData.content.scenarioQuestions?.find(q => q.id === questionId);
            if (question && answer.userAnswer === question.correctAnswer) {
                totalCorrect++;
            }
        });
    }
    
    const averageScore = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    return {
        totalAnswered,
        totalCorrect,
        averageScore
    };
}

function calculateCategoryStats() {
    const userData = appData.userData || {};
    const categoryStats = {};
    
    // Analyze practice questions
    if (userData.practiceAnswers) {
        Object.entries(userData.practiceAnswers).forEach(([questionId, answer]) => {
            const question = appData.content.practiceQuestions?.find(q => q.id === questionId);
            if (question) {
                const category = question.category || 'General';
                if (!categoryStats[category]) {
                    categoryStats[category] = { correct: 0, total: 0 };
                }
                categoryStats[category].total++;
                if (answer.userAnswer === question.correctAnswer) {
                    categoryStats[category].correct++;
                }
            }
        });
    }
    
    // Add default categories if no data
    if (Object.keys(categoryStats).length === 0) {
        ['Concepts & Principles', 'Measurement', 'Assessment', 'Intervention', 
         'Ethics', 'Supervision', 'Research Methods'].forEach(cat => {
            categoryStats[cat] = { correct: 0, total: 0 };
        });
    }
    
    return categoryStats;
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error message
function showError(message) {
    // Create a dismissible notification instead of alert
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('error-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'error-notification-styles';
        style.textContent = `
            .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fee;
                border: 2px solid #f44;
                border-radius: 8px;
                padding: 16px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            .error-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .error-icon {
                font-size: 24px;
            }
            .error-message {
                flex: 1;
                color: #c00;
                font-weight: 500;
            }
            .error-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #c00;
                padding: 0;
                width: 24px;
                height: 24px;
                line-height: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
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
        navigator.serviceWorker.register('/sw.js?v=1.4.0')
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

