// Enhanced Integration Module for ABA Mastery
// Connects analytics engine with main app functionality

// Initialize enhanced features
function initializeEnhancedFeatures() {
    console.log('🚀 Initializing enhanced exam prep features...');
    
    // Update study streak
    analyticsEngine.updateStudyStreak();
    
    // Load enhanced dashboard
    updateEnhancedDashboard();
    
    // Add bookmark and note functionality to questions (if function exists)
    if (typeof enhanceQuestionUI === 'function') {
        enhanceQuestionUI();
    }
    
    // Set up enhanced progress tracking
    if (typeof setupEnhancedTracking === 'function') {
        setupEnhancedTracking();
    }
    
    console.log('✅ Enhanced features initialized');
}

// Update the enhanced dashboard with latest data
function updateEnhancedDashboard() {
    const stats = analyticsEngine.getComprehensiveStats();
    
    // Update exam readiness
    const readinessScore = document.getElementById('readiness-score');
    const readinessStatus = document.getElementById('readiness-status');
    
    if (readinessScore) {
        readinessScore.textContent = stats.examReadiness + '%';
        
        if (stats.examReadiness >= 90) {
            readinessStatus.textContent = 'Exam Ready! 🎉';
            readinessStatus.style.background = 'rgba(16, 185, 129, 0.3)';
        } else if (stats.examReadiness >= 70) {
            readinessStatus.textContent = 'Almost Ready 💪';
            readinessStatus.style.background = 'rgba(245, 158, 11, 0.3)';
        } else if (stats.examReadiness >= 50) {
            readinessStatus.textContent = 'Keep Practicing 📚';
            readinessStatus.style.background = 'rgba(37, 99, 235, 0.3)';
        } else {
            readinessStatus.textContent = 'Building Foundation 🌱';
            readinessStatus.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }
    
    // Update study streak
    if (stats.studyStreak >= 3) {
        const streakBadge = document.getElementById('study-streak-badge');
        const streakCount = document.getElementById('streak-count');
        if (streakBadge && streakCount) {
            streakBadge.style.display = 'block';
            streakCount.textContent = stats.studyStreak;
        }
    }
    
    // Update enhanced stats
    updateElement('total-attempts', stats.totalAttempts);
    updateElement('mastered-count', stats.masteredQuestions);
    updateElement('overall-accuracy-enhanced', stats.overallAccuracy + '%');
    updateElement('categories-mastered', stats.masteredCategoriesCount);
    updateElement('bookmark-count', stats.bookmarkedCount);
    
    // Update recommendations
    updateRecommendations();
    
    // Update weak areas
    updateWeakAreas();
    
    // Update mastered topics
    updateMasteredTopics();
    
    // Update bookmarks
    updateBookmarksDisplay();
}

// Update recommendations section
function updateRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    const recommendations = analyticsEngine.getStudyRecommendations();
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Complete some practice questions to get personalized recommendations.</p>';
        return;
    }
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card ${rec.type}">
            <div class="recommendation-header">
                <div class="recommendation-title">${rec.title}</div>
            </div>
            <div class="recommendation-message">${rec.message}</div>
            ${rec.action ? `<a href="#" class="recommendation-action" onclick="handleRecommendationAction('${rec.action}', '${rec.category || ''}')">${rec.actionLabel}</a>` : ''}
        </div>
    `).join('');
}

// Handle recommendation actions
function handleRecommendationAction(action, category) {
    event.preventDefault();
    
    switch (action) {
        case 'practice':
            switchView('practice');
            break;
        case 'weak-areas':
            startWeakAreaPractice();
            break;
        case 'full-exam':
            startFullExam();
            break;
        case 'category-practice':
            startCategoryPractice(category);
            break;
    }
}

// Start weak area focused practice
function startWeakAreaPractice() {
    const weakAreas = analyticsEngine.performanceData.recommendedFocus;
    
    if (weakAreas.length === 0) {
        alert('Great! You don\'t have any weak areas. Try a full practice exam.');
        return;
    }
    
    // Filter questions from weak areas
    let questions = appData.content.practiceQuestions.filter(q => 
        weakAreas.includes(q.category)
    );
    
    questions = shuffle(questions).slice(0, 30);
    
    if (questions.length === 0) {
        alert('No questions available for weak areas.');
        return;
    }
    
    appData.quizState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        correctCount: 0,
        startTime: Date.now(),
        examMode: 'weak-areas',
        examDuration: null,
        isFullExam: false
    };
    
    switchView('practice');
    document.getElementById('practice-setup').style.display = 'none';
    document.getElementById('practice-quiz').style.display = 'block';
    displayQuestion();
}

// Start category-specific practice
function startCategoryPractice(category) {
    let questions = appData.content.practiceQuestions.filter(q => 
        q.category === category
    );
    
    questions = shuffle(questions).slice(0, 20);
    
    if (questions.length === 0) {
        alert('No questions available for this category.');
        return;
    }
    
    appData.quizState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        correctCount: 0,
        startTime: Date.now(),
        examMode: 'category',
        category: category,
        examDuration: null,
        isFullExam: false
    };
    
    switchView('practice');
    document.getElementById('practice-setup').style.display = 'none';
    document.getElementById('practice-quiz').style.display = 'block';
    displayQuestion();
}

// Start full exam
function startFullExam() {
    document.getElementById('exam-mode').value = 'bcba';
    startPracticeExam();
}

// Update weak areas display
function updateWeakAreas() {
    const container = document.getElementById('weak-areas-container');
    if (!container) return;
    
    const weakAreas = analyticsEngine.performanceData.weakAreas
        .filter(w => w.needsWork)
        .slice(0, 5);
    
    if (weakAreas.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">🎉 No weak areas! You\'re doing great!</p>';
        return;
    }
    
    container.innerHTML = weakAreas.map(area => {
        const accuracyClass = area.accuracy >= 70 ? 'accuracy-high' : 
                             area.accuracy >= 50 ? 'accuracy-medium' : 'accuracy-low';
        
        return `
            <div class="weak-area-card">
                <div class="weak-area-header">
                    <div class="weak-area-name">${getCategoryName(area.category)}</div>
                    <div class="weak-area-accuracy ${accuracyClass}">${Math.round(area.accuracy)}%</div>
                </div>
                <div class="progress-bar-enhanced">
                    <div class="progress-fill-enhanced" style="width: ${area.accuracy}%"></div>
                </div>
                <div class="weak-area-stats">
                    <span>📝 ${area.questionsAnswered} answered</span>
                    <span>🎯 Target: 80%+</span>
                </div>
                <button class="btn btn-small btn-primary" onclick="startCategoryPractice('${area.category}')" style="margin-top: 12px;">
                    Practice Now
                </button>
            </div>
        `;
    }).join('');
}

// Update mastered topics display
function updateMasteredTopics() {
    const section = document.getElementById('mastered-section');
    const container = document.getElementById('mastered-topics-container');
    
    if (!section || !container) return;
    
    const masteredCategories = analyticsEngine.performanceData.masteredCategories;
    
    if (masteredCategories.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    container.innerHTML = masteredCategories.map(cat => 
        `<div class="mastered-badge">✓ ${getCategoryName(cat)}</div>`
    ).join('');
}

// Update bookmarks display
function updateBookmarksDisplay() {
    const container = document.getElementById('bookmarks-container');
    if (!container) return;
    
    const bookmarkedIds = analyticsEngine.performanceData.bookmarkedQuestions;
    
    if (bookmarkedIds.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 14px;">No bookmarked questions yet. Bookmark questions during practice to review them later.</p>';
        return;
    }
    
    const bookmarkedQuestions = bookmarkedIds
        .map(id => appData.content.practiceQuestions.find(q => q.id === id))
        .filter(q => q !== undefined)
        .slice(0, 10);
    
    container.innerHTML = bookmarkedQuestions.map(q => `
        <div class="bookmark-item">
            <div class="bookmark-question-text">${q.question.substring(0, 100)}...</div>
            <div class="bookmark-actions">
                <button class="btn-small btn-review" onclick="reviewBookmarkedQuestion('${q.id}')">Review</button>
                <button class="btn-small btn-unbookmark" onclick="removeBookmark('${q.id}')">Remove</button>
            </div>
        </div>
    `).join('');
}

// Enhanced question tracking - Override submitAnswer
const originalSubmitAnswer = submitAnswer;
submitAnswer = function() {
    const state = appData.quizState;
    const question = state.questions[state.currentIndex];
    const startTime = state.questionStartTime || Date.now();
    const timeSpent = (Date.now() - startTime) / 1000; // seconds
    
    // Call original function
    originalSubmitAnswer();
    
    // Track with analytics engine
    const isCorrect = state.selectedAnswer === question.correctAnswer;
    analyticsEngine.recordQuestionAttempt(
        question.id,
        question.category,
        isCorrect,
        timeSpent,
        question.difficulty
    );
    
    // Update dashboard
    updateEnhancedDashboard();
};

// Track question display time
const originalDisplayQuestion = displayQuestion;
displayQuestion = function() {
    originalDisplayQuestion();
    
    // Mark start time for this question
    if (appData.quizState) {
        appData.quizState.questionStartTime = Date.now();
    }
    
    // Add bookmark button if not exists
    addBookmarkButton();
};

// Add bookmark functionality to questions
function addBookmarkButton() {
    const container = document.getElementById('answers-container');
    if (!container) return;
    
    const question = appData.quizState.questions[appData.quizState.currentIndex];
    const isBookmarked = analyticsEngine.isBookmarked(question.id);
    
    // Remove existing bookmark button
    const existingBtn = document.getElementById('bookmark-question-btn');
    if (existingBtn) existingBtn.remove();
    
    // Add bookmark button
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.id = 'bookmark-question-btn';
    bookmarkBtn.className = 'btn btn-secondary';
    bookmarkBtn.style.marginTop = '12px';
    bookmarkBtn.innerHTML = isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark';
    bookmarkBtn.onclick = () => toggleBookmark(question.id);
    
    container.parentNode.insertBefore(bookmarkBtn, container.nextSibling);
}

// Toggle bookmark
function toggleBookmark(questionId) {
    if (analyticsEngine.isBookmarked(questionId)) {
        analyticsEngine.unbookmarkQuestion(questionId);
    } else {
        analyticsEngine.bookmarkQuestion(questionId);
    }
    
    addBookmarkButton(); // Refresh button
    updateEnhancedDashboard();
}

// Review bookmarked question
function reviewBookmarkedQuestion(questionId) {
    const question = appData.content.practiceQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Start single question quiz
    appData.quizState = {
        questions: [question],
        currentIndex: 0,
        answers: [null],
        correctCount: 0,
        startTime: Date.now(),
        examMode: 'review',
        examDuration: null,
        isFullExam: false
    };
    
    switchView('practice');
    document.getElementById('practice-setup').style.display = 'none';
    document.getElementById('practice-quiz').style.display = 'block';
    displayQuestion();
}

// Remove bookmark
function removeBookmark(questionId) {
    analyticsEngine.unbookmarkQuestion(questionId);
    updateEnhancedDashboard();
}

// Get category name by ID
function getCategoryName(categoryId) {
    const category = appData.content?.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// Helper to update element text
function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Set exam date and generate study plan
function setExamDate() {
    const examDateStr = prompt('Enter your exam date (YYYY-MM-DD):');
    if (!examDateStr) return;
    
    const examDate = new Date(examDateStr);
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExam <= 0) {
        alert('Please enter a future date.');
        return;
    }
    
    // Save exam date
    localStorage.setItem('examDate', examDateStr);
    
    // Generate study plan
    const studyPlan = analyticsEngine.generateStudyPlan(daysUntilExam);
    displayStudyPlan(studyPlan);
}

// Display generated study plan
function displayStudyPlan(plan) {
    const daysRemaining = document.getElementById('days-remaining');
    const content = document.getElementById('study-plan-content');
    
    if (!daysRemaining || !content) return;
    
    daysRemaining.textContent = `${plan.totalDays} days until exam`;
    
    content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">
                Daily goal: <strong>${plan.dailyGoal} questions</strong>
            </p>
            <p style="font-size: 14px; color: var(--text-secondary);">
                Current focus areas: ${plan.focusAreas.map(f => getCategoryName(f)).join(', ') || 'Complete more practice for recommendations'}
            </p>
        </div>
        <div class="weekly-schedule">
            ${plan.weeklySchedule.map(week => `
                <div class="week-card">
                    <div class="week-header">Week ${week.week} - ${week.focus.map(f => getCategoryName(f)).join(', ')}</div>
                    <ul class="week-goals">
                        ${week.goals.map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
}

// Enhance quiz finish to show detailed breakdown
const enhancedOriginalFinishQuiz = finishQuiz;
finishQuiz = function() {
    enhancedOriginalFinishQuiz();
    
    // Add detailed performance breakdown
    const resultsDiv = document.getElementById('practice-results');
    if (!resultsDiv) return;
    
    const stats = analyticsEngine.getComprehensiveStats();
    const recommendations = analyticsEngine.getStudyRecommendations();
    
    const detailsHTML = `
        <div style="margin-top: 24px; padding: 20px; background: var(--bg-secondary); border-radius: 12px;">
            <h3 style="margin-bottom: 16px;">📊 Your Progress</h3>
            <div class="stats-grid-enhanced">
                <div style="text-align: center; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${stats.examReadiness}%</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Exam Readiness</div>
                </div>
                <div style="text-align: center; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${stats.overallAccuracy}%</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Overall Accuracy</div>
                </div>
                <div style="text-align: center; padding: 12px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${stats.masteredQuestions}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Questions Mastered</div>
                </div>
            </div>
            ${recommendations.length > 0 ? `
                <div style="margin-top: 16px;">
                    <h4 style="margin-bottom: 8px; font-size: 14px;">Next Steps:</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: var(--text-secondary);">
                        ${recommendations.slice(0, 2).map(r => `<li>${r.message}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    resultsDiv.insertAdjacentHTML('beforeend', detailsHTML);
};

// Initialize on page load
if (typeof analyticsEngine !== 'undefined') {
    setTimeout(initializeEnhancedFeatures, 1000);
}

