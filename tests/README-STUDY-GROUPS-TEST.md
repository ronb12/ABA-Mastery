# Study Group Notifications Test with Firebase Emulators

## Overview

This automated test validates the study group notifications feature using Puppeteer and Firebase Emulators.

## Test Coverage

The test automatically:
1. ✅ Starts Firebase Emulators (Auth, Firestore, Storage, Hosting)
2. ✅ Launches two browser instances (simulating two users)
3. ✅ Creates two test user accounts
4. ✅ User 1 creates a study group
5. ✅ User 2 joins the study group using invite code
6. ✅ User 1 schedules a study session
7. ✅ Verifies User 2 receives notification
8. ✅ Takes screenshots at each step
9. ✅ Stops emulators when done

## Running the Test

### Option 1: Using NPM Script (Recommended)
```bash
npm run test-study-groups
```

### Option 2: Direct Node Execution
```bash
node tests/test-study-groups-emulator.js
```

## What to Expect

1. **Terminal Output**: Detailed step-by-step progress with emojis
2. **Browser Windows**: Two Chrome windows will open side-by-side
3. **Emulator UI**: Available at http://localhost:4000
4. **Screenshots**: Saved to `test-screenshots/emulator-*.png`
5. **Duration**: ~60 seconds for full test

## Test Results

The test will output:
- ✅ PASSED: Tests that completed successfully
- ⚠️ WARNINGS: Tests with partial success or missing features
- ❌ FAILED: Tests that encountered errors

## Screenshots Saved

- `emulator-01-landing-user1.png` - User 1 landing page
- `emulator-01-landing-user2.png` - User 2 landing page
- `emulator-02-user1-signup.png` - User 1 after signup
- `emulator-02-user2-signup.png` - User 2 after signup
- `emulator-03-user1-study-groups.png` - User 1 in Study Groups view
- `emulator-03-user2-study-groups.png` - User 2 in Study Groups view
- `emulator-04-user1-created-group.png` - User 1 created group
- `emulator-05-user2-joined-group.png` - User 2 joined group
- `emulator-06-user1-scheduled.png` - User 1 scheduled session
- `emulator-06-user2-notification.png` - User 2 received notification

## Requirements

### Prerequisites
```bash
# Firebase CLI
npm install -g firebase-tools

# Puppeteer (already in package.json)
npm install
```

### Ports Required
The test uses these ports:
- 5002 - Firebase Hosting (your app) *Note: 5002 instead of 5000 due to macOS AirPlay*
- 4000 - Emulator UI
- 9099 - Auth Emulator
- 8080 - Firestore Emulator
- 9199 - Storage Emulator

Make sure these ports are free before running the test.

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on required ports
lsof -ti:5000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9
```

### Emulators Won't Start
```bash
# Clear emulator data
rm -rf .firebase/

# Check Firebase CLI version
firebase --version  # Should be 14.x or higher
```

### Test Hangs
- Press Ctrl+C to stop
- Check browser console for errors
- Check emulator logs at http://localhost:4000

### Browser Not Opening
The test runs in non-headless mode by default. If you want headless:
1. Edit `test-study-groups-emulator.js`
2. Change `headless: false` to `headless: true`

## Manual Verification

While the test runs, you can:
1. Watch both browser windows
2. View Emulator UI at http://localhost:4000
3. Check Firestore data in real-time
4. Verify notifications appear
5. Inspect console logs in both browsers

## Cleaning Up

The test automatically:
- Closes browser windows after 30 seconds
- Stops Firebase Emulators
- Leaves screenshots for review

To manually clean up:
```bash
# Remove test screenshots
rm -f test-screenshots/emulator-*.png

# Clear emulator data
rm -rf .firebase/
```

## Test Environment

- **No Production Impact**: Uses only local emulators
- **Disposable Data**: All test data is temporary
- **Repeatable**: Can run as many times as needed
- **Fast**: Complete test in ~60 seconds

## Integration with CI/CD

To run this test in headless mode for CI:
```bash
# Modify test file to use headless mode
# Then run:
npm run test-study-groups 2>&1 | tee test-output.log
```

## Notes

1. **Browser Permissions**: Browser notifications may require permission
2. **Timing**: Some steps use delays for Firebase operations
3. **Auto-cleanup**: Emulators automatically stop on test completion
4. **Debugging**: Screenshots saved on both success and failure

---

**Created**: October 18, 2025  
**Purpose**: Automated testing of study group notifications feature  
**Status**: Production Ready ✅

