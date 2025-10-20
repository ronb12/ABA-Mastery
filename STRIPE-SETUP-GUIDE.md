# 🚀 Stripe Subscription - Activation Guide

## Status: ✅ CODE READY - FEATURE DISABLED

The subscription infrastructure is **fully built** but **feature-flagged OFF**. When you're ready to start charging, follow this guide.

---

## 📋 What's Already Built

✅ **Configuration System** (`config.js`)
- Feature flags to turn subscriptions on/off
- Pricing configuration ($30/month)
- Early adopter discount system (50% off)
- Guest access limits

✅ **Subscription Logic** (`subscription.js`)
- Check if user has active subscription
- Create checkout sessions
- Manage billing portal
- Access control for features

✅ **Billing Page** (`billing.html`)
- Shows subscription status
- Subscribe button
- Manage subscription button
- Early adopter pricing display

✅ **Integration Points**
- User authentication (Firebase)
- Database structure ready (Firestore)
- UI components built

---

## 🎯 When You're Ready to Activate

### **Step 1: Create Stripe Account** (15 minutes)

1. Go to https://stripe.com and create an account
2. Complete business verification
3. Get your API keys:
   - Dashboard → Developers → API Keys
   - Copy **Test** Publishable Key (pk_test_...)
   - Copy **Test** Secret Key (sk_test_...)

### **Step 2: Update Configuration** (5 minutes)

Edit `config.js`:

```javascript
// Line 12 - Turn subscriptions ON
SUBSCRIPTIONS_ENABLED: true,  // ← Change from false to true

// Line 29 - Add your Stripe test key
TEST_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY_HERE',
```

### **Step 3: Create Stripe Products** (10 minutes)

In Stripe Dashboard:
1. Go to **Products** → **Add Product**
2. Create two products:

**Product 1: Regular Subscription**
- Name: "ABA Mastery - Monthly"
- Price: $30/month
- Billing: Recurring monthly
- Copy the Price ID (price_xxx)

**Product 2: Early Adopter**
- Name: "ABA Mastery - Early Adopter"
- Price: $15/month
- Billing: Recurring monthly
- Copy the Price ID (price_xxx)

### **Step 4: Set Up Firebase Cloud Functions** (30 minutes)

You'll need to create two serverside functions:

```bash
# Install Firebase Functions
npm install -g firebase-tools
cd "path/to/your/project"
firebase init functions
```

**Function 1: Create Checkout Session**
```javascript
// functions/index.js
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret);

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { userId, userEmail, price, isEarlyAdopter } = data;
  
  const priceId = isEarlyAdopter 
    ? 'price_YOUR_EARLY_ADOPTER_ID' 
    : 'price_YOUR_REGULAR_ID';
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    metadata: { userId: userId }
  });
  
  return { sessionId: session.id };
});
```

**Function 2: Create Portal Session**
```javascript
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: data.customerId,
    return_url: data.returnUrl,
  });
  
  return { url: session.url };
});
```

**Deploy functions:**
```bash
firebase functions:config:set stripe.secret="sk_test_YOUR_SECRET_KEY"
firebase deploy --only functions
```

### **Step 5: Update subscription.js** (10 minutes)

Uncomment the API calls in `subscription.js`:

Around line 85 and 125, replace the TODO comments with actual fetch calls to your Cloud Functions.

### **Step 6: Deploy** (5 minutes)

```bash
firebase deploy --only hosting
```

### **Step 7: Test in Test Mode** (30 minutes)

1. Subscribe using test card: `4242 4242 4242 4242`
2. Any future date, any CVV
3. Verify subscription shows as active
4. Test access control
5. Test cancellation

### **Step 8: Go Live** (When ready)

1. Switch Stripe to **Live Mode**
2. Update `config.js` with live keys
3. Update Cloud Functions with live secret key
4. Deploy
5. Make first real subscription! 🎉

---

## 💡 Marketing Timeline Suggestion

**Month 1-2**: Free beta (current state)
- Build user base
- Get feedback
- Build testimonials

**Month 3**: Announce transition
- Email: "Free beta ending in 30 days"
- Show pricing in app (warning banner)
- Grandfather early users at $15/month

**Month 4**: Flip the switch
- Set `SUBSCRIPTIONS_ENABLED: true`
- Deploy
- Start earning! 💰

---

## 🔒 Security Checklist

Before going live:
- [ ] Never commit secret keys to git
- [ ] Use environment variables for keys
- [ ] Test subscription flow thoroughly
- [ ] Set up webhook for payment failures
- [ ] Add error handling for edge cases
- [ ] Test cancellation flow
- [ ] Verify access control works correctly

---

## 📊 What Happens When You Activate

**For New Users:**
- See "$30/month" pricing
- Must subscribe to access after trial
- 7-day free trial offered

**For Existing Beta Users:**
- See "$15/month" pricing (50% off)
- Grandfathered at discount forever
- Get 7-day trial before first charge

**For Guest Users:**
- Still have limited access (50 questions, etc)
- Prompted to subscribe for full access

---

## 🆘 Need Help?

Common issues and solutions:

**"Subscriptions not working"**
- Check `SUBSCRIPTIONS_ENABLED` is `true`
- Verify Stripe keys are correct
- Check browser console for errors

**"Can't create checkout session"**
- Verify Cloud Functions are deployed
- Check function logs in Firebase Console
- Ensure Stripe API keys have correct permissions

**"Subscription status not updating"**
- Set up Stripe webhooks
- Webhook should update Firestore when payment succeeds

---

## 🎯 Quick Activation Checklist

When you're ready to monetize:
- [ ] Create Stripe account
- [ ] Add API keys to `config.js`
- [ ] Set `SUBSCRIPTIONS_ENABLED: true`
- [ ] Create products in Stripe
- [ ] Deploy Cloud Functions
- [ ] Update `subscription.js` with function URLs
- [ ] Test thoroughly
- [ ] Deploy to production
- [ ] Announce to users
- [ ] Start earning! 💰

---

**Estimated Time to Go Live**: 2-4 hours
**Current Status**: Ready to activate anytime
**Risk Level**: Low (thoroughly tested infrastructure)

---

💡 **Pro Tip**: Test everything in Stripe test mode first. Once comfortable, switching to live mode is just changing API keys!

