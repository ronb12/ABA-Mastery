# 📁 ABA Mastery - Project Structure

**Product of**: Bradley Virtual Solutions, LLC  
**Version**: 1.3.4  
**Date**: October 18, 2025

---

## 🗂️ Organized Folder Structure

```
ABA Mastery/
├── 📄 Core App Files (Root)
│   ├── landing.html          # Landing/welcome page (/)
│   ├── login.html            # Dedicated login page (/login)
│   ├── app.html              # Main study app (/app)
│   ├── app.js                # App logic
│   ├── auth.js               # Authentication module
│   ├── styles.css            # Global styles
│   ├── sw.js                 # Service worker (PWA)
│   ├── content.json          # Study content data
│   └── manifest.json         # PWA manifest
│
├── 🔧 Firebase Config
│   ├── firebase.json         # Hosting & routing config
│   ├── firebase-config.js    # Firebase SDK config
│   ├── firestore.rules       # Firestore security rules
│   ├── firestore.indexes.json # Firestore indexes
│   ├── database.rules.json   # Realtime DB rules
│   └── storage.rules         # Storage security rules
│
├── 📦 Dependencies
│   ├── package.json          # Node dependencies
│   └── package-lock.json     # Locked versions
│
├── 🖼️ Assets
│   └── icons/                # App icons (PWA)
│       ├── icon-72.png
│       ├── icon-96.png
│       ├── icon-128.png
│       ├── icon-144.png
│       ├── icon-152.png
│       ├── icon-192.png
│       ├── icon-384.png
│       ├── icon-512.png
│       └── icon.svg
│
├── 📚 Documentation (docs/)
│   ├── README.md             # Main readme
│   ├── GETTING-STARTED.md    # Setup guide
│   ├── DEDICATED-LOGIN-PAGE-CONFIRMATION.md
│   ├── FIREBASE-USERS-SETUP.md
│   ├── PROFILE-FEATURE-GUIDE.md
│   ├── LOGOUT-BUTTON-SUMMARY.md
│   ├── PAGE-NAVIGATION-FIX.md
│   └── [50+ other documentation files]
│
├── 🧪 Tests (tests/)
│   ├── test-login-page.js
│   ├── test-and-fix-navigation.js
│   ├── test-local-login-logout.js
│   ├── verify-firebase-deployment.js
│   ├── add-firebase-users.js
│   ├── create-test-users.js
│   └── [10+ other test files]
│
├── 📸 Screenshots (screenshots/)
│   ├── app-test-screenshots/
│   ├── login-page-test/
│   ├── logout-button-verification/
│   ├── navigation-test-final/
│   └── [All test result screenshots]
│
└── 📦 Archive (archive/)
    ├── _index.html.bak
    ├── index-landing-backup.html
    ├── calculation-module.html
    ├── QUESTIONS-BATCH-2.json
    └── [Old files and logs]
```

---

## 🎯 Production Files (Root Directory)

### **HTML Pages:**
```
landing.html  - Landing/marketing page
login.html    - Authentication page
app.html      - Main study application
```

### **JavaScript:**
```
app.js        - Main application logic
auth.js       - Authentication module
sw.js         - Service worker (PWA)
```

### **Styles:**
```
styles.css    - Global stylesheets
```

### **Data:**
```
content.json  - Study content (questions, topics)
manifest.json - PWA manifest
```

### **Configuration:**
```
firebase.json         - Firebase hosting config
firebase-config.js    - Firebase SDK config
firestore.rules       - Database security
database.rules.json   - DB rules
storage.rules         - Storage security
```

---

## 📂 Folder Purposes

### **/docs** (Documentation)
- All markdown documentation
- Setup guides
- Feature documentation
- Release notes
- Text summaries

### **/tests** (Testing)
- Puppeteer test scripts
- Firebase user creation scripts
- Verification scripts
- Test utilities

### **/screenshots** (Test Results)
- Screenshot folders from tests
- Visual verification images
- Test result JSON files

### **/archive** (Historical)
- Old/backup files
- Deprecated code
- Test logs
- Batch data files

### **/icons** (Assets)
- PWA app icons
- Various sizes for different devices
- SVG source file

---

## 🚀 Quick Access

### **Start Development:**
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
firebase serve
```

### **Deploy to Production:**
```bash
firebase deploy --only hosting
```

### **Run Tests:**
```bash
node tests/test-login-page.js
node tests/test-and-fix-navigation.js
```

### **View Documentation:**
```bash
open docs/README.md
open docs/GETTING-STARTED.md
```

---

## 📋 File Count Summary

```
Production Files:    ~15 files
Documentation:       ~55 files (docs/)
Tests:               ~15 files (tests/)
Screenshots:         ~60 files (screenshots/)
Archive:             ~15 files (archive/)
Icons:               10 files (icons/)
```

---

## 🎨 Clean Root Directory

The root directory now contains only:
- ✅ Production HTML/JS/CSS files
- ✅ Firebase configuration
- ✅ Package dependencies
- ✅ Content data
- ✅ Organized folders

No clutter! Everything is in its proper place.

---

## 🔍 Finding Files

### **Looking for documentation?**
→ Check `/docs` folder

### **Looking for tests?**
→ Check `/tests` folder

### **Looking for screenshots?**
→ Check `/screenshots` folder

### **Looking for old files?**
→ Check `/archive` folder

---

## 🎯 Key Files Quick Reference

### **Main Application:**
```
app.html  - Main app UI
app.js    - App functionality
auth.js   - Login/logout logic
styles.css - All styling
```

### **Landing & Login:**
```
landing.html - First page users see
login.html   - Authentication page
```

### **PWA:**
```
sw.js         - Service worker
manifest.json - App manifest
icons/        - All app icons
```

### **Content:**
```
content.json - All study questions and topics
```

### **Firebase:**
```
firebase.json    - Hosting & routing config
firestore.rules  - Database security
```

---

## 📖 Documentation Index

### **Getting Started:**
- `docs/README.md` - Main readme
- `docs/GETTING-STARTED.md` - Setup guide
- `docs/PROJECT-INFO.md` - Project overview

### **Features:**
- `docs/DEDICATED-LOGIN-PAGE-CONFIRMATION.md` - Login page
- `docs/PROFILE-FEATURE-GUIDE.md` - Profile dropdown
- `docs/LOGOUT-BUTTON-SUMMARY.md` - Logout functionality

### **Testing:**
- `docs/TEST-RESULTS.md` - Test results
- `docs/TESTING-SUMMARY.md` - Testing overview

### **Deployment:**
- `docs/FIREBASE-DEPLOYMENT-CONFIRMATION.md` - Deployment guide
- `docs/DEPLOYMENT.md` - Deployment docs

---

## 🔒 Security Files

### **Firebase Security Rules:**
```
firestore.rules       - Firestore database rules
database.rules.json   - Realtime database rules
storage.rules         - Storage bucket rules
```

### **Test Credentials:**
Location: `docs/FIREBASE-USERS-SETUP.md`

```
sarah.johnson@abamastery.test - Test123456!
michael.chen@abamastery.test - Test123456!
emily.rodriguez@abamastery.test - Test123456!
```

---

## 🎯 Organization Benefits

### **Before:**
❌ 100+ files in root directory
❌ Hard to find anything
❌ Test files mixed with production
❌ Documentation scattered

### **After:**
✅ ~15 clean production files in root
✅ Easy to navigate
✅ Tests organized in /tests
✅ Docs organized in /docs
✅ Screenshots in /screenshots
✅ Archive for old files
✅ Professional structure

---

## 📦 What's Deployed to Firebase

**Only production files are deployed:**
```
✅ landing.html, login.html, app.html
✅ app.js, auth.js, styles.css, sw.js
✅ content.json, manifest.json
✅ icons/*
✅ firebase.json config

❌ Tests (excluded via firebase.json)
❌ Docs (excluded via firebase.json)
❌ Screenshots (excluded)
❌ Archive (excluded)
```

---

## 🔄 Maintenance

### **Adding New Features:**
1. Edit production files in root
2. Test with scripts in `/tests`
3. Document in `/docs`
4. Deploy with `firebase deploy --only hosting`

### **Running Tests:**
```bash
cd tests
node test-login-page.js
```

### **Updating Docs:**
```bash
cd docs
# Edit markdown files
```

### **Cleaning Up:**
- Old files → `/archive`
- Test results → `/screenshots`
- New docs → `/docs`

---

## ✅ Organization Complete!

The project is now:
- ✅ Clean and organized
- ✅ Easy to navigate
- ✅ Professional structure
- ✅ Maintainable
- ✅ Scalable

**Everything in its place!** 📁

---

**Organized by**: Bradley Virtual Solutions, LLC  
**Project**: ABA Mastery Study Platform  
**Version**: 1.3.4  
**Date**: October 18, 2025

