// Adaptive Learning System - Dynamic Difficulty Adjustment
// A product of Bradley Virtual Solutions, LLC

class AdaptiveLearning {
    constructor() {
        this.userLevel = 50; // Start at medium (0-100 scale)
        this.performanceHistory = [];
        this.currentStreak = 0;
        this.maxHistorySize = 10;
        
        // Difficulty levels
        this.difficultyLevels = {
            beginner: { min: 0, max: 30, label: 'Beginner', stars: '⭐' },
            intermediate: { min: 31, max: 50, label: 'Intermediate', stars: '⭐⭐' },
            advanced: { min: 51, max: 70, label: 'Advanced', stars: '⭐⭐⭐' },
            expert: { min: 71, max: 90, label: 'Expert', stars: '⭐⭐⭐⭐' },
            master: { min: 91, max: 100, label: 'Master', stars: '⭐⭐⭐⭐⭐' }
        };
        
        // Load saved state
        this.loadState();
    }
    
    // Load adaptive learning state
    loadState() {
        const saved = localStorage.getItem('adaptiveLearningState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.userLevel = state.userLevel || 50;
                this.performanceHistory = state.performanceHistory || [];
                this.currentStreak = state.currentStreak || 0;
            } catch (e) {
                console.error('Error loading adaptive learning state:', e);
            }
        }
    }
    
    // Save adaptive learning state
    saveState() {
        const state = {
            userLevel: this.userLevel,
            performanceHistory: this.performanceHistory,
            currentStreak: this.currentStreak,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('adaptiveLearningState', JSON.stringify(state));
    }
    
    // Record answer and adjust difficulty
    recordAnswer(isCorrect, questionDifficulty = 'intermediate', timeSpent = 0) {
        // Add to history
        this.performanceHistory.push({
            correct: isCorrect,
            difficulty: questionDifficulty,
            timeSpent,
            timestamp: Date.now()
        });
        
        // Keep only recent history
        if (this.performanceHistory.length > this.maxHistorySize) {
            this.performanceHistory.shift();
        }
        
        // Update streak
        if (isCorrect) {
            this.currentStreak++;
        } else {
            this.currentStreak = 0;
        }
        
        // Adjust user level
        this.adjustLevel(isCorrect, questionDifficulty, timeSpent);
        
        // Save state
        this.saveState();
        
        return this.getAdaptiveState();
    }
    
    // Adjust user difficulty level
    adjustLevel(isCorrect, questionDifficulty, timeSpent) {
        const difficultyValue = this.getDifficultyValue(questionDifficulty);
        
        // Calculate adjustment based on performance
        let adjustment = 0;
        
        if (isCorrect) {
            // Increase level for correct answers
            adjustment = 3;
            
            // Bonus for fast answers
            if (timeSpent < 30) {
                adjustment += 2;
            }
            
            // Bonus for streak
            if (this.currentStreak >= 3) {
                adjustment += 2;
            }
            
            // More adjustment if question was hard
            if (difficultyValue > 70) {
                adjustment += 2;
            }
        } else {
            // Decrease level for incorrect answers
            adjustment = -5;
            
            // Bigger decrease if question was easy
            if (difficultyValue < 40) {
                adjustment -= 3;
            }
        }
        
        // Calculate recent performance
        const recentAccuracy = this.getRecentAccuracy();
        
        // Fine-tune based on recent performance
        if (recentAccuracy > 0.8 && isCorrect) {
            adjustment += 1; // Doing well, push harder
        } else if (recentAccuracy < 0.4 && !isCorrect) {
            adjustment -= 2; // Struggling, ease up more
        }
        
        // Apply adjustment with bounds
        this.userLevel = Math.max(0, Math.min(100, this.userLevel + adjustment));
    }
    
    // Get difficulty value from string
    getDifficultyValue(difficulty) {
        const map = {
            'beginner': 20,
            'intermediate': 50,
            'advanced': 70,
            'expert': 85,
            'master': 95
        };
        return map[difficulty?.toLowerCase()] || 50;
    }
    
    // Get recent accuracy (last 5 questions)
    getRecentAccuracy() {
        if (this.performanceHistory.length === 0) return 0.5;
        
        const recent = this.performanceHistory.slice(-5);
        const correct = recent.filter(q => q.correct).length;
        return correct / recent.length;
    }
    
    // Get recommended difficulty for next question
    getRecommendedDifficulty() {
        // Map user level to difficulty
        for (const [key, level] of Object.entries(this.difficultyLevels)) {
            if (this.userLevel >= level.min && this.userLevel <= level.max) {
                return {
                    difficulty: key,
                    label: level.label,
                    stars: level.stars,
                    userLevel: this.userLevel
                };
            }
        }
        
        return {
            difficulty: 'intermediate',
            label: 'Intermediate',
            stars: '⭐⭐',
            userLevel: this.userLevel
        };
    }
    
    // Filter questions by recommended difficulty
    filterQuestionsByDifficulty(questions) {
        const recommended = this.getRecommendedDifficulty();
        const targetDifficulty = recommended.difficulty;
        
        // Try to get questions at recommended level
        let filtered = questions.filter(q => 
            (q.difficulty?.toLowerCase() || 'intermediate') === targetDifficulty
        );
        
        // If not enough, include adjacent difficulties
        if (filtered.length < 5) {
            const adjacentDifficulties = this.getAdjacentDifficulties(targetDifficulty);
            filtered = questions.filter(q => {
                const qDiff = q.difficulty?.toLowerCase() || 'intermediate';
                return qDiff === targetDifficulty || adjacentDifficulties.includes(qDiff);
            });
        }
        
        // If still not enough, return all
        if (filtered.length < 3) {
            return questions;
        }
        
        return filtered;
    }
    
    // Get adjacent difficulty levels
    getAdjacentDifficulties(difficulty) {
        const order = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
        const index = order.indexOf(difficulty);
        
        const adjacent = [];
        if (index > 0) adjacent.push(order[index - 1]);
        if (index < order.length - 1) adjacent.push(order[index + 1]);
        
        return adjacent;
    }
    
    // Get current adaptive state
    getAdaptiveState() {
        const recommended = this.getRecommendedDifficulty();
        const recentAccuracy = this.getRecentAccuracy();
        
        return {
            userLevel: this.userLevel,
            currentDifficulty: recommended,
            currentStreak: this.currentStreak,
            recentAccuracy: Math.round(recentAccuracy * 100),
            levelProgress: this.getLevelProgress(),
            message: this.getAdaptiveMessage(),
            performanceHistory: this.performanceHistory.slice(-5)
        };
    }
    
    // Get progress within current level
    getLevelProgress() {
        const recommended = this.getRecommendedDifficulty();
        const level = this.difficultyLevels[recommended.difficulty];
        
        const range = level.max - level.min;
        const progress = this.userLevel - level.min;
        const percentage = Math.round((progress / range) * 100);
        
        return {
            current: this.userLevel,
            min: level.min,
            max: level.max,
            percentage: Math.max(0, Math.min(100, percentage)),
            nextLevel: this.getNextLevel(recommended.difficulty)
        };
    }
    
    // Get next difficulty level
    getNextLevel(currentDifficulty) {
        const order = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
        const index = order.indexOf(currentDifficulty);
        
        if (index < order.length - 1) {
            const nextKey = order[index + 1];
            return this.difficultyLevels[nextKey].label;
        }
        
        return 'Maximum Level';
    }
    
    // Get adaptive message
    getAdaptiveMessage() {
        const accuracy = this.getRecentAccuracy();
        const streak = this.currentStreak;
        
        if (streak >= 5) {
            return '🔥 Incredible streak! The questions will get more challenging.';
        } else if (streak >= 3) {
            return '⭐ Great job! Keep up the momentum!';
        } else if (accuracy > 0.8) {
            return '📈 Excellent performance! Adjusting difficulty up.';
        } else if (accuracy < 0.4) {
            return '💡 Adjusting difficulty to match your level. Keep practicing!';
        } else {
            return '🎯 You\'re in the optimal learning zone!';
        }
    }
    
    // Reset adaptive learning (for testing or new start)
    reset() {
        this.userLevel = 50;
        this.performanceHistory = [];
        this.currentStreak = 0;
        this.saveState();
    }
    
    // Get statistics
    getStatistics() {
        const totalAnswered = this.performanceHistory.length;
        const correct = this.performanceHistory.filter(q => q.correct).length;
        const accuracy = totalAnswered > 0 ? (correct / totalAnswered) * 100 : 0;
        
        return {
            totalAnswered,
            correct,
            accuracy: Math.round(accuracy),
            currentStreak: this.currentStreak,
            userLevel: this.userLevel,
            currentDifficulty: this.getRecommendedDifficulty().label
        };
    }
}

// Create global instance
const adaptiveLearning = new AdaptiveLearning();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = adaptiveLearning;
}

