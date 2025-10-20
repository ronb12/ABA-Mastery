// AI Study Coach - Predictive Exam Readiness System
// A product of Bradley Virtual Solutions, LLC

class AIStudyCoach {
    constructor() {
        this.userData = null;
        this.readinessScore = 0;
        this.passProb = 0;
        this.recommendations = [];
        
        // Category weights based on exam importance
        this.categoryWeights = {
            'Ethics': 0.15,
            'Measurement': 0.15,
            'Assessment': 0.15,
            'Experimental Design': 0.15,
            'Intervention': 0.15,
            'Behavior Change': 0.10,
            'Verbal Behavior': 0.10,
            'Professional Conduct': 0.05
        };
        
        // Minimum scores for passing
        this.passingThresholds = {
            overall: 80,
            perCategory: 70
        };
    }
    
    // Calculate comprehensive exam readiness
    calculateExamReadiness() {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        this.userData = userData;
        
        if (!userData.questionsAnswered || userData.questionsAnswered < 10) {
            return {
                readinessScore: 0,
                passProb: 0,
                message: 'Complete at least 10 practice questions to get your readiness score.',
                status: 'insufficient-data'
            };
        }
        
        // Calculate overall accuracy
        const overallAccuracy = userData.questionsAnswered > 0
            ? (userData.correctAnswers / userData.questionsAnswered) * 100
            : 0;
        
        // Calculate category performance
        const categoryScores = this.calculateCategoryScores(userData);
        
        // Calculate weighted readiness score
        let weightedScore = 0;
        let totalWeight = 0;
        
        Object.keys(categoryScores).forEach(category => {
            const weight = this.categoryWeights[category] || 0.05;
            const score = categoryScores[category].accuracy;
            weightedScore += score * weight;
            totalWeight += weight;
        });
        
        const baseReadiness = totalWeight > 0 ? weightedScore / totalWeight : overallAccuracy;
        
        // Adjust for question volume (more questions = more confidence)
        const volumeBonus = Math.min(15, (userData.questionsAnswered / 50) * 15);
        
        // Adjust for study time (more study = better preparation)
        const studyTimeBonus = Math.min(10, (userData.studyTime / 300) * 10);
        
        // Calculate final readiness (0-100)
        this.readinessScore = Math.min(100, Math.round(baseReadiness + volumeBonus + studyTimeBonus));
        
        // Calculate pass probability using sigmoid function
        this.passProb = this.calculatePassProbability(this.readinessScore, userData);
        
        // Generate recommendations
        this.recommendations = this.generateRecommendations(categoryScores, userData);
        
        // Calculate predicted ready date
        const predictedDate = this.predictReadyDate(this.readinessScore, userData);
        
        return {
            readinessScore: this.readinessScore,
            passProb: this.passProb,
            overallAccuracy: Math.round(overallAccuracy),
            categoryScores,
            recommendations: this.recommendations,
            predictedDate,
            status: this.getReadinessStatus(this.readinessScore),
            message: this.getReadinessMessage(this.readinessScore),
            studyTimeNeeded: this.calculateStudyTimeNeeded(this.readinessScore)
        };
    }
    
    // Calculate scores by category
    calculateCategoryScores(userData) {
        const categoryProgress = userData.categoryProgress || {};
        const scores = {};
        
        Object.keys(categoryProgress).forEach(category => {
            const progress = categoryProgress[category];
            const accuracy = progress.total > 0 
                ? (progress.correct / progress.total) * 100 
                : 0;
            
            scores[category] = {
                correct: progress.correct || 0,
                total: progress.total || 0,
                accuracy: Math.round(accuracy),
                mastered: progress.mastered || false,
                status: this.getCategoryStatus(accuracy, progress.total)
            };
        });
        
        return scores;
    }
    
    // Calculate pass probability using sigmoid curve
    calculatePassProbability(readiness, userData) {
        // Base probability from readiness score
        let baseProb = 1 / (1 + Math.exp(-(readiness - 75) / 10)) * 100;
        
        // Boost for high question volume
        if (userData.questionsAnswered > 200) {
            baseProb += 5;
        } else if (userData.questionsAnswered > 100) {
            baseProb += 3;
        }
        
        // Boost for consistent study (multiple sessions)
        const studySessions = userData.recentActivity?.length || 0;
        if (studySessions > 10) {
            baseProb += 3;
        }
        
        return Math.min(99, Math.round(baseProb));
    }
    
    // Generate personalized recommendations
    generateRecommendations(categoryScores, userData) {
        const recommendations = [];
        
        // Find weakest category
        let weakestCategory = null;
        let lowestScore = 100;
        
        Object.keys(categoryScores).forEach(category => {
            const score = categoryScores[category];
            if (score.total >= 5 && score.accuracy < lowestScore) {
                lowestScore = score.accuracy;
                weakestCategory = category;
            }
        });
        
        if (weakestCategory) {
            recommendations.push({
                type: 'focus',
                icon: '🎯',
                priority: 'high',
                title: `Focus on ${weakestCategory}`,
                description: `Your ${weakestCategory} accuracy is ${lowestScore}%. Complete 15 more questions to improve.`,
                action: 'practice',
                category: weakestCategory
            });
        }
        
        // Check for insufficient practice
        if (userData.questionsAnswered < 100) {
            recommendations.push({
                type: 'volume',
                icon: '📚',
                priority: 'high',
                title: 'Complete More Practice Questions',
                description: `You've completed ${userData.questionsAnswered} questions. Aim for 200+ for optimal preparation.`,
                action: 'practice',
                category: 'all'
            });
        }
        
        // Check for categories with no practice
        const allCategories = Object.keys(this.categoryWeights);
        const unpracticedCategories = allCategories.filter(cat => 
            !categoryScores[cat] || categoryScores[cat].total === 0
        );
        
        if (unpracticedCategories.length > 0) {
            recommendations.push({
                type: 'coverage',
                icon: '🔍',
                priority: 'medium',
                title: 'Practice All Topics',
                description: `You haven't practiced: ${unpracticedCategories.slice(0, 2).join(', ')}`,
                action: 'study',
                category: unpracticedCategories[0]
            });
        }
        
        // Check study time
        if (userData.studyTime < 180) {
            recommendations.push({
                type: 'time',
                icon: '⏰',
                priority: 'medium',
                title: 'Increase Study Time',
                description: 'Aim for at least 3 hours of total study time for better retention.',
                action: 'study',
                category: 'all'
            });
        }
        
        // Positive reinforcement for high performers
        if (this.readinessScore >= 85) {
            recommendations.push({
                type: 'maintenance',
                icon: '🎉',
                priority: 'low',
                title: 'You\'re Almost Ready!',
                description: 'Keep practicing to maintain your high performance. Focus on reviewing weak areas.',
                action: 'review',
                category: 'all'
            });
        }
        
        return recommendations.slice(0, 3); // Return top 3 recommendations
    }
    
    // Predict when user will be ready
    predictReadyDate(readiness, userData) {
        if (readiness >= 85) {
            return 'You\'re ready now!';
        }
        
        const pointsNeeded = 85 - readiness;
        const questionsPerDay = userData.questionsAnswered > 0 
            ? userData.questionsAnswered / Math.max(1, (Date.now() - new Date(userData.lastVisit || Date.now())) / (1000 * 60 * 60 * 24))
            : 10;
        
        const avgQuestionsNeeded = pointsNeeded * 3; // Rough estimate
        const daysNeeded = Math.ceil(avgQuestionsNeeded / Math.max(1, questionsPerDay));
        
        const readyDate = new Date();
        readyDate.setDate(readyDate.getDate() + daysNeeded);
        
        return readyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Calculate additional study time needed
    calculateStudyTimeNeeded(readiness) {
        if (readiness >= 85) {
            return 'Maintenance mode - 30 min/day';
        }
        
        const pointsNeeded = 85 - readiness;
        const hoursNeeded = Math.ceil((pointsNeeded / 5) * 2); // 2 hours per 5 points
        
        return `${hoursNeeded} hours`;
    }
    
    // Get readiness status
    getReadinessStatus(score) {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'ready';
        if (score >= 70) return 'almost-ready';
        if (score >= 50) return 'progressing';
        return 'building-foundation';
    }
    
    // Get category status
    getCategoryStatus(accuracy, total) {
        if (total < 5) return 'needs-practice';
        if (accuracy >= 85) return 'mastered';
        if (accuracy >= 75) return 'strong';
        if (accuracy >= 60) return 'adequate';
        return 'needs-improvement';
    }
    
    // Get readiness message
    getReadinessMessage(score) {
        if (score >= 90) return '🎉 Excellent! You\'re ready to ace the exam!';
        if (score >= 85) return '✅ You\'re ready! Schedule your exam with confidence.';
        if (score >= 75) return '🎯 Almost ready! A few more practice sessions and you\'ll be set.';
        if (score >= 60) return '📚 Good progress! Keep studying to boost your readiness.';
        if (score >= 40) return '💪 You\'re building a foundation. Continue practicing regularly.';
        return '🌱 Just getting started! Complete more practice questions to track your progress.';
    }
    
    // Get detailed analysis for display
    getDetailedAnalysis() {
        const analysis = this.calculateExamReadiness();
        
        return {
            ...analysis,
            insights: this.generateInsights(analysis),
            strengths: this.identifyStrengths(analysis.categoryScores),
            weaknesses: this.identifyWeaknesses(analysis.categoryScores)
        };
    }
    
    // Generate insights
    generateInsights(analysis) {
        const insights = [];
        
        if (analysis.overallAccuracy >= 85) {
            insights.push('Your overall accuracy is excellent!');
        } else if (analysis.overallAccuracy >= 70) {
            insights.push('Your accuracy is solid. Focus on weak areas to improve.');
        } else {
            insights.push('Focus on understanding core concepts to improve accuracy.');
        }
        
        const masteredCategories = Object.values(analysis.categoryScores)
            .filter(cat => cat.mastered).length;
        
        if (masteredCategories >= 5) {
            insights.push(`You've mastered ${masteredCategories} categories!`);
        }
        
        return insights;
    }
    
    // Identify strengths
    identifyStrengths(categoryScores) {
        return Object.keys(categoryScores)
            .filter(cat => categoryScores[cat].accuracy >= 80 && categoryScores[cat].total >= 5)
            .slice(0, 3);
    }
    
    // Identify weaknesses
    identifyWeaknesses(categoryScores) {
        return Object.keys(categoryScores)
            .filter(cat => categoryScores[cat].accuracy < 70 && categoryScores[cat].total >= 5)
            .sort((a, b) => categoryScores[a].accuracy - categoryScores[b].accuracy)
            .slice(0, 3);
    }
}

// Create global instance
const aiStudyCoach = new AIStudyCoach();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = aiStudyCoach;
}

