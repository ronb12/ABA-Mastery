// Gamification System - Streaks, XP, Achievements, Levels
// A product of Bradley Virtual Solutions, LLC

class GamificationSystem {
    constructor() {
        this.userData = {
            xp: 0,
            level: 1,
            streak: 0,
            lastStudyDate: null,
            achievements: [],
            totalXP: 0,
            dailyGoalMet: false
        };
        
        // XP rewards for different actions
        this.xpRewards = {
            correctAnswer: 10,
            incorrectAnswer: 2,
            quizComplete: 50,
            perfectQuiz: 100,
            scenarioComplete: 75,
            flashcardSession: 30,
            dailyGoalMet: 100,
            weekStreak: 200,
            monthStreak: 500
        };
        
        // Level system (XP needed for each level)
        this.levels = [
            { level: 1, xpNeeded: 0, title: 'Novice Learner', icon: '🌱' },
            { level: 2, xpNeeded: 100, title: 'Curious Student', icon: '📚' },
            { level: 3, xpNeeded: 250, title: 'Dedicated Learner', icon: '📖' },
            { level: 4, xpNeeded: 500, title: 'Knowledge Seeker', icon: '🔍' },
            { level: 5, xpNeeded: 1000, title: 'Rising Scholar', icon: '⭐' },
            { level: 6, xpNeeded: 1750, title: 'Skilled Analyst', icon: '🎯' },
            { level: 7, xpNeeded: 2750, title: 'Expert Practitioner', icon: '🏆' },
            { level: 8, xpNeeded: 4000, title: 'Advanced Specialist', icon: '💎' },
            { level: 9, xpNeeded: 6000, title: 'Master Analyst', icon: '👑' },
            { level: 10, xpNeeded: 8500, title: 'Elite Professional', icon: '🌟' },
            { level: 11, xpNeeded: 11500, title: 'Exceptional Expert', icon: '💫' },
            { level: 12, xpNeeded: 15000, title: 'ABA Virtuoso', icon: '🔥' }
        ];
        
        // Achievement definitions
        this.achievementDefinitions = [
            // Beginner achievements
            { id: 'first_question', name: 'First Steps', description: 'Answer your first question', icon: '🎯', condition: (data) => data.questionsAnswered >= 1, xp: 25 },
            { id: 'first_quiz', name: 'Quiz Taker', description: 'Complete your first quiz', icon: '📝', condition: (data) => data.quizzesCompleted >= 1, xp: 50 },
            { id: 'perfect_quiz', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯', condition: (data) => data.perfectQuizzes >= 1, xp: 100 },
            
            // Volume achievements
            { id: 'ten_questions', name: 'Getting Started', description: 'Answer 10 questions', icon: '🌟', condition: (data) => data.questionsAnswered >= 10, xp: 50 },
            { id: 'fifty_questions', name: 'Dedicated Student', description: 'Answer 50 questions', icon: '📚', condition: (data) => data.questionsAnswered >= 50, xp: 100 },
            { id: 'century_club', name: 'Century Club', description: 'Answer 100 questions', icon: '💪', condition: (data) => data.questionsAnswered >= 100, xp: 200 },
            { id: 'practice_master', name: 'Practice Master', description: 'Answer 250 questions', icon: '🎓', condition: (data) => data.questionsAnswered >= 250, xp: 500 },
            { id: 'question_legend', name: 'Question Legend', description: 'Answer 500 questions', icon: '🏆', condition: (data) => data.questionsAnswered >= 500, xp: 1000 },
            
            // Accuracy achievements
            { id: 'accuracy_expert', name: 'Accuracy Expert', description: 'Maintain 80%+ accuracy on 50+ questions', icon: '🎯', condition: (data) => data.questionsAnswered >= 50 && (data.correctAnswers / data.questionsAnswered) >= 0.8, xp: 150 },
            { id: 'precision_master', name: 'Precision Master', description: 'Maintain 90%+ accuracy on 100+ questions', icon: '💎', condition: (data) => data.questionsAnswered >= 100 && (data.correctAnswers / data.questionsAnswered) >= 0.9, xp: 300 },
            
            // Streak achievements
            { id: 'week_warrior', name: 'Week Warrior', description: 'Study for 7 days in a row', icon: '🔥', condition: (data) => data.streak >= 7, xp: 200 },
            { id: 'two_week_champion', name: 'Two Week Champion', description: 'Study for 14 days in a row', icon: '⚡', condition: (data) => data.streak >= 14, xp: 400 },
            { id: 'month_master', name: 'Month Master', description: 'Study for 30 days in a row', icon: '👑', condition: (data) => data.streak >= 30, xp: 1000 },
            
            // Speed achievements
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a quiz in under 5 minutes', icon: '⚡', condition: (data) => data.fastestQuiz <= 300, xp: 100 },
            { id: 'quick_thinker', name: 'Quick Thinker', description: 'Complete a quiz in under 3 minutes', icon: '💨', condition: (data) => data.fastestQuiz <= 180, xp: 200 },
            
            // Study time achievements
            { id: 'one_hour_scholar', name: 'One Hour Scholar', description: 'Study for 1 hour total', icon: '⏰', condition: (data) => data.studyTime >= 60, xp: 100 },
            { id: 'five_hour_expert', name: 'Five Hour Expert', description: 'Study for 5 hours total', icon: '📖', condition: (data) => data.studyTime >= 300, xp: 250 },
            { id: 'marathon_learner', name: 'Marathon Learner', description: 'Study for 10 hours total', icon: '🏃', condition: (data) => data.studyTime >= 600, xp: 500 },
            
            // Category mastery
            { id: 'category_master', name: 'Category Master', description: 'Master one category (80%+ accuracy)', icon: '🎖️', condition: (data) => data.categoriesMastered >= 1, xp: 150 },
            { id: 'multi_category_expert', name: 'Multi-Category Expert', description: 'Master 3 categories', icon: '🌟', condition: (data) => data.categoriesMastered >= 3, xp: 300 },
            { id: 'complete_mastery', name: 'Complete Mastery', description: 'Master all categories', icon: '💫', condition: (data) => data.categoriesMastered >= 8, xp: 1000 }
        ];
        
        // Load saved state
        this.loadState();
    }
    
    // Load gamification state
    loadState() {
        const saved = localStorage.getItem('gamificationData');
        if (saved) {
            try {
                this.userData = { ...this.userData, ...JSON.parse(saved) };
                this.updateStreak();
            } catch (e) {
                console.error('Error loading gamification data:', e);
            }
        }
    }
    
    // Save gamification state
    saveState() {
        localStorage.setItem('gamificationData', JSON.stringify(this.userData));
        
        // Sync to cloud if available
        if (typeof cloudSync !== 'undefined') {
            cloudSync.pushToCloud('gamification-update');
        }
    }
    
    // Update streak (call daily)
    updateStreak() {
        const today = new Date().toDateString();
        const lastStudy = this.userData.lastStudyDate;
        
        if (!lastStudy) {
            // First time
            this.userData.streak = 0;
            return;
        }
        
        const lastDate = new Date(lastStudy);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if studied today already
        if (lastDate.toDateString() === today) {
            return; // Already counted today
        }
        
        // Check if studied yesterday
        if (lastDate.toDateString() === yesterday.toDateString()) {
            // Consecutive day - increase streak
            this.userData.streak++;
            this.userData.lastStudyDate = today;
            
            // Award XP for streak milestones
            if (this.userData.streak === 7) {
                this.awardXP(this.xpRewards.weekStreak, '7 Day Streak!');
            } else if (this.userData.streak === 30) {
                this.awardXP(this.xpRewards.monthStreak, '30 Day Streak!');
            }
        } else {
            // Streak broken
            if (this.userData.streak > 0) {
                this.showNotification(`⚠️ Streak ended at ${this.userData.streak} days`, 'warning');
            }
            this.userData.streak = 1;
            this.userData.lastStudyDate = today;
        }
        
        this.saveState();
    }
    
    // Record study session (call when user starts studying)
    recordStudySession() {
        this.updateStreak();
        
        const today = new Date().toDateString();
        if (this.userData.lastStudyDate !== today) {
            this.userData.streak = 1;
            this.userData.lastStudyDate = today;
            this.saveState();
        }
    }
    
    // Award XP
    awardXP(amount, reason = '') {
        this.userData.xp += amount;
        this.userData.totalXP += amount;
        
        // Check for level up
        this.checkLevelUp();
        
        // Check for achievements
        this.checkAchievements();
        
        // Save state
        this.saveState();
        
        // Show notification
        if (reason) {
            this.showNotification(`+${amount} XP - ${reason}`, 'success');
        }
        
        return {
            xpAwarded: amount,
            totalXP: this.userData.totalXP,
            level: this.userData.level
        };
    }
    
    // Check for level up
    checkLevelUp() {
        const currentLevel = this.userData.level;
        const nextLevel = this.levels.find(l => l.level === currentLevel + 1);
        
        if (nextLevel && this.userData.totalXP >= nextLevel.xpNeeded) {
            this.userData.level = nextLevel.level;
            this.userData.xp = this.userData.totalXP - nextLevel.xpNeeded;
            
            // Show level up notification
            this.showNotification(
                `🎉 Level Up! You're now ${nextLevel.title} ${nextLevel.icon}`,
                'success'
            );
            
            // Award bonus XP
            this.userData.totalXP += 50;
        }
    }
    
    // Check and award achievements
    checkAchievements() {
        const abaUserData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        
        // Combine data for achievement checking
        const combinedData = {
            ...abaUserData,
            streak: this.userData.streak,
            perfectQuizzes: abaUserData.perfectQuizzes || 0,
            quizzesCompleted: abaUserData.recentActivity?.length || 0,
            fastestQuiz: abaUserData.fastestQuiz || Infinity,
            categoriesMastered: this.countMasteredCategories(abaUserData)
        };
        
        let newAchievements = [];
        
        this.achievementDefinitions.forEach(achievement => {
            // Check if already unlocked
            if (this.userData.achievements.includes(achievement.id)) {
                return;
            }
            
            // Check condition
            if (achievement.condition(combinedData)) {
                this.userData.achievements.push(achievement.id);
                newAchievements.push(achievement);
                
                // Award XP
                this.userData.totalXP += achievement.xp;
                
                // Show achievement notification
                this.showAchievementUnlocked(achievement);
            }
        });
        
        return newAchievements;
    }
    
    // Count mastered categories
    countMasteredCategories(userData) {
        const categoryProgress = userData.categoryProgress || {};
        let count = 0;
        
        Object.keys(categoryProgress).forEach(category => {
            const progress = categoryProgress[category];
            if (progress.total >= 10 && (progress.correct / progress.total) >= 0.8) {
                count++;
            }
        });
        
        return count;
    }
    
    // Get current level info
    getCurrentLevelInfo() {
        const currentLevel = this.levels.find(l => l.level === this.userData.level);
        const nextLevel = this.levels.find(l => l.level === this.userData.level + 1);
        
        if (!nextLevel) {
            return {
                ...currentLevel,
                xpToNext: 0,
                progress: 100,
                isMaxLevel: true
            };
        }
        
        const xpToNext = nextLevel.xpNeeded - this.userData.totalXP;
        const xpRange = nextLevel.xpNeeded - currentLevel.xpNeeded;
        const xpProgress = this.userData.totalXP - currentLevel.xpNeeded;
        const progress = Math.round((xpProgress / xpRange) * 100);
        
        return {
            ...currentLevel,
            nextLevel: nextLevel.title,
            xpToNext: Math.max(0, xpToNext),
            progress: Math.min(100, Math.max(0, progress)),
            isMaxLevel: false
        };
    }
    
    // Get all achievements with status
    getAllAchievements() {
        return this.achievementDefinitions.map(achievement => ({
            ...achievement,
            unlocked: this.userData.achievements.includes(achievement.id)
        }));
    }
    
    // Get unlocked achievements
    getUnlockedAchievements() {
        return this.achievementDefinitions.filter(achievement =>
            this.userData.achievements.includes(achievement.id)
        );
    }
    
    // Get gamification dashboard data
    getDashboardData() {
        const levelInfo = this.getCurrentLevelInfo();
        const achievements = this.getAllAchievements();
        const unlockedCount = this.getUnlockedAchievements().length;
        
        return {
            level: this.userData.level,
            levelInfo,
            xp: this.userData.xp,
            totalXP: this.userData.totalXP,
            streak: this.userData.streak,
            achievements: {
                unlocked: unlockedCount,
                total: achievements.length,
                list: achievements
            },
            recentAchievements: this.getUnlockedAchievements().slice(-3)
        };
    }
    
    // Record quiz completion
    recordQuizCompletion(score, totalQuestions, timeSpent) {
        this.recordStudySession();
        
        // Award base XP
        this.awardXP(this.xpRewards.quizComplete, 'Quiz Completed');
        
        // Award accuracy bonus
        const accuracy = score / totalQuestions;
        const bonusXP = Math.round(accuracy * 50);
        this.awardXP(bonusXP, `${Math.round(accuracy * 100)}% Accuracy Bonus`);
        
        // Perfect quiz bonus
        if (score === totalQuestions) {
            this.awardXP(this.xpRewards.perfectQuiz, 'Perfect Quiz!');
        }
        
        this.saveState();
    }
    
    // Record answer
    recordAnswer(isCorrect) {
        this.recordStudySession();
        
        if (isCorrect) {
            this.awardXP(this.xpRewards.correctAnswer);
        } else {
            this.awardXP(this.xpRewards.incorrectAnswer);
        }
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Show achievement unlocked notification
    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: achievementSlideIn 0.5s ease-out, achievementSlideOut 0.5s ease-in 4.5s;
            max-width: 320px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 32px;">${achievement.icon}</div>
            <div>
                <div style="font-weight: 700; margin-bottom: 4px;">Achievement Unlocked!</div>
                <div style="opacity: 0.95;">${achievement.name}</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 2px;">+${achievement.xp} XP</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievementSlideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes achievementSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Get statistics
    getStatistics() {
        return {
            level: this.userData.level,
            totalXP: this.userData.totalXP,
            streak: this.userData.streak,
            achievementsUnlocked: this.userData.achievements.length,
            totalAchievements: this.achievementDefinitions.length
        };
    }
}

// Create global instance
const gamification = new GamificationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gamification;
}

