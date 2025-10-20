// Advanced Analytics Module for ABA Mastery
// Tracks detailed performance, identifies weak areas, and provides study recommendations

class AnalyticsEngine {
    constructor() {
        this.performanceData = this.loadPerformanceData();
    }

    // Load detailed performance data from localStorage
    loadPerformanceData() {
        const saved = localStorage.getItem('abaPerformanceData');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            questionHistory: {}, // questionId: {attempts: [], lastAttempt: date, mastered: bool}
            categoryPerformance: {}, // categoryId: {correct: 0, total: 0, avgTime: 0}
            weakAreas: [], // [{category, accuracy, needsWork: bool}]
            bookmarkedQuestions: [], // questionIds
            studyStreak: 0,
            lastStudyDate: null,
            totalStudyDays: 0,
            examReadiness: 0, // 0-100 score
            recommendedFocus: [],
            masteredCategories: [],
            questionNotes: {} // questionId: note text
        };
    }

    // Save performance data
    savePerformanceData() {
        localStorage.setItem('abaPerformanceData', JSON.stringify(this.performanceData));
    }

    // Record a question attempt
    recordQuestionAttempt(questionId, category, isCorrect, timeSpent, difficulty) {
        // Initialize question history if not exists
        if (!this.performanceData.questionHistory[questionId]) {
            this.performanceData.questionHistory[questionId] = {
                attempts: [],
                lastAttempt: null,
                mastered: false,
                timesCorrect: 0,
                timesIncorrect: 0
            };
        }

        // Record attempt
        const questionData = this.performanceData.questionHistory[questionId];
        questionData.attempts.push({
            date: new Date().toISOString(),
            correct: isCorrect,
            timeSpent,
            difficulty
        });
        questionData.lastAttempt = new Date().toISOString();
        
        if (isCorrect) {
            questionData.timesCorrect++;
        } else {
            questionData.timesIncorrect++;
        }

        // Check if question is mastered (3 correct in a row)
        const lastThree = questionData.attempts.slice(-3);
        if (lastThree.length === 3 && lastThree.every(a => a.correct)) {
            questionData.mastered = true;
        }

        // Update category performance
        if (!this.performanceData.categoryPerformance[category]) {
            this.performanceData.categoryPerformance[category] = {
                correct: 0,
                total: 0,
                totalTime: 0,
                avgTime: 0
            };
        }

        const catData = this.performanceData.categoryPerformance[category];
        catData.total++;
        catData.totalTime += timeSpent;
        if (isCorrect) catData.correct++;
        catData.avgTime = catData.totalTime / catData.total;

        this.savePerformanceData();
        this.updateWeakAreas();
        this.calculateExamReadiness();
    }

    // Identify weak areas that need focus
    updateWeakAreas() {
        const weakAreas = [];
        
        for (const [category, data] of Object.entries(this.performanceData.categoryPerformance)) {
            const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            
            weakAreas.push({
                category,
                accuracy,
                questionsAnswered: data.total,
                needsWork: accuracy < 70 || data.total < 20,
                priority: this.calculatePriority(accuracy, data.total)
            });
        }

        // Sort by priority (lowest accuracy and sufficient attempts)
        weakAreas.sort((a, b) => b.priority - a.priority);
        
        this.performanceData.weakAreas = weakAreas;
        this.performanceData.recommendedFocus = weakAreas
            .filter(w => w.needsWork)
            .slice(0, 3)
            .map(w => w.category);
        
        this.savePerformanceData();
    }

    // Calculate priority score for studying (0-100)
    calculatePriority(accuracy, questionsAnswered) {
        // Weight: accuracy matters more, but also need sufficient data
        const accuracyWeight = 0.7;
        const volumeWeight = 0.3;
        
        const accuracyScore = (100 - accuracy); // Lower accuracy = higher priority
        const volumeScore = Math.min(questionsAnswered / 50, 1) * 100; // Need data to assess
        
        return (accuracyScore * accuracyWeight) + (volumeScore * volumeWeight);
    }

    // Calculate overall exam readiness score
    calculateExamReadiness() {
        const categories = Object.values(this.performanceData.categoryPerformance);
        
        if (categories.length === 0) {
            this.performanceData.examReadiness = 0;
            this.savePerformanceData();
            return 0;
        }

        let totalScore = 0;
        let totalWeight = 0;

        categories.forEach(cat => {
            if (cat.total > 0) {
                const accuracy = (cat.correct / cat.total) * 100;
                const coverage = Math.min(cat.total / 30, 1); // Want 30+ questions per category
                
                // Score based on accuracy and coverage
                const categoryScore = (accuracy * 0.7) + (coverage * 30);
                totalScore += categoryScore;
                totalWeight += 1;
            }
        });

        const readiness = totalWeight > 0 ? totalScore / totalWeight : 0;
        this.performanceData.examReadiness = Math.round(Math.min(readiness, 100));
        
        // Update mastered categories (80%+ accuracy with 20+ questions)
        this.performanceData.masteredCategories = Object.entries(this.performanceData.categoryPerformance)
            .filter(([_, data]) => {
                const accuracy = (data.correct / data.total) * 100;
                return accuracy >= 80 && data.total >= 20;
            })
            .map(([category, _]) => category);
        
        this.savePerformanceData();
        return this.performanceData.examReadiness;
    }

    // Get category performance details
    getCategoryPerformance(categoryId) {
        const data = this.performanceData.categoryPerformance[categoryId];
        if (!data || data.total === 0) {
            return {
                accuracy: 0,
                questionsAnswered: 0,
                avgTime: 0,
                status: 'not-started'
            };
        }

        const accuracy = (data.correct / data.total) * 100;
        let status = 'needs-work';
        
        if (accuracy >= 80 && data.total >= 20) status = 'mastered';
        else if (accuracy >= 70 && data.total >= 10) status = 'progressing';
        else if (data.total < 10) status = 'insufficient-data';

        return {
            accuracy: Math.round(accuracy),
            questionsAnswered: data.total,
            correctAnswers: data.correct,
            avgTime: Math.round(data.avgTime),
            status
        };
    }

    // Get questions that need review (incorrect or not mastered)
    getQuestionsForReview(categoryId = null) {
        const needReview = [];
        
        for (const [questionId, data] of Object.entries(this.performanceData.questionHistory)) {
            // Skip mastered questions
            if (data.mastered) continue;
            
            // Include if: never answered correctly, or last attempt was incorrect
            const lastAttempt = data.attempts[data.attempts.length - 1];
            if (!lastAttempt || !lastAttempt.correct) {
                needReview.push({
                    questionId,
                    timesAttempted: data.attempts.length,
                    timesIncorrect: data.timesIncorrect,
                    lastAttempt: data.lastAttempt
                });
            }
        }

        return needReview;
    }

    // Bookmark a question
    bookmarkQuestion(questionId) {
        if (!this.performanceData.bookmarkedQuestions.includes(questionId)) {
            this.performanceData.bookmarkedQuestions.push(questionId);
            this.savePerformanceData();
        }
    }

    // Remove bookmark
    unbookmarkQuestion(questionId) {
        const index = this.performanceData.bookmarkedQuestions.indexOf(questionId);
        if (index > -1) {
            this.performanceData.bookmarkedQuestions.splice(index, 1);
            this.savePerformanceData();
        }
    }

    // Check if question is bookmarked
    isBookmarked(questionId) {
        return this.performanceData.bookmarkedQuestions.includes(questionId);
    }

    // Add note to question
    addQuestionNote(questionId, note) {
        this.performanceData.questionNotes[questionId] = {
            note,
            created: new Date().toISOString()
        };
        this.savePerformanceData();
    }

    // Get note for question
    getQuestionNote(questionId) {
        return this.performanceData.questionNotes[questionId];
    }

    // Update study streak
    updateStudyStreak() {
        const today = new Date().toDateString();
        const lastStudy = this.performanceData.lastStudyDate ? 
            new Date(this.performanceData.lastStudyDate).toDateString() : null;

        if (lastStudy === today) {
            // Already studied today
            return this.performanceData.studyStreak;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastStudy === yesterdayStr) {
            // Continuing streak
            this.performanceData.studyStreak++;
        } else if (lastStudy !== today) {
            // Streak broken
            this.performanceData.studyStreak = 1;
        }

        this.performanceData.lastStudyDate = new Date().toISOString();
        this.performanceData.totalStudyDays++;
        this.savePerformanceData();
        
        return this.performanceData.studyStreak;
    }

    // Get study recommendations
    getStudyRecommendations() {
        const recommendations = [];
        
        // Check exam readiness
        const readiness = this.performanceData.examReadiness;
        
        if (readiness < 50) {
            recommendations.push({
                type: 'priority',
                title: 'Foundation Building Needed',
                message: 'Focus on completing practice questions in all categories to build a strong foundation.',
                action: 'practice',
                actionLabel: 'Start Practice Quiz'
            });
        } else if (readiness < 70) {
            recommendations.push({
                type: 'warning',
                title: 'Keep Practicing',
                message: 'You\'re making progress! Continue practicing to improve your readiness.',
                action: 'weak-areas',
                actionLabel: 'Practice Weak Areas'
            });
        } else if (readiness >= 90) {
            recommendations.push({
                type: 'success',
                title: 'Exam Ready!',
                message: 'You\'re performing excellently! Take a full-length practice exam to confirm readiness.',
                action: 'full-exam',
                actionLabel: 'Take Practice Exam'
            });
        }

        // Weak areas recommendations
        const weakAreas = this.performanceData.weakAreas.filter(w => w.needsWork).slice(0, 3);
        weakAreas.forEach(area => {
            recommendations.push({
                type: 'focus',
                title: `Focus on ${area.category}`,
                message: `Current accuracy: ${Math.round(area.accuracy)}%. Recommended: Practice 20-30 more questions.`,
                action: 'category-practice',
                actionLabel: 'Practice This Category',
                category: area.category
            });
        });

        // Study streak motivation
        if (this.performanceData.studyStreak >= 7) {
            recommendations.push({
                type: 'achievement',
                title: `${this.performanceData.studyStreak} Day Streak! 🔥`,
                message: 'Amazing consistency! Keep it up.',
                action: null
            });
        }

        return recommendations;
    }

    // Generate study plan
    generateStudyPlan(daysUntilExam) {
        const plan = {
            totalDays: daysUntilExam,
            dailyGoal: Math.ceil(500 / daysUntilExam), // Target 500 questions
            weeklySchedule: [],
            focusAreas: this.performanceData.recommendedFocus
        };

        // Create weekly breakdown
        const weeksRemaining = Math.ceil(daysUntilExam / 7);
        
        for (let week = 1; week <= weeksRemaining; week++) {
            const weekPlan = {
                week,
                focus: [],
                goals: []
            };

            if (week === 1) {
                weekPlan.focus = ['foundations', 'assessment'];
                weekPlan.goals = [
                    'Complete 100 practice questions',
                    'Review all foundation topics',
                    'Take 1 timed quiz'
                ];
            } else if (week <= weeksRemaining - 1) {
                weekPlan.focus = this.performanceData.recommendedFocus.slice(0, 2);
                weekPlan.goals = [
                    `Practice ${plan.dailyGoal * 7} questions`,
                    'Focus on weak areas',
                    'Review all flashcards'
                ];
            } else {
                // Final week
                weekPlan.focus = ['Full exam simulation'];
                weekPlan.goals = [
                    'Take 2-3 full-length practice exams',
                    'Review incorrect answers',
                    'Final review of weak areas'
                ];
            }

            plan.weeklySchedule.push(weekPlan);
        }

        return plan;
    }

    // Get comprehensive stats for dashboard
    getComprehensiveStats() {
        const totalQuestions = Object.keys(this.performanceData.questionHistory).length;
        const masteredQuestions = Object.values(this.performanceData.questionHistory)
            .filter(q => q.mastered).length;
        
        const totalAttempts = Object.values(this.performanceData.categoryPerformance)
            .reduce((sum, cat) => sum + cat.total, 0);
        
        const totalCorrect = Object.values(this.performanceData.categoryPerformance)
            .reduce((sum, cat) => sum + cat.correct, 0);
        
        const overallAccuracy = totalAttempts > 0 ? 
            Math.round((totalCorrect / totalAttempts) * 100) : 0;

        return {
            totalQuestions,
            masteredQuestions,
            totalAttempts,
            totalCorrect,
            overallAccuracy,
            examReadiness: this.performanceData.examReadiness,
            studyStreak: this.performanceData.studyStreak,
            totalStudyDays: this.performanceData.totalStudyDays,
            weakAreasCount: this.performanceData.weakAreas.filter(w => w.needsWork).length,
            masteredCategoriesCount: this.performanceData.masteredCategories.length,
            bookmarkedCount: this.performanceData.bookmarkedQuestions.length
        };
    }

    // Reset all data (for testing or starting over)
    resetAllData() {
        if (confirm('Are you sure you want to reset all performance data? This cannot be undone.')) {
            this.performanceData = {
                questionHistory: {},
                categoryPerformance: {},
                weakAreas: [],
                bookmarkedQuestions: [],
                studyStreak: 0,
                lastStudyDate: null,
                totalStudyDays: 0,
                examReadiness: 0,
                recommendedFocus: [],
                masteredCategories: [],
                questionNotes: {}
            };
            this.savePerformanceData();
            return true;
        }
        return false;
    }
}

// Create global analytics instance
const analyticsEngine = new AnalyticsEngine();

