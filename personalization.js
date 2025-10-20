// Personalization System - User Name & Custom Greetings
// A product of Bradley Virtual Solutions, LLC

class PersonalizationSystem {
    constructor() {
        this.userName = '';
        this.userEmail = '';
        this.firstName = '';
        this.init();
    }
    
    // Initialize personalization
    init() {
        // Listen for auth state
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.loadUserInfo(user);
                }
            });
        }
    }
    
    // Load user information
    loadUserInfo(user) {
        this.userName = user.displayName || '';
        this.userEmail = user.email || '';
        this.firstName = this.extractFirstName(this.userName);
        
        console.log('✅ Personalization loaded:', this.firstName || 'Guest');
        
        // Update all personalized elements
        this.updateAllGreetings();
    }
    
    // Extract first name from full name
    extractFirstName(fullName) {
        if (!fullName) return '';
        return fullName.split(' ')[0].trim();
    }
    
    // Get personalized greeting based on time of day
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        const name = this.firstName;
        
        let greeting = '';
        let emoji = '';
        
        if (hour >= 5 && hour < 12) {
            greeting = name ? `Good morning, ${name}!` : 'Good morning!';
            emoji = '☀️';
        } else if (hour >= 12 && hour < 17) {
            greeting = name ? `Good afternoon, ${name}!` : 'Good afternoon!';
            emoji = '🌤️';
        } else if (hour >= 17 && hour < 22) {
            greeting = name ? `Good evening, ${name}!` : 'Good evening!';
            emoji = '🌙';
        } else {
            greeting = name ? `Hello, ${name}!` : 'Hello!';
            emoji = '✨';
        }
        
        return { greeting, emoji };
    }
    
    // Update all greeting elements on the page
    updateAllGreetings() {
        const { greeting, emoji } = this.getTimeBasedGreeting();
        
        // Update home greeting if it exists
        const homeGreeting = document.getElementById('home-greeting');
        if (homeGreeting) {
            homeGreeting.innerHTML = `<span style="font-size: 32px; margin-right: 8px;">${emoji}</span> ${greeting}`;
        }
        
        // Update any other personalized elements
        this.updatePersonalizedElements();
    }
    
    // Update all elements with class 'personalized'
    updatePersonalizedElements() {
        const elements = document.querySelectorAll('.personalized-name');
        elements.forEach(el => {
            el.textContent = this.firstName || 'there';
        });
    }
    
    // Get congratulations message
    getCongratulationsMessage(context = 'general') {
        const name = this.firstName;
        const messages = {
            quiz: [
                name ? `🎉 Congratulations, ${name}!` : '🎉 Congratulations!',
                name ? `Outstanding work, ${name}!` : '🌟 Outstanding work!',
                name ? `Excellent job, ${name}!` : '✨ Excellent job!',
                name ? `Way to go, ${name}!` : '🎯 Way to go!',
                name ? `You're crushing it, ${name}!` : '💪 You\'re crushing it!'
            ],
            exam: [
                name ? `🎓 Incredible, ${name}! You passed!` : '🎓 Incredible! You passed!',
                name ? `🏆 Phenomenal work, ${name}!` : '🏆 Phenomenal work!',
                name ? `👏 Brilliant performance, ${name}!` : '👏 Brilliant performance!',
                name ? `💫 You did it, ${name}!` : '💫 You did it!',
                name ? `🌟 Outstanding, ${name}!` : '🌟 Outstanding!'
            ],
            milestone: [
                name ? `🎊 Amazing milestone, ${name}!` : '🎊 Amazing milestone!',
                name ? `🚀 Keep it up, ${name}!` : '🚀 Keep it up!',
                name ? `⭐ You're making great progress, ${name}!` : '⭐ Great progress!',
                name ? `🔥 On fire, ${name}!` : '🔥 On fire!',
                name ? `💎 Fantastic, ${name}!` : '💎 Fantastic!'
            ],
            achievement: [
                name ? `🏅 Achievement unlocked, ${name}!` : '🏅 Achievement unlocked!',
                name ? `✨ New achievement, ${name}!` : '✨ New achievement!',
                name ? `🎯 Level up, ${name}!` : '🎯 Level up!',
                name ? `💪 Well earned, ${name}!` : '💪 Well earned!'
            ],
            streak: [
                name ? `🔥 ${name}, you're on a roll!` : '🔥 You\'re on a roll!',
                name ? `⚡ Unstoppable, ${name}!` : '⚡ Unstoppable!',
                name ? `💫 Consistent excellence, ${name}!` : '💫 Consistent excellence!',
                name ? `🌟 Keep the streak alive, ${name}!` : '🌟 Keep the streak alive!'
            ]
        };
        
        const contextMessages = messages[context] || messages.quiz;
        return contextMessages[Math.floor(Math.random() * contextMessages.length)];
    }
    
    // Get encouragement message (for when user doesn't pass)
    getEncouragementMessage() {
        const name = this.firstName;
        const messages = [
            name ? `Keep going, ${name}! You're learning and improving! 💪` : 'Keep going! You\'re learning and improving! 💪',
            name ? `Don't give up, ${name}! Every attempt makes you stronger! 🌟` : 'Don\'t give up! Every attempt makes you stronger! 🌟',
            name ? `${name}, you've got this! Review and try again! 📚` : 'You\'ve got this! Review and try again! 📚',
            name ? `Progress over perfection, ${name}! Keep studying! ⭐` : 'Progress over perfection! Keep studying! ⭐',
            name ? `${name}, learning takes time. You're on the right path! 🎯` : 'Learning takes time. You\'re on the right path! 🎯'
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Get motivational quote with name
    getMotivationalQuote() {
        const name = this.firstName;
        const quotes = [
            {
                text: name ? `${name}, every expert was once a beginner!` : 'Every expert was once a beginner!',
                emoji: '🌱'
            },
            {
                text: name ? `Success is the sum of small efforts, ${name}!` : 'Success is the sum of small efforts!',
                emoji: '📚'
            },
            {
                text: name ? `${name}, you're one step closer to your goal!` : 'You\'re one step closer to your goal!',
                emoji: '🎯'
            },
            {
                text: name ? `Believe in yourself, ${name}!` : 'Believe in yourself!',
                emoji: '⭐'
            },
            {
                text: name ? `${name}, your dedication will pay off!` : 'Your dedication will pay off!',
                emoji: '🏆'
            }
        ];
        
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    // Get study recommendation with name
    getStudyRecommendation(topicName) {
        const name = this.firstName;
        const prefix = name ? `${name}, ` : '';
        
        return {
            title: `${prefix}Time to focus on ${topicName}`,
            message: `${prefix}Let's strengthen your understanding of ${topicName}. You're making great progress!`
        };
    }
    
    // Get welcome back message
    getWelcomeBackMessage() {
        const name = this.firstName;
        const hour = new Date().getHours();
        
        let message = '';
        
        if (hour >= 5 && hour < 12) {
            message = name ? `Good morning, ${name}! Ready to learn?` : 'Good morning! Ready to learn?';
        } else if (hour >= 12 && hour < 17) {
            message = name ? `Welcome back, ${name}! Let's continue your progress!` : 'Welcome back! Let\'s continue your progress!';
        } else if (hour >= 17 && hour < 22) {
            message = name ? `Good evening, ${name}! Time for some studying!` : 'Good evening! Time for some studying!';
        } else {
            message = name ? `Hello ${name}! Dedicated to late-night studying!` : 'Hello! Dedicated to late-night studying!';
        }
        
        return message;
    }
    
    // Get personalized exam result message
    getExamResultMessage(passed, score) {
        const name = this.firstName;
        
        if (passed) {
            return {
                title: this.getCongratulationsMessage('exam'),
                message: name ? 
                    `${name}, you passed with ${score}%! Your hard work paid off! 🎓` :
                    `You passed with ${score}%! Your hard work paid off! 🎓`
            };
        } else {
            return {
                title: name ? `${name}, keep practicing!` : 'Keep practicing!',
                message: name ? 
                    `${name}, you scored ${score}%. Review the material and try again. You've got this! 💪` :
                    `You scored ${score}%. Review the material and try again. You've got this! 💪`
            };
        }
    }
    
    // Get personalized quiz result message
    getQuizResultMessage(score, totalQuestions) {
        const name = this.firstName;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        if (percentage >= 90) {
            return name ? 
                `🎉 Excellent, ${name}! You scored ${score}/${totalQuestions} (${percentage}%)!` :
                `🎉 Excellent! You scored ${score}/${totalQuestions} (${percentage}%)!`;
        } else if (percentage >= 80) {
            return name ? 
                `👍 Great job, ${name}! You scored ${score}/${totalQuestions} (${percentage}%)!` :
                `👍 Great job! You scored ${score}/${totalQuestions} (${percentage}%)!`;
        } else if (percentage >= 70) {
            return name ? 
                `✅ Good work, ${name}! You scored ${score}/${totalQuestions} (${percentage}%)!` :
                `✅ Good work! You scored ${score}/${totalQuestions} (${percentage}%)!`;
        } else {
            return name ? 
                `📚 ${name}, you scored ${score}/${totalQuestions} (${percentage}%). Review and try again!` :
                `📚 You scored ${score}/${totalQuestions} (${percentage}%). Review and try again!`;
        }
    }
    
    // Check if user has a name
    hasName() {
        return this.firstName.length > 0;
    }
    
    // Get user's first name (or empty string)
    getFirstName() {
        return this.firstName;
    }
    
    // Get user's full name (or empty string)
    getFullName() {
        return this.userName;
    }
}

// Create global instance
const personalization = new PersonalizationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = personalization;
}

