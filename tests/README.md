# ABA Mastery - Test Suite

This directory contains all test files and testing utilities for the ABA Mastery application.

## 📁 Structure

```
tests/
├── build-tools/          # Test files from build process
│   ├── manual-create-group-test.js
│   ├── simple-study-groups-test.js
│   ├── test-all-study-group-features.js
│   ├── test-all-study-topics.js
│   ├── test-create-group.js
│   ├── test-session-notifications-fixed.js
│   ├── test-session-notifications.js
│   ├── test-study-groups-localhost.js
│   ├── test-study-groups.js
│   ├── test-study-materials.js
│   └── manual-session-test-guide.js
├── logs/                 # Test execution logs
│   ├── test-automated-run.log
│   ├── test-complete-run.log
│   ├── test-final-run.log
│   └── [other log files]
├── test-screenshots/     # Screenshots from automated tests
└── [main test files]     # Core test suites
```

## 🧪 Test Categories

### **Authentication Tests**
- `test-login-page.js` - Login functionality
- `test-local-login-logout.js` - Local auth flow
- `test-logout-button.js` - Logout functionality
- `create-test-users.js` - Test user creation

### **Study Groups Tests**
- `test-study-groups-automated.js` - Automated study group testing
- `test-study-groups-emulator.js` - Firebase emulator tests
- `test-study-groups-simple.js` - Basic functionality
- `test-study-groups-two-contexts.js` - Multi-user scenarios
- `test-study-groups-final.js` - Complete test suite

### **Navigation Tests**
- `test-page-navigation.js` - Page routing
- `test-landing-and-logout.js` - Landing page
- `test-and-fix-navigation.js` - Navigation fixes

### **Button Tests**
- `test-all-buttons.js` - All button functionality
- `test-strategy-buttons.js` - Strategy section buttons
- `button-test-simple.js` - Basic button tests

### **Integration Tests**
- `comprehensive-test.js` - Full app testing
- `test-app-fixed.js` - Fixed functionality tests
- `browser-test.js` - Browser compatibility

### **Verification Tests**
- `verify-firebase-deployment.js` - Deployment checks
- `verify-logout-button.js` - Logout verification

## 🚀 Running Tests

### **Prerequisites**
```bash
npm install
```

### **Run Specific Test**
```bash
node tests/[test-file-name].js
```

### **With Firebase Emulators**
```bash
npm run start  # Start emulators in one terminal
node tests/test-study-groups-emulator.js  # Run test in another
```

## 📝 Test Logs

All test execution logs are stored in `tests/logs/` directory. These include:
- Automated test runs
- Manual test results
- Debug output
- Error logs

## 📸 Screenshots

Test screenshots are stored in `tests/test-screenshots/` and include:
- User login flows
- Study group creation
- Session notifications
- Various app states

## 🔧 Test Utilities

### **Helper Scripts**
- `add-firebase-users.js` - Add test users to Firebase
- `create-test-users.js` - Create test accounts

### **Verification**
- `verify-firebase-deployment.js` - Check deployment status
- `verify-logout-button.js` - Verify logout functionality

## ⚙️ Configuration

Tests use Firebase Emulators by default for safe testing:
- **Auth Emulator**: `localhost:9099`
- **Firestore Emulator**: `localhost:8080`
- **Storage Emulator**: `localhost:9199`
- **Hosting**: `localhost:5002`

## 📖 Documentation

For detailed test documentation, see:
- `README-STUDY-GROUPS-TEST.md` - Study groups testing guide
- Individual test files for inline documentation

---

**© 2025 Bradley Virtual Solutions, LLC. All rights reserved.**

