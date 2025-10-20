// In-App Rating System - 5-Star Feedback & Reviews
// A product of Bradley Virtual Solutions, LLC

class RatingSystem {
    constructor() {
        this.hasRated = false;
        this.userRating = null;
        this.ratingData = {
            totalRatings: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
        
        // Trigger conditions for rating prompt
        this.triggerConditions = {
            questionsAnswered: 50,  // After 50 questions
            studyTime: 120,         // After 2 hours study time
            daysUsed: 7,            // After using for 7 days
            level: 5                // After reaching level 5
        };
        
        // Load state
        this.loadState();
    }
    
    // Load rating state
    loadState() {
        const saved = localStorage.getItem('appRating');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.hasRated = state.hasRated || false;
                this.userRating = state.userRating || null;
            } catch (e) {
                console.error('Error loading rating state:', e);
            }
        }
        
        // Load aggregate ratings from Firebase
        this.loadAggregateRatings();
        
        // Display rating after a brief delay to ensure DOM is ready
        setTimeout(() => this.displayAggregateRating('app-rating-display'), 1000);
    }
    
    // Save rating state
    saveState() {
        const state = {
            hasRated: this.hasRated,
            userRating: this.userRating,
            ratedAt: new Date().toISOString()
        };
        localStorage.setItem('appRating', JSON.stringify(state));
    }
    
    // Check if should show rating prompt
    shouldShowPrompt() {
        // Don't show if already rated
        if (this.hasRated) return false;
        
        // Don't show if dismissed recently
        const dismissed = localStorage.getItem('ratingDismissed');
        if (dismissed) {
            const dismissedTime = new Date(dismissed);
            const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
            if (daysSince < 7) return false; // Wait 7 days before asking again
        }
        
        // Check trigger conditions
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        const gamificationData = JSON.parse(localStorage.getItem('gamificationData') || '{}');
        
        // Trigger 1: After 50 questions
        if (userData.questionsAnswered >= this.triggerConditions.questionsAnswered) {
            return true;
        }
        
        // Trigger 2: After 2 hours study time
        if (userData.studyTime >= this.triggerConditions.studyTime) {
            return true;
        }
        
        // Trigger 3: After 7-day streak
        if (gamificationData.streak >= this.triggerConditions.daysUsed) {
            return true;
        }
        
        // Trigger 4: After reaching level 5
        if (gamificationData.level >= this.triggerConditions.level) {
            return true;
        }
        
        return false;
    }
    
    // Show rating prompt
    showRatingPrompt() {
        if (!this.shouldShowPrompt()) return;
        
        this.createAndShowModal();
    }
    
    // Force show rating modal (for manual button click)
    showRatingModal() {
        this.createAndShowModal();
    }
    
    // Create and show the modal
    createAndShowModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'rating-modal';
        modal.className = 'modal-overlay rating-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            padding: 20px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div class="rating-card" style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 480px;
                width: 100%;
                box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease-out;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎓</div>
                    <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                        Enjoying ABA Mastery?
                    </h2>
                    <p style="margin: 0 0 24px 0; color: #64748b; font-size: 16px;">
                        Your feedback helps us improve and helps others discover the app!
                    </p>
                    
                    <div id="star-rating" class="star-rating" style="
                        display: flex;
                        justify-content: center;
                        gap: 8px;
                        margin-bottom: 24px;
                        font-size: 48px;
                    ">
                        <span class="star" data-value="1">☆</span>
                        <span class="star" data-value="2">☆</span>
                        <span class="star" data-value="3">☆</span>
                        <span class="star" data-value="4">☆</span>
                        <span class="star" data-value="5">☆</span>
                    </div>
                    
                    <div id="rating-message" style="
                        min-height: 24px;
                        margin-bottom: 16px;
                        font-size: 14px;
                        color: #64748b;
                    "></div>
                    
                    <textarea id="rating-feedback" placeholder="Share your thoughts (optional)..." style="
                        width: 100%;
                        min-height: 80px;
                        padding: 12px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-family: inherit;
                        font-size: 14px;
                        resize: vertical;
                        margin-bottom: 20px;
                        display: none;
                    "></textarea>
                    
                    <div style="display: flex; gap: 12px;">
                        <button id="submit-rating" class="btn btn-primary" style="
                            flex: 1;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: transform 0.2s;
                            display: none;
                        " onmouseover="this.style.transform='translateY(-2px)'" 
                           onmouseout="this.style.transform='translateY(0)'">
                            Submit Rating
                        </button>
                        <button id="dismiss-rating" class="btn btn-secondary" style="
                            flex: 1;
                            background: #f1f5f9;
                            color: #64748b;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='translateY(-2px)'" 
                           onmouseout="this.style.transform='translateY(0)'">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add animations
        this.addAnimations();
        
        // Setup star interactions
        this.setupStarRating(modal);
        
        // Setup buttons
        document.getElementById('submit-rating').addEventListener('click', () => this.submitRating(modal));
        document.getElementById('dismiss-rating').addEventListener('click', () => this.dismissPrompt(modal));
    }
    
    // Setup star rating interaction
    setupStarRating(modal) {
        const stars = modal.querySelectorAll('.star');
        let selectedRating = 0;
        
        stars.forEach(star => {
            // Hover effect
            star.addEventListener('mouseenter', (e) => {
                const value = parseInt(e.target.dataset.value);
                this.highlightStars(stars, value);
            });
            
            // Click to select
            star.addEventListener('click', (e) => {
                selectedRating = parseInt(e.target.dataset.value);
                this.selectRating(stars, selectedRating);
                
                // Show feedback textarea and submit button
                document.getElementById('rating-feedback').style.display = 'block';
                document.getElementById('submit-rating').style.display = 'block';
                
                // Show message based on rating
                this.showRatingMessage(selectedRating);
            });
        });
        
        // Reset on mouse leave
        modal.querySelector('.star-rating').addEventListener('mouseleave', () => {
            if (selectedRating > 0) {
                this.highlightStars(stars, selectedRating);
            } else {
                this.highlightStars(stars, 0);
            }
        });
    }
    
    // Highlight stars
    highlightStars(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.textContent = '★';
                star.style.color = '#fbbf24';
            } else {
                star.textContent = '☆';
                star.style.color = '#cbd5e1';
            }
        });
    }
    
    // Select rating
    selectRating(stars, count) {
        this.userRating = count;
        this.highlightStars(stars, count);
        
        // Make selected stars permanent
        stars.forEach(star => {
            star.style.cursor = 'pointer';
        });
    }
    
    // Show message based on rating
    showRatingMessage(rating) {
        const messages = {
            1: '😢 We\'re sorry you\'re not satisfied. Please tell us how we can improve!',
            2: '😕 Thanks for your feedback. How can we make this better?',
            3: '🙂 Good! We\'d love to hear your suggestions for improvement.',
            4: '😊 Great! What do you love most about ABA Mastery?',
            5: '🎉 Amazing! Thank you! We\'d love to hear what makes it special for you!'
        };
        
        const messageEl = document.getElementById('rating-message');
        if (messageEl) {
            messageEl.textContent = messages[rating] || '';
            messageEl.style.color = rating >= 4 ? '#10b981' : rating >= 3 ? '#f59e0b' : '#ef4444';
        }
    }
    
    // Submit rating
    async submitRating(modal) {
        if (!this.userRating) {
            alert('Please select a rating');
            return;
        }
        
        const feedback = document.getElementById('rating-feedback').value;
        
        // Save rating
        const ratingData = {
            rating: this.userRating,
            feedback: feedback,
            timestamp: new Date().toISOString(),
            userData: this.getUserContext()
        };
        
        // Save to Firebase if signed in
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            await this.saveToFirebase(ratingData);
        }
        
        // Save locally
        this.hasRated = true;
        this.saveState();
        
        // Show thank you message
        this.showThankYou(modal, this.userRating);
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'app_rating', {
                rating: this.userRating,
                has_feedback: !!feedback
            });
        }
    }
    
    // Get user context for rating
    getUserContext() {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        const gamificationData = JSON.parse(localStorage.getItem('gamificationData') || '{}');
        
        return {
            questionsAnswered: userData.questionsAnswered || 0,
            accuracy: userData.questionsAnswered > 0 
                ? Math.round((userData.correctAnswers / userData.questionsAnswered) * 100) 
                : 0,
            studyTime: userData.studyTime || 0,
            level: gamificationData.level || 1,
            streak: gamificationData.streak || 0
        };
    }
    
    // Save to Firebase
    async saveToFirebase(ratingData) {
        try {
            const db = firebase.firestore();
            const user = firebase.auth().currentUser;
            
            // Save individual rating
            await db.collection('ratings').add({
                ...ratingData,
                userId: user ? user.uid : 'anonymous',
                userEmail: user ? user.email : null,
                version: '1.0.0',
                platform: navigator.platform,
                browser: navigator.userAgent
            });
            
            // Update aggregate stats
            await this.updateAggregateStats(ratingData.rating);
            
            console.log('✅ Rating saved to Firebase');
        } catch (error) {
            console.error('❌ Error saving rating:', error);
        }
    }
    
    // Update aggregate stats
    async updateAggregateStats(rating) {
        try {
            const db = firebase.firestore();
            const statsRef = db.collection('appStats').doc('ratings');
            
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(statsRef);
                
                if (!doc.exists) {
                    transaction.set(statsRef, {
                        totalRatings: 1,
                        sumRatings: rating,
                        averageRating: rating,
                        distribution: {
                            1: rating === 1 ? 1 : 0,
                            2: rating === 2 ? 1 : 0,
                            3: rating === 3 ? 1 : 0,
                            4: rating === 4 ? 1 : 0,
                            5: rating === 5 ? 1 : 0
                        }
                    });
                } else {
                    const data = doc.data();
                    const newTotal = (data.totalRatings || 0) + 1;
                    const newSum = (data.sumRatings || 0) + rating;
                    const newAverage = newSum / newTotal;
                    const distribution = data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                    distribution[rating] = (distribution[rating] || 0) + 1;
                    
                    transaction.update(statsRef, {
                        totalRatings: newTotal,
                        sumRatings: newSum,
                        averageRating: newAverage,
                        distribution
                    });
                }
            });
        } catch (error) {
            console.error('Error updating aggregate stats:', error);
        }
    }
    
    // Load aggregate ratings
    async loadAggregateRatings() {
        if (typeof firebase === 'undefined' || !firebase.firestore) return;
        
        try {
            const db = firebase.firestore();
            const doc = await db.collection('appStats').doc('ratings').get();
            
            if (doc.exists) {
                const data = doc.data();
                this.ratingData = {
                    totalRatings: data.totalRatings || 0,
                    averageRating: data.averageRating || 0,
                    ratingDistribution: data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                };
                
                // Update display after loading
                this.displayAggregateRating('app-rating-display');
            }
        } catch (error) {
            // Silently handle if document doesn't exist yet (no ratings yet)
            if (error.code !== 'permission-denied') {
                console.error('Error loading aggregate ratings:', error);
            }
        }
    }
    
    // Show thank you message
    showThankYou(modal, rating) {
        const card = modal.querySelector('.rating-card');
        
        let message = '';
        let emoji = '';
        
        if (rating >= 5) {
            emoji = '🎉';
            message = 'Thank you so much! Your 5-star rating means the world to us!';
        } else if (rating >= 4) {
            emoji = '😊';
            message = 'Thank you for your rating! We appreciate your support!';
        } else {
            emoji = '🙏';
            message = 'Thank you for your honest feedback. We\'ll work hard to improve!';
        }
        
        card.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 72px; margin-bottom: 16px;">${emoji}</div>
                <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
                    ${message}
                </h2>
                <p style="margin: 0 0 24px 0; color: #64748b; font-size: 16px;">
                    Your feedback has been saved and will help us make ABA Mastery even better!
                </p>
                <button onclick="document.getElementById('rating-modal').remove()" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Continue Studying
                </button>
            </div>
        `;
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 3000);
    }
    
    // Dismiss prompt
    dismissPrompt(modal) {
        localStorage.setItem('ratingDismissed', new Date().toISOString());
        modal.remove();
    }
    
    // Add CSS animations
    addAnimations() {
        if (document.getElementById('rating-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'rating-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .star {
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }
            .star:hover {
                transform: scale(1.2);
            }
            .star:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Get aggregate rating display
    getAggregateDisplay() {
        if (this.ratingData.totalRatings === 0) {
            return {
                average: 0,
                total: 0,
                stars: '☆☆☆☆☆',
                display: 'No ratings yet'
            };
        }
        
        const avg = this.ratingData.averageRating;
        const fullStars = Math.floor(avg);
        const hasHalfStar = (avg - fullStars) >= 0.5;
        
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '★';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '⭐';
            } else {
                stars += '☆';
            }
        }
        
        return {
            average: avg.toFixed(1),
            total: this.ratingData.totalRatings,
            stars,
            display: `${avg.toFixed(1)} ★ (${this.ratingData.totalRatings} ratings)`
        };
    }
    
    // Display aggregate rating in UI
    displayAggregateRating(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const display = this.getAggregateDisplay();
        
        element.innerHTML = `
            <div class="aggregate-rating">
                <div class="rating-stars" style="font-size: 24px; color: #fbbf24; margin-bottom: 4px;">
                    ${display.stars}
                </div>
                <div class="rating-text" style="font-size: 14px; color: #64748b;">
                    ${display.display}
                </div>
            </div>
        `;
    }
}

// Create global instance
const ratingSystem = new RatingSystem();

// Auto-check for rating prompt on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (ratingSystem.shouldShowPrompt()) {
                ratingSystem.showRatingPrompt();
            }
        }, 5000); // Wait 5 seconds before showing
    });
} else {
    setTimeout(() => {
        if (ratingSystem.shouldShowPrompt()) {
            ratingSystem.showRatingPrompt();
        }
    }, 5000);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ratingSystem;
}

