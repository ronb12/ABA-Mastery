// ABA Mastery - Subscription Management
// Handles all subscription logic with Stripe

class SubscriptionManager {
    constructor() {
        this.db = null;
        this.auth = null;
        this.stripe = null;
        this.initialized = false;
    }

    // Initialize with Firebase instances
    async initialize(firestore, firebaseAuth) {
        this.db = firestore;
        this.auth = firebaseAuth;
        
        // Only load Stripe if subscriptions are enabled (check if CONFIG exists)
        if (typeof CONFIG !== 'undefined' && CONFIG.shouldShowSubscriptionUI()) {
            await this.loadStripe();
        }
        
        this.initialized = true;
        const status = (typeof CONFIG !== 'undefined' && CONFIG.FEATURES.SUBSCRIPTIONS_ENABLED) ? 'ON' : 'OFF';
        console.log('✅ SubscriptionManager initialized (Subscriptions: ' + status + ')');
    }

    // Load Stripe SDK
    async loadStripe() {
        if (this.stripe) return this.stripe;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => {
                this.stripe = Stripe(CONFIG.getStripeKey());
                console.log('✅ Stripe SDK loaded');
                resolve(this.stripe);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Check if user has active subscription
    async hasActiveSubscription(userId) {
        // If subscriptions are disabled, everyone has "access"
        if (!CONFIG.isSubscriptionRequired()) {
            return true;
        }

        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (!userData) return false;

            // Check for active subscription
            const subStatus = userData.subscriptionStatus;
            const subEnd = userData.subscriptionEndDate;
            
            // Active states
            if (subStatus === 'active' || subStatus === 'trialing') {
                return true;
            }

            // Check if subscription end date is in the future
            if (subEnd && new Date(subEnd) > new Date()) {
                return true;
            }

            // Check if user is grandfathered (early adopter)
            if (userData.isEarlyAdopter || userData.grandfathered) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    }

    // Get user's subscription details
    async getSubscriptionDetails(userId) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (!userData) return null;

            const createdDate = userData.createdAt || new Date();
            const isEarlyAdopter = CONFIG.GRANDFATHERING.isEarlyAdopter(createdDate);
            const price = CONFIG.GRANDFATHERING.getPrice(createdDate);

            return {
                status: userData.subscriptionStatus || 'none',
                plan: userData.subscriptionPlan || 'none',
                price: price,
                isEarlyAdopter: isEarlyAdopter,
                trialEnd: userData.trialEndDate,
                subscriptionEnd: userData.subscriptionEndDate,
                customerId: userData.stripeCustomerId,
                hasAccess: await this.hasActiveSubscription(userId)
            };
        } catch (error) {
            console.error('Error getting subscription details:', error);
            return null;
        }
    }

    // Create checkout session (redirects to Stripe)
    async createCheckoutSession(userId, userEmail) {
        if (!CONFIG.shouldShowSubscriptionUI()) {
            console.log('Subscriptions not enabled yet');
            return;
        }

        try {
            // Get user's pricing tier
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            const createdDate = userData?.createdAt || new Date();
            const price = CONFIG.GRANDFATHERING.getPrice(createdDate);
            const isEarlyAdopter = CONFIG.GRANDFATHERING.isEarlyAdopter(createdDate);

            // In production, this would call a Cloud Function to create the session
            // For now, we'll prepare the data structure
            const sessionData = {
                userId: userId,
                userEmail: userEmail,
                price: price,
                isEarlyAdopter: isEarlyAdopter,
                successUrl: window.location.origin + '/app.html?session=success',
                cancelUrl: window.location.origin + '/app.html?session=cancelled'
            };

            console.log('💳 Would create Stripe checkout session:', sessionData);
            
            // TODO: Call Firebase Cloud Function here
            // const response = await fetch('https://YOUR-FUNCTION-URL/createCheckoutSession', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(sessionData)
            // });
            // const { sessionId } = await response.json();
            // return this.stripe.redirectToCheckout({ sessionId });

            alert('💡 Subscription checkout would open here.\n\n' +
                  'Your price: $' + price + '/month\n' +
                  (isEarlyAdopter ? '🎉 Early Adopter Discount Applied!' : '') +
                  '\n\n(Feature is ready but not active yet)');

        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }

    // Open customer portal (manage subscription, billing, cancel)
    async openCustomerPortal(userId) {
        if (!CONFIG.shouldShowSubscriptionUI()) {
            console.log('Subscriptions not enabled yet');
            return;
        }

        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            
            if (!userData?.stripeCustomerId) {
                alert('No subscription found. Please subscribe first.');
                return;
            }

            // TODO: Call Firebase Cloud Function to create portal session
            // const response = await fetch('https://YOUR-FUNCTION-URL/createPortalSession', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         customerId: userData.stripeCustomerId,
            //         returnUrl: window.location.origin + '/app.html'
            //     })
            // });
            // const { url } = await response.json();
            // window.location.href = url;

            console.log('🔗 Would open Stripe customer portal');
            alert('💡 Billing portal would open here.\n\n' +
                  'You could:\n' +
                  '• Update payment method\n' +
                  '• View invoices\n' +
                  '• Cancel subscription\n\n' +
                  '(Feature is ready but not active yet)');

        } catch (error) {
            console.error('Error opening customer portal:', error);
            throw error;
        }
    }

    // Check access for specific feature
    canAccessFeature(featureName, userSubscriptionData, guestMode = false) {
        // If subscriptions disabled, everyone has access
        if (!CONFIG.isSubscriptionRequired()) {
            return true;
        }

        // If user has active subscription, they can access everything
        if (userSubscriptionData?.hasAccess) {
            return true;
        }

        // Guest mode has limited access
        if (guestMode) {
            return this.canAccessAsGuest(featureName);
        }

        // No subscription, no guest mode = no access
        return false;
    }

    // Check what guests can access
    canAccessAsGuest(featureName) {
        if (!CONFIG.ACCESS.GUEST_MODE_ENABLED) {
            return false;
        }

        // Define what features guests can access
        const guestAllowedFeatures = [
            'limited-questions',
            'limited-flashcards', 
            'limited-scenarios',
            'progress-view',
            'study-materials-view'
        ];

        return guestAllowedFeatures.includes(featureName);
    }

    // Get remaining guest credits
    getGuestLimits() {
        return {
            questions: CONFIG.ACCESS.GUEST_QUESTION_LIMIT,
            flashcards: CONFIG.ACCESS.GUEST_FLASHCARD_LIMIT,
            scenarios: CONFIG.ACCESS.GUEST_SCENARIO_LIMIT
        };
    }
}

// Create singleton instance
const subscriptionManager = new SubscriptionManager();

// Helper function to show subscription prompt
function showSubscriptionPrompt(featureName = 'this feature') {
    if (!CONFIG.shouldShowSubscriptionUI()) {
        return; // Don't show if subscriptions aren't enabled
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 16px; max-width: 500px; text-align: center;">
            <h2 style="margin-bottom: 16px; font-size: 28px;">🔒 Premium Feature</h2>
            <p style="margin-bottom: 24px; font-size: 16px; color: #64748b;">
                Subscribe to access ${featureName} and all premium content.
            </p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <div style="font-size: 36px; font-weight: bold; margin-bottom: 8px;">
                    $30<span style="font-size: 18px; font-weight: normal;">/month</span>
                </div>
                <div style="font-size: 14px; color: #64748b;">7-day free trial • Cancel anytime</div>
            </div>
            <button onclick="handleSubscribe()" style="
                width: 100%; padding: 16px; background: #2563eb; color: white;
                border: none; border-radius: 10px; font-size: 16px; font-weight: 600;
                cursor: pointer; margin-bottom: 12px;
            ">Start Free Trial</button>
            <button onclick="this.closest('div').parentElement.remove()" style="
                width: 100%; padding: 16px; background: #f8fafc; color: #1e293b;
                border: 2px solid #e2e8f0; border-radius: 10px; font-size: 16px;
                font-weight: 600; cursor: pointer;
            ">Maybe Later</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Handle subscribe button click
async function handleSubscribe() {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = '/signup.html';
        return;
    }

    try {
        await subscriptionManager.createCheckoutSession(user.uid, user.email);
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Failed to start subscription. Please try again.');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { subscriptionManager, showSubscriptionPrompt, handleSubscribe };
}

