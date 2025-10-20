// Features Integration - Connects AI Coach, Adaptive Learning, and Gamification
// A product of Bradley Virtual Solutions, LLC

// Initialize all wow features
function initializeWowFeatures() {
    updateAICoachDashboard();
    updateGamificationDashboard();
    setupAdaptiveLearning();
    
    // Update dashboards periodically
    setInterval(() => {
        updateAICoachDashboard();
        updateGamificationDashboard();
    }, 30000); // Every 30 seconds
}

// Update AI Study Coach Dashboard
function updateAICoachDashboard() {
    if (typeof aiStudyCoach === 'undefined') return;
    
    const analysis = aiStudyCoach.calculateExamReadiness();
    
    // Update readiness score
    const scoreEl = document.getElementById('readiness-score');
    if (scoreEl) {
        scoreEl.textContent = analysis.readinessScore + '%';
        scoreEl.style.color = getReadinessColor(analysis.readinessScore);
    }
    
    // Update progress bar
    const progressEl = document.getElementById('readiness-progress');
    if (progressEl) {
        progressEl.style.width = analysis.readinessScore + '%';
        progressEl.style.background = getReadinessGradient(analysis.readinessScore);
    }
    
    // Update stats
    if (document.getElementById('pass-prob')) {
        document.getElementById('pass-prob').textContent = analysis.passProb + '%';
    }
    if (document.getElementById('ready-date')) {
        document.getElementById('ready-date').textContent = analysis.predictedDate || '--';
    }
    if (document.getElementById('study-needed')) {
        document.getElementById('study-needed').textContent = analysis.studyTimeNeeded || '--';
    }
    
    // Update recommendations
    const recommendationsEl = document.getElementById('ai-recommendations');
    if (recommendationsEl && analysis.recommendations) {
        recommendationsEl.innerHTML = analysis.recommendations.map(rec => `
            <div class="recommendation-item ${rec.priority}-priority">
                <span class="rec-icon">${rec.icon}</span>
                <div class="rec-content">
                    <div class="rec-title">${rec.title}</div>
                    <div class="rec-description">${rec.description}</div>
                </div>
            </div>
        `).join('');
    }
}

// Get readiness color
function getReadinessColor(score) {
    if (score >= 90) return '#10b981'; // green
    if (score >= 80) return '#22c55e'; // light green
    if (score >= 70) return '#eab308'; // yellow
    if (score >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
}

// Get readiness gradient
function getReadinessGradient(score) {
    if (score >= 85) return 'linear-gradient(90deg, #10b981, #22c55e)';
    if (score >= 70) return 'linear-gradient(90deg, #22c55e, #eab308)';
    if (score >= 50) return 'linear-gradient(90deg, #eab308, #f59e0b)';
    return 'linear-gradient(90deg, #f59e0b, #ef4444)';
}

// Update Gamification Dashboard
function updateGamificationDashboard() {
    if (typeof gamification === 'undefined') return;
    
    const dashboard = gamification.getDashboardData();
    
    // Update level
    if (document.getElementById('user-level')) {
        document.getElementById('user-level').textContent = dashboard.level;
    }
    if (document.getElementById('level-title')) {
        document.getElementById('level-title').textContent = dashboard.levelInfo.title;
    }
    if (document.getElementById('level-icon')) {
        document.getElementById('level-icon').textContent = dashboard.levelInfo.icon;
    }
    
    // Update XP progress
    if (document.getElementById('xp-progress')) {
        document.getElementById('xp-progress').style.width = dashboard.levelInfo.progress + '%';
    }
    if (document.getElementById('current-xp')) {
        const currentXP = dashboard.totalXP - dashboard.levelInfo.xpNeeded;
        document.getElementById('current-xp').textContent = currentXP;
    }
    if (document.getElementById('next-level-xp')) {
        const nextLevelXP = dashboard.levelInfo.isMaxLevel ? dashboard.totalXP : (dashboard.levelInfo.xpToNext + (dashboard.totalXP - dashboard.levelInfo.xpNeeded));
        document.getElementById('next-level-xp').textContent = nextLevelXP;
    }
    
    // Update streak
    if (document.getElementById('streak-number')) {
        document.getElementById('streak-number').textContent = dashboard.streak;
    }
    if (document.getElementById('streak-message')) {
        const message = dashboard.streak > 0 
            ? `Keep it up! Study today to maintain your streak!`
            : 'Start studying to build your streak!';
        document.getElementById('streak-message').textContent = message;
    }
    
    // Update achievements
    if (document.getElementById('achievements-unlocked')) {
        document.getElementById('achievements-unlocked').textContent = dashboard.achievements.unlocked;
    }
    if (document.getElementById('achievements-total')) {
        document.getElementById('achievements-total').textContent = dashboard.achievements.total;
    }
}

// Setup Adaptive Learning
function setupAdaptiveLearning() {
    if (typeof adaptiveLearning === 'undefined') return;
    
    const state = adaptiveLearning.getAdaptiveState();
    updateAdaptiveBanner(state);
}

// Update Adaptive Learning Banner
function updateAdaptiveBanner(state) {
    const banner = document.getElementById('adaptive-banner');
    if (!banner) return;
    
    // Show banner during quizzes
    if (document.getElementById('practice-quiz')?.style.display !== 'none') {
        banner.style.display = 'block';
    }
    
    if (document.getElementById('adaptive-message')) {
        document.getElementById('adaptive-message').textContent = state.message;
    }
    if (document.getElementById('adaptive-difficulty')) {
        document.getElementById('adaptive-difficulty').textContent = state.currentDifficulty.label;
    }
    if (document.getElementById('adaptive-stars')) {
        document.getElementById('adaptive-stars').textContent = state.currentDifficulty.stars;
    }
}

// Integrate with quiz system
function integrateWithQuiz() {
    // Hook into answer submission
    const originalSubmitAnswer = window.submitAnswer;
    if (originalSubmitAnswer) {
        window.submitAnswer = function() {
            const result = originalSubmitAnswer.apply(this, arguments);
            
            // Record for adaptive learning and gamification
            if (typeof adaptiveLearning !== 'undefined' && appData.quizState) {
                const currentQ = appData.quizState.currentQuestion;
                const state = appData.quizState;
                const isCorrect = state.answers[currentQ] === state.questions[currentQ].correctAnswer;
                const difficulty = state.questions[currentQ].difficulty || 'intermediate';
                
                adaptiveLearning.recordAnswer(isCorrect, difficulty);
                updateAdaptiveBanner(adaptiveLearning.getAdaptiveState());
                
                // Award XP
                if (typeof gamification !== 'undefined') {
                    gamification.recordAnswer(isCorrect);
                }
            }
            
            return result;
        };
    }
    
    // Hook into quiz completion
    const originalFinishExam = window.finishPracticeExam;
    if (originalFinishExam) {
        window.finishPracticeExam = function() {
            const result = originalFinishExam.apply(this, arguments);
            
            // Record quiz completion for gamification
            if (typeof gamification !== 'undefined' && appData.quizState) {
                const state = appData.quizState;
                const correct = state.answers.filter((ans, idx) => ans === state.questions[idx].correctAnswer).length;
                const total = state.questions.length;
                const time = Math.round((Date.now() - state.startTime) / 1000);
                
                gamification.recordQuizCompletion(correct, total, time);
                
                // Update dashboards
                updateAICoachDashboard();
                updateGamificationDashboard();
            }
            
            return result;
        };
    }
}

// Show achievements modal
function showAchievements() {
    const modal = document.getElementById('achievements-modal');
    if (!modal || typeof gamification === 'undefined') return;
    
    const dashboard = gamification.getDashboardData();
    const achievements = dashboard.achievements.list;
    
    // Update summary
    if (document.getElementById('modal-achievements-unlocked')) {
        document.getElementById('modal-achievements-unlocked').textContent = dashboard.achievements.unlocked;
    }
    if (document.getElementById('modal-achievements-total')) {
        document.getElementById('modal-achievements-total').textContent = dashboard.achievements.total;
    }
    
    // Calculate total XP from achievements
    const totalAchievementXP = achievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.xp, 0);
    
    if (document.getElementById('modal-achievements-xp')) {
        document.getElementById('modal-achievements-xp').textContent = totalAchievementXP;
    }
    
    // Render achievements list
    const listEl = document.getElementById('achievements-list');
    if (listEl) {
        listEl.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-xp">+${achievement.xp} XP</div>
                </div>
                ${achievement.unlocked ? '<div class="achievement-badge">✓</div>' : '<div class="achievement-badge locked-badge">🔒</div>'}
            </div>
        `).join('');
    }
    
    modal.style.display = 'flex';
}

// Close achievements modal
function closeAchievementsModal(event) {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;
    
    // Close if clicking overlay or close button
    if (!event || event.target === modal || event.target.classList.contains('modal-close')) {
        modal.style.display = 'none';
    }
}

// Apply adaptive learning to question selection
function applyAdaptiveFiltering(questions) {
    if (typeof adaptiveLearning === 'undefined') return questions;
    
    // Only apply if adaptive mode is enabled
    const adaptiveEnabled = localStorage.getItem('adaptiveLearningEnabled') !== 'false';
    if (!adaptiveEnabled) return questions;
    
    return adaptiveLearning.filterQuestionsByDifficulty(questions);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initializeWowFeatures();
            integrateWithQuiz();
        }, 1000); // Delay to ensure other scripts are loaded
    });
} else {
    setTimeout(() => {
        initializeWowFeatures();
        integrateWithQuiz();
    }, 1000);
}

// Export functions
if (typeof window !== 'undefined') {
    window.showAchievements = showAchievements;
    window.closeAchievementsModal = closeAchievementsModal;
    window.updateAICoachDashboard = updateAICoachDashboard;
    window.updateGamificationDashboard = updateGamificationDashboard;
    window.applyAdaptiveFiltering = applyAdaptiveFiltering;
}

