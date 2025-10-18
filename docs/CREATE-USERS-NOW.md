# 🔥 Create Firebase Test Users - Quick Guide

## ✅ Email/Password Authentication: ENABLED

Great! Now follow these steps:

---

## 📥 STEP 1: Download Service Account Key

The Firebase Console should be open. If not, go here:
https://console.firebase.google.com/project/aba-mastery-app/settings/serviceaccounts/adminsdk

**On that page:**

1. You'll see **"Firebase Admin SDK"** section
2. Make sure **"Node.js"** is selected
3. Click the button: **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. A JSON file will download (something like `aba-mastery-app-firebase-adminsdk-xxxxx.json`)

---

## 📂 STEP 2: Rename and Move the File

After downloading:

1. **Rename** the downloaded file to: `firebase-service-account.json`
2. **Move** it to: `/Users/ronellbradley/Desktop/ABA Mastery/`

**Or use Terminal:**

```bash
# If the file downloaded to ~/Downloads, run:
mv ~/Downloads/aba-mastery-app-*.json "/Users/ronellbradley/Desktop/ABA Mastery/firebase-service-account.json"
```

---

## 🗄️ STEP 3: Enable Firestore (if not done)

1. Go to: https://console.firebase.google.com/project/aba-mastery-app/firestore
2. If Firestore not enabled:
   - Click **"Create database"**
   - Choose **"Start in production mode"**
   - Select location: **us-central1** (or your preference)
   - Click **"Enable"**

---

## 🚀 STEP 4: Create Test Users

Once the service account file is in place:

```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
node add-firebase-users.js
```

**This will create:**

### 👤 User 1: Sarah Johnson
- Email: `sarah.johnson@abamastery.test`
- Password: `Test123456!`
- 45 questions answered, 84% accuracy

### 👤 User 2: Michael Chen  
- Email: `michael.chen@abamastery.test`
- Password: `Test123456!`
- 120 questions answered, 82% accuracy

### 👤 User 3: Emily Rodriguez
- Email: `emily.rodriguez@abamastery.test`
- Password: `Test123456!`
- 15 questions answered, 67% accuracy

---

## ✅ STEP 5: Verify Users Created

After running the script:

1. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com/project/aba-mastery-app/authentication/users
   - You should see 3 users listed

2. **Check Firestore:**
   - Go to: https://console.firebase.google.com/project/aba-mastery-app/firestore/data
   - You should see `users` collection with 3 documents

---

## 🧪 STEP 6: Test Login on Your Live App

1. Go to: https://aba-mastery-app.web.app
2. Click **"Login"**
3. Enter:
   - Email: `sarah.johnson@abamastery.test`
   - Password: `Test123456!`
4. Click **"Sign In"**

**Note**: You'll need to integrate Firebase Auth SDK in the landing page first for login to actually work. The users will be created in Firebase, but the login UI needs to be connected.

---

## 🔧 Quick Troubleshooting

### **"Cannot find module 'firebase-service-account.json'"**
- Make sure the file is named exactly: `firebase-service-account.json`
- Make sure it's in the project root directory
- Check with: `ls -la firebase-service-account.json`

### **"Permission denied" or "Authentication required"**
- Make sure you downloaded the correct service account
- Verify the JSON file has your project credentials
- Check you're logged into Firebase: `firebase login`

### **"Firestore not initialized"**
- Enable Firestore in Firebase Console first
- Go to Firestore Database section
- Click "Create database"

---

## 🎯 Quick Commands

```bash
# Check if service account exists
ls -la firebase-service-account.json

# Move downloaded file from Downloads
mv ~/Downloads/aba-mastery-app-*.json firebase-service-account.json

# Create test users
node add-firebase-users.js

# Check Firebase users in console
open "https://console.firebase.google.com/project/aba-mastery-app/authentication/users"
```

---

**Ready when you are!** Just download the service account key and run the script. 🚀

