# Firebase Test Users Setup Guide

## 🔥 Adding Test Users to Firebase

This guide walks you through creating test users in Firebase Authentication and Firestore.

---

## 📋 Prerequisites

Before creating test users, you need to:

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **aba-mastery-app**
3. Click **Authentication** in the left menu
4. Click **Get started**
5. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### 2. Enable Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll deploy rules later)
4. Select a location (closest to your users)
5. Click **Enable**

### 3. Get Service Account Key (For Script Method)

1. Go to **Project Settings** (gear icon)
2. Go to **Service accounts** tab
3. Click **Generate new private key**
4. Save the file as `firebase-service-account.json` in your project root

---

## 🚀 Method 1: Automated Script (Recommended)

### **Step 1: Install Dependencies**

```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
npm install firebase-admin --save-dev
```

### **Step 2: Add Service Account Key**

Place the `firebase-service-account.json` file in your project root.

### **Step 3: Run the Script**

```bash
node add-firebase-users.js
```

This will create 3 test users:

1. **Sarah Johnson** - sarah.johnson@abamastery.test
2. **Michael Chen** - michael.chen@abamastery.test  
3. **Emily Rodriguez** - emily.rodriguez@abamastery.test

**Password for all**: `Test123456!`

---

## 📝 Method 2: Manual Creation via Firebase Console

### **Create Users Manually:**

1. Go to **Authentication** > **Users** tab
2. Click **Add user**
3. Enter email and password
4. Click **Add user**

### **Test User 1: Sarah Johnson (Moderate Progress)**
- **Email**: sarah.johnson@abamastery.test
- **Password**: Test123456!
- **Profile**: Intermediate student

### **Test User 2: Michael Chen (Advanced User)**
- **Email**: michael.chen@abamastery.test
- **Password**: Test123456!
- **Profile**: Advanced student

### **Test User 3: Emily Rodriguez (Beginner)**
- **Email**: emily.rodriguez@abamastery.test
- **Password**: Test123456!
- **Profile**: New student

---

## 📊 Test User Data

### **User 1: Sarah Johnson**
```javascript
{
  email: 'sarah.johnson@abamastery.test',
  questionsAnswered: 45,
  correctAnswers: 38,
  accuracy: 84%,
  studyTime: 120 minutes,
  topicsStudied: 6
}
```

### **User 2: Michael Chen**
```javascript
{
  email: 'michael.chen@abamastery.test',
  questionsAnswered: 120,
  correctAnswers: 98,
  accuracy: 82%,
  studyTime: 350 minutes,
  topicsStudied: 17
}
```

### **User 3: Emily Rodriguez**
```javascript
{
  email: 'emily.rodriguez@abamastery.test',
  questionsAnswered: 15,
  correctAnswers: 10,
  accuracy: 67%,
  studyTime: 45 minutes,
  topicsStudied: 2
}
```

---

## 🧪 Testing Login

### **Test on Your Live App:**

1. Go to https://aba-mastery-app.web.app
2. Click "Login"
3. Enter test user credentials:
   - Email: `sarah.johnson@abamastery.test`
   - Password: `Test123456!`
4. Click "Sign In"

### **Test Locally:**

1. Make sure Firebase Auth is integrated in your app
2. Open http://localhost:8001
3. Click "Login"
4. Enter test credentials
5. Verify data syncs from Firestore

---

## 📂 Firestore Data Structure

After running the script, Firestore will have:

```
users/
  {userId}/
    - displayName: "Sarah Johnson"
    - email: "sarah.johnson@abamastery.test"
    - role: "student"
    - createdAt: timestamp
    
    progress/
      main/
        - questionsAnswered: 45
        - correctAnswers: 38
        - studyTime: 120
        - topicsStudied: [...]
        - categoryProgress: {...}
    
    quizResults/
      quiz-{timestamp}/
        - type: "quiz"
        - score: 85
        - questions: 20
        - category: "foundations"
        - timestamp: timestamp
```

---

## 🔒 Security Notes

### **Important:**
- ⚠️ **Never commit** `firebase-service-account.json` to git
- ⚠️ Already added to `.gitignore`
- ⚠️ Keep service account key secure
- ⚠️ These are test accounts - use `.test` email domain

### **Production Users:**
- Use real email addresses
- Require email verification
- Implement proper password policies
- Enable multi-factor authentication (optional)

---

## ✅ Verification

### **Check Firebase Console:**

1. **Authentication > Users**
   - Should see 3 users listed
   - Email verified: Yes
   - Provider: Email/Password

2. **Firestore Database > Data**
   - `users` collection exists
   - Each user has document with UID
   - Subcollections: `progress`, `quizResults`

### **Check in App:**

1. Login with test user
2. View progress dashboard
3. Check study time and stats
4. Verify quiz history

---

## 🔄 Deleting Test Users

### **Via Firebase Console:**
1. Go to **Authentication** > **Users**
2. Click on user email
3. Click **Delete this user**
4. Confirm deletion

### **Via Script:**
Create a delete script:
```javascript
const admin = require('firebase-admin');
// ... initialize admin

async function deleteTestUsers() {
  const emails = [
    'sarah.johnson@abamastery.test',
    'michael.chen@abamastery.test',
    'emily.rodriguez@abamastery.test'
  ];
  
  for (const email of emails) {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
    await admin.firestore().collection('users').doc(user.uid).delete();
    console.log(`Deleted: ${email}`);
  }
}
```

---

## 🚀 Deploy Database Rules

After creating users, deploy your security rules:

```bash
firebase deploy --only firestore,database,storage
```

This will:
- Deploy Firestore security rules
- Deploy Realtime Database rules
- Deploy Storage rules
- Protect user data properly

---

## 📝 Next Steps

After creating test users:

1. ✅ Enable Firebase Authentication
2. ✅ Create test users
3. ✅ Add test data to Firestore
4. ⏭️ Deploy security rules
5. ⏭️ Test login on live app
6. ⏭️ Integrate Auth in frontend
7. ⏭️ Enable Google Sign-In (optional)

---

## 🆘 Troubleshooting

### **Issue: "Permission denied" error**
- **Solution**: Deploy Firestore rules with `firebase deploy --only firestore`

### **Issue: "Service account not found"**
- **Solution**: Download service account key from Firebase Console

### **Issue: "User already exists"**
- **Solution**: Delete existing user or use different email

### **Issue: "Authentication not enabled"**
- **Solution**: Enable Email/Password in Firebase Console > Authentication

---

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs/auth
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Admin SDK**: https://firebase.google.com/docs/admin/setup

---

**Created by**: Bradley Virtual Solutions, LLC  
**Project**: ABA Mastery  
**Date**: October 17, 2025

