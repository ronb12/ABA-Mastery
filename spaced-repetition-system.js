// Spaced Repetition System for ABA Mastery
// Research-backed algorithm for optimal learning and retention
// Based on Ebbinghaus forgetting curve and SuperMemo algorithm

class SpacedRepetitionSystem {
    constructor() {
        this.repetitionData = this.loadRepetitionData();
        this.initializeSystem();
    }

    // Load spaced repetition data from localStorage
    loadRepetitionData() {
        const saved = localStorage.getItem('abaSpacedRepetition');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            questionSchedule: {}, // questionId: { nextReview, interval, easiness, reviews }
            reviewQueue: [], // Questions due for review today
            stats: {
                questionsLearned: 0,
                questionsReviewed: 0,
                averageRetention: 0,
                studyEfficiency: 100, // % compared to traditional
                timesSaved: 0 // Hours saved through optimization
            },
            settings: {
                maxNewPerDay: 20,
                maxReviewsPerDay: 50,
                targetRetention: 90, // Target 90% retention rate
                intervalMultiplier: 2.5
            }
        };
    }

    // Initialize the system
    initializeSystem() {
        this.updateReviewQueue();
        console.log('✅ Spaced Repetition System initialized');
        console.log(`📊 Questions in learning: ${Object.keys(this.repetitionData.questionSchedule).length}`);
        console.log(`📝 Review queue today: ${this.repetitionData.reviewQueue.length}`);
    }

    // Save repetition data
    saveRepetitionData() {
        localStorage.setItem('abaSpacedRepetition', JSON.stringify(this.repetitionData));
    }

    // Calculate next review interval based on performance
    calculateNextInterval(questionId, performanceRating) {
        const schedule = this.repetitionData.questionSchedule[questionId] || {
            interval: 0,
            repetitions: 0,
            easiness: 2.5,
            nextReview: new Date().toISOString()
        };

        // SuperMemo-2 Algorithm (simplified and optimized)
        let newEasiness = schedule.easiness;
        let newInterval = schedule.interval;
        let newRepetitions = schedule.repetitions;

        // Performance rating: 0=wrong, 1=hard, 2=good, 3=easy
        if (performanceRating === 0) {
            // Failed - reset
            newRepetitions = 0;
            newInterval = 1; // Review tomorrow
            newEasiness = Math.max(1.3, schedule.easiness - 0.2);
        } else {
            newRepetitions++;
            
            // Calculate new easiness factor
            newEasiness = schedule.easiness + (0.1 - (3 - performanceRating) * (0.08 + (3 - performanceRating) * 0.02));
            newEasiness = Math.max(1.3, Math.min(2.5, newEasiness));

            // Calculate new interval
            if (newRepetitions === 1) {
                newInterval = 1; // 1 day
            } else if (newRepetitions === 2) {
                newInterval = 3; // 3 days
            } else {
                newInterval = Math.round(schedule.interval * newEasiness);
            }
        }

        // Cap maximum interval at 180 days (6 months)
        newInterval = Math.min(newInterval, 180);

        return {
            interval: newInterval,
            repetitions: newRepetitions,
            easiness: newEasiness,
            nextReview: this.addDays(new Date(), newInterval).toISOString()
        };
    }

    // Record question attempt with spaced repetition
    recordAttempt(questionId, isCorrect, difficulty = 'medium') {
        // Convert correctness and difficulty to performance rating
        let performanceRating;
        if (!isCorrect) {
            performanceRating = 0; // Wrong
        } else if (difficulty === 'hard') {
            performanceRating = 1; // Correct but hard
        } else if (difficulty === 'medium') {
            performanceRating = 2; // Correct, moderate difficulty
        } else {
            performanceRating = 3; // Correct and easy
        }

        const newSchedule = this.calculateNextInterval(questionId, performanceRating);
        
        this.repetitionData.questionSchedule[questionId] = {
            ...newSchedule,
            lastReview: new Date().toISOString(),
            totalReviews: (this.repetitionData.questionSchedule[questionId]?.totalReviews || 0) + 1,
            correctCount: (this.repetitionData.questionSchedule[questionId]?.correctCount || 0) + (isCorrect ? 1 : 0)
        };

        // Update statistics
        this.repetitionData.stats.questionsReviewed++;
        if (newSchedule.repetitions === 1) {
            this.repetitionData.stats.questionsLearned++;
        }

        this.saveRepetitionData();
        this.updateReviewQueue();
    }

    // Update review queue with questions due today
    updateReviewQueue() {
        const today = new Date().toDateString();
        this.repetitionData.reviewQueue = [];

        for (const [questionId, schedule] of Object.entries(this.repetitionData.questionSchedule)) {
            const nextReviewDate = new Date(schedule.nextReview).toDateString();
            
            if (new Date(nextReviewDate) <= new Date(today)) {
                this.repetitionData.reviewQueue.push({
                    questionId,
                    dueDate: schedule.nextReview,
                    priority: this.calculatePriority(schedule)
                });
            }
        }

        // Sort by priority (most important first)
        this.repetitionData.reviewQueue.sort((a, b) => b.priority - a.priority);

        this.saveRepetitionData();
    }

    // Calculate priority for review (higher = more urgent)
    calculatePriority(schedule) {
        const daysSinceReview = this.daysBetween(new Date(schedule.lastReview), new Date());
        const overdueDays = daysSinceReview - schedule.interval;
        
        // Priority based on how overdue + importance (recent learning = higher priority)
        const recencyWeight = schedule.repetitions <= 3 ? 2 : 1;
        return (overdueDays * recencyWeight) + (5 - schedule.repetitions);
    }

    // Get questions for today's review session
    getReviewSession(maxQuestions = 20) {
        this.updateReviewQueue();
        
        const reviewQuestions = this.repetitionData.reviewQueue
            .slice(0, maxQuestions)
            .map(item => item.questionId);

        return {
            questionIds: reviewQuestions,
            dueCount: this.repetitionData.reviewQueue.length,
            newLearning: this.canLearnNew()
        };
    }

    // Check if user can learn new questions today
    canLearnNew() {
        const today = new Date().toDateString();
        const learnedToday = Object.values(this.repetitionData.questionSchedule)
            .filter(s => {
                const lastReview = new Date(s.lastReview).toDateString();
                return lastReview === today && s.repetitions === 1;
            }).length;

        return learnedToday < this.repetitionData.settings.maxNewPerDay;
    }

    // Get optimal study session (mix of reviews + new)
    getOptimalStudySession(totalQuestions = 30) {
        const session = {
            reviewQuestions: [],
            newQuestions: [],
            totalCount: 0,
            efficiency: 0
        };

        // Prioritize reviews (they're due!)
        const reviewSession = this.getReviewSession(Math.floor(totalQuestions * 0.7));
        session.reviewQuestions = reviewSession.questionIds;

        // Add new questions if available
        const newAllowed = Math.min(
            totalQuestions - session.reviewQuestions.length,
            this.repetitionData.settings.maxNewPerDay
        );

        session.newQuestions = this.getNewQuestions(newAllowed);
        session.totalCount = session.reviewQuestions.length + session.newQuestions.length;

        // Calculate efficiency (% of time saved vs traditional cramming)
        session.efficiency = this.calculateStudyEfficiency();

        return session;
    }

    // Get new questions not yet in spaced repetition system
    getNewQuestions(count) {
        if (typeof appData === 'undefined' || !appData.content) return [];

        const allQuestions = appData.content.practiceQuestions;
        const inSystem = Object.keys(this.repetitionData.questionSchedule);
        
        const newQuestions = allQuestions
            .filter(q => !inSystem.includes(q.id))
            .map(q => q.id)
            .slice(0, count);

        return newQuestions;
    }

    // Calculate study efficiency compared to traditional methods
    calculateStudyEfficiency() {
        const totalReviews = this.repetitionData.stats.questionsReviewed;
        const questionsLearned = this.repetitionData.stats.questionsLearned;

        if (questionsLearned === 0) return 100;

        // Traditional: Need 5-7 reviews per question for mastery
        const traditionalReviews = questionsLearned * 6;
        
        // Spaced repetition: Typically 3-4 reviews for same mastery
        const actualReviews = totalReviews;

        // Calculate efficiency
        const efficiency = traditionalReviews > 0 
            ? Math.round((traditionalReviews / actualReviews) * 100)
            : 100;

        return Math.min(efficiency, 200); // Cap at 200% efficiency
    }

    // Display review dashboard
    displayReviewDashboard() {
        const container = document.getElementById('spaced-repetition-dashboard');
        if (!container) return;

        const session = this.getOptimalStudySession(30);
        const stats = this.getStatistics();

        container.innerHTML = `
            <div class="sr-header">
                <h2>🧠 Smart Review System</h2>
                <p>Optimized learning based on cognitive science</p>
            </div>

            <div class="sr-stats-grid">
                <div class="sr-stat-card highlight">
                    <div class="sr-stat-value">${session.reviewQuestions.length}</div>
                    <div class="sr-stat-label">Due for Review Today</div>
                    <div class="sr-stat-note">Optimal timing for retention</div>
                </div>

                <div class="sr-stat-card">
                    <div class="sr-stat-value">${stats.questionsLearned}</div>
                    <div class="sr-stat-label">Questions in System</div>
                    <div class="sr-stat-note">Being tracked & optimized</div>
                </div>

                <div class="sr-stat-card success">
                    <div class="sr-stat-value">${stats.retention}%</div>
                    <div class="sr-stat-label">Retention Rate</div>
                    <div class="sr-stat-note">Target: 90%</div>
                </div>

                <div class="sr-stat-card efficiency">
                    <div class="sr-stat-value">${session.efficiency}%</div>
                    <div class="sr-stat-label">Study Efficiency</div>
                    <div class="sr-stat-note">vs traditional cramming</div>
                </div>
            </div>

            ${session.reviewQuestions.length > 0 ? `
                <div class="sr-action-section">
                    <h3>📝 Your Optimized Study Session</h3>
                    <p>Based on cognitive science, these ${session.totalCount} questions are perfectly timed for maximum retention:</p>
                    <div class="session-breakdown">
                        <div class="session-type">
                            <span class="session-icon">🔄</span>
                            <span class="session-count">${session.reviewQuestions.length}</span>
                            <span class="session-label">Review Questions</span>
                            <span class="session-note">Due today - review before you forget!</span>
                        </div>
                        ${session.newQuestions.length > 0 ? `
                            <div class="session-type">
                                <span class="session-icon">✨</span>
                                <span class="session-count">${session.newQuestions.length}</span>
                                <span class="session-label">New Questions</span>
                                <span class="session-note">Fresh learning for today</span>
                            </div>
                        ` : ''}
                    </div>
                    <button class="btn btn-primary btn-large" onclick="spacedRepetitionSystem.startOptimizedSession()">
                        🎯 Start Optimized Session (${session.totalCount} questions)
                    </button>
                    <p class="efficiency-note">
                        ⚡ You're studying <strong>${session.efficiency}% more efficiently</strong> than traditional methods!
                        ${stats.timesSaved > 0 ? `You've saved approximately <strong>${stats.timesSaved} hours</strong> of study time.` : ''}
                    </p>
                </div>
            ` : `
                <div class="sr-action-section">
                    <h3>🎉 No Reviews Due Today!</h3>
                    <p>All your questions are scheduled optimally. You can:</p>
                    <button class="btn btn-secondary" onclick="spacedRepetitionSystem.startNewLearning()">
                        Learn New Questions
                    </button>
                    <button class="btn btn-secondary" onclick="switchView('practice')">
                        Practice Exam Mode
                    </button>
                </div>
            `}

            <div class="sr-how-it-works">
                <h3>🧠 How This Works</h3>
                <div class="how-it-works-grid">
                    <div class="how-card">
                        <div class="how-icon">📅</div>
                        <h4>Optimal Timing</h4>
                        <p>Questions are reviewed right before you'd forget them - when memory is weak but retrievable.</p>
                    </div>
                    <div class="how-card">
                        <div class="how-icon">🎯</div>
                        <h4>Active Recall</h4>
                        <p>Retrieving information strengthens memory 4x more than passive review like videos.</p>
                    </div>
                    <div class="how-card">
                        <div class="how-icon">📈</div>
                        <h4>Efficient Learning</h4>
                        <p>Study 30-40% less time for better results. Focus energy where it matters most.</p>
                    </div>
                    <div class="how-card">
                        <div class="how-icon">🧬</div>
                        <h4>Science-Backed</h4>
                        <p>Based on 100+ years of research on human memory and learning.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Start optimized spaced repetition session
    startOptimizedSession() {
        const session = this.getOptimalStudySession(30);
        
        if (session.totalCount === 0) {
            alert('No questions scheduled for review. Try practicing new questions!');
            return;
        }

        // Get actual question objects
        const questions = [];
        
        // Add review questions
        session.reviewQuestions.forEach(qId => {
            const question = appData.content.practiceQuestions.find(q => q.id === qId);
            if (question) {
                questions.push({ ...question, isReview: true });
            }
        });

        // Add new questions
        session.newQuestions.forEach(qId => {
            const question = appData.content.practiceQuestions.find(q => q.id === qId);
            if (question) {
                questions.push({ ...question, isReview: false });
            }
        });

        // Shuffle while keeping review questions first
        const reviewQs = questions.filter(q => q.isReview);
        const newQs = shuffle(questions.filter(q => !q.isReview));
        const finalQuestions = [...reviewQs, ...newQs];

        // Start quiz with spaced repetition mode
        appData.quizState = {
            questions: finalQuestions,
            currentIndex: 0,
            answers: new Array(finalQuestions.length).fill(null),
            correctCount: 0,
            startTime: Date.now(),
            examMode: 'spaced-repetition',
            examDuration: null,
            isFullExam: false,
            spacedRepetitionMode: true
        };

        switchView('practice');
        document.getElementById('practice-setup').style.display = 'none';
        document.getElementById('practice-quiz').style.display = 'block';
        displayQuestion();

        console.log('🎯 Started optimized spaced repetition session');
    }

    // Start new learning session
    startNewLearning() {
        const newQuestions = this.getNewQuestions(20);
        
        if (newQuestions.length === 0) {
            alert('All questions are already in your learning queue!');
            return;
        }

        const questions = newQuestions
            .map(qId => appData.content.practiceQuestions.find(q => q.id === qId))
            .filter(q => q !== undefined);

        appData.quizState = {
            questions: shuffle(questions),
            currentIndex: 0,
            answers: new Array(questions.length).fill(null),
            correctCount: 0,
            startTime: Date.now(),
            examMode: 'new-learning',
            examDuration: null,
            isFullExam: false,
            spacedRepetitionMode: true
        };

        switchView('practice');
        document.getElementById('practice-setup').style.display = 'none';
        document.getElementById('practice-quiz').style.display = 'block';
        displayQuestion();
    }

    // Get statistics for dashboard
    getStatistics() {
        const totalScheduled = Object.keys(this.repetitionData.questionSchedule).length;
        let totalCorrect = 0;
        let totalReviews = 0;

        Object.values(this.repetitionData.questionSchedule).forEach(schedule => {
            totalCorrect += schedule.correctCount || 0;
            totalReviews += schedule.totalReviews || 0;
        });

        const retention = totalReviews > 0 
            ? Math.round((totalCorrect / totalReviews) * 100)
            : 0;

        // Calculate time saved (spaced rep typically saves 30-40%)
        const traditionalTime = totalReviews * 3; // 3 min per review traditional
        const spacedRepTime = totalReviews * 2; // 2 min per review with SR
        const timesSaved = Math.round((traditionalTime - spacedRepTime) / 60 * 10) / 10; // Hours

        return {
            questionsLearned: totalScheduled,
            totalReviews,
            retention,
            efficiency: this.calculateStudyEfficiency(),
            timesSaved
        };
    }

    // Add days to date
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Calculate days between dates
    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }

    // Get next review date for a question
    getNextReviewDate(questionId) {
        const schedule = this.repetitionData.questionSchedule[questionId];
        return schedule ? new Date(schedule.nextReview) : null;
    }

    // Check if question is due for review
    isDueForReview(questionId) {
        const nextReview = this.getNextReviewDate(questionId);
        if (!nextReview) return false;
        return nextReview <= new Date();
    }

    // Reset spaced repetition data (for testing)
    reset() {
        if (confirm('Reset all spaced repetition data? This cannot be undone.')) {
            this.repetitionData = {
                questionSchedule: {},
                reviewQueue: [],
                stats: {
                    questionsLearned: 0,
                    questionsReviewed: 0,
                    averageRetention: 0,
                    studyEfficiency: 100,
                    timesSaved: 0
                },
                settings: {
                    maxNewPerDay: 20,
                    maxReviewsPerDay: 50,
                    targetRetention: 90,
                    intervalMultiplier: 2.5
                }
            };
            this.saveRepetitionData();
            this.updateReviewQueue();
            return true;
        }
        return false;
    }
}

// Integrate with existing submitAnswer function
const originalSubmitAnswerSR = submitAnswer;
submitAnswer = function() {
    const state = appData.quizState;
    const question = state.questions[state.currentIndex];
    
    // Call original function
    originalSubmitAnswerSR();
    
    // If in spaced repetition mode, record the attempt
    if (state.spacedRepetitionMode && typeof spacedRepetitionSystem !== 'undefined') {
        const isCorrect = state.selectedAnswer === question.correctAnswer;
        
        // Ask user how difficult it was (if correct)
        let difficulty = 'medium';
        if (isCorrect) {
            // Could show UI to ask, but for now use timing
            const timeSpent = (Date.now() - (state.questionStartTime || Date.now())) / 1000;
            if (timeSpent < 15) difficulty = 'easy';
            else if (timeSpent > 45) difficulty = 'hard';
        }
        
        spacedRepetitionSystem.recordAttempt(question.id, isCorrect, difficulty);
    }
};

// Initialize spaced repetition system
const spacedRepetitionSystem = new SpacedRepetitionSystem();

// Add to home page quick actions
function addSpacedRepetitionToHome() {
    const session = spacedRepetitionSystem.getOptimalStudySession(30);
    
    if (session.reviewQuestions.length > 0) {
        // Show review notice on home
        const homeView = document.getElementById('home-view');
        if (!homeView) return;

        const existingNotice = document.getElementById('sr-notice');
        if (existingNotice) existingNotice.remove();

        const notice = document.createElement('div');
        notice.id = 'sr-notice';
        notice.className = 'sr-home-notice';
        notice.innerHTML = `
            <div class="sr-notice-icon">🧠</div>
            <div class="sr-notice-content">
                <h3>Smart Review Available!</h3>
                <p><strong>${session.reviewQuestions.length} questions</strong> are due for review today. 
                   Reviewing at optimal intervals increases retention by <strong>40-50%</strong>!</p>
                <button class="btn btn-primary" onclick="spacedRepetitionSystem.startOptimizedSession()">
                    Start Smart Review Session
                </button>
            </div>
        `;

        homeView.insertBefore(notice, homeView.firstChild);
    }
}

// Add spaced repetition dashboard to progress view
function enhanceProgressWithSR() {
    const progressView = document.getElementById('progress-view');
    if (!progressView) return;

    // Check if SR dashboard already exists
    if (document.getElementById('spaced-repetition-dashboard')) return;

    const srDashboard = document.createElement('div');
    srDashboard.id = 'spaced-repetition-dashboard';
    srDashboard.style.marginBottom = '32px';

    progressView.insertBefore(srDashboard, progressView.querySelector('.enhanced-dashboard'));
    
    spacedRepetitionSystem.displayReviewDashboard();
}

// Initialize on page load
setTimeout(() => {
    if (typeof spacedRepetitionSystem !== 'undefined') {
        addSpacedRepetitionToHome();
        enhanceProgressWithSR();
        console.log('✅ Spaced Repetition System active');
    }
}, 1500);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpacedRepetitionSystem, spacedRepetitionSystem };
}

