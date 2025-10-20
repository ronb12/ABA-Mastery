// ABA Mastery - Feature Configuration
// Toggle features on/off without code changes

const CONFIG = {
    // Feature Flags
    FEATURES: {
        SUBSCRIPTIONS_ENABLED: false,  // ← SET TO TRUE WHEN READY TO MONETIZE
        FREE_TRIAL_ENABLED: true,
        GRANDFATHER_EARLY_USERS: true  // Give early users special pricing
    },
    
    // Subscription Settings
    SUBSCRIPTION: {
        MONTHLY_PRICE: 30.00,
        CURRENCY: 'usd',
        FREE_TRIAL_DAYS: 7,
        EARLY_ADOPTER_PRICE: 15.00,  // 50% off for beta users
        EARLY_ADOPTER_CUTOFF_DATE: '2025-12-31'  // Users before this date get discount
    },
    
    // Stripe Configuration (will use test keys until production)
    STRIPE: {
        // PUBLIC keys are safe to expose (they only work with your account)
        TEST_PUBLISHABLE_KEY: 'pk_test_PLACEHOLDER',  // Replace when you create Stripe account
        LIVE_PUBLISHABLE_KEY: 'pk_live_PLACEHOLDER',  // Keep this secret until launch
        
        // These go in environment variables or Firebase Functions (never in frontend)
        // TEST_SECRET_KEY: 'sk_test_xxx'  // Server-side only
        // LIVE_SECRET_KEY: 'sk_live_xxx'  // Server-side only
    },
    
    // Access Control
    ACCESS: {
        GUEST_MODE_ENABLED: true,
        GUEST_QUESTION_LIMIT: 50,  // Guests can try 50 questions
        GUEST_FLASHCARD_LIMIT: 100,
        GUEST_SCENARIO_LIMIT: 10
    },
    
    // Grandfathering
    GRANDFATHERING: {
        CUTOFF_DATE: new Date('2025-12-31'),
        isEarlyAdopter: function(userCreatedDate) {
            return new Date(userCreatedDate) <= this.CUTOFF_DATE;
        },
        getPrice: function(userCreatedDate) {
            if (this.isEarlyAdopter(userCreatedDate)) {
                return CONFIG.SUBSCRIPTION.EARLY_ADOPTER_PRICE;
            }
            return CONFIG.SUBSCRIPTION.MONTHLY_PRICE;
        }
    }
};

// Helper Functions
CONFIG.isSubscriptionRequired = function() {
    return this.FEATURES.SUBSCRIPTIONS_ENABLED;
};

CONFIG.getStripeKey = function() {
    // Use test key for development, live key for production
    const isProduction = window.location.hostname === 'aba-mastery-app.web.app';
    return isProduction ? this.STRIPE.LIVE_PUBLISHABLE_KEY : this.STRIPE.TEST_PUBLISHABLE_KEY;
};

CONFIG.shouldShowSubscriptionUI = function() {
    return this.FEATURES.SUBSCRIPTIONS_ENABLED;
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

