# Study Group Notifications Test - Quick Start Guide

## Overview

This guide shows you how to test study group notifications using Puppeteer with Firebase Emulators.

## Two-Terminal Setup (Recommended)

### Terminal 1: Start Emulators
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
npm start
```

Wait for the message:
```
✔  All emulators ready!
```

**Do NOT close this terminal** - keep emulators running.

### Terminal 2: Run Test
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
npm run test-study-groups
```

## What the Test Does

The test automatically:
1. ✅ Creates two test user accounts
2. ✅ Logs both users in
3. ✅ Navigates both to Study Groups
4. ✅ Opens two browser windows side-by-side
5. ⏸️ Pauses for manual testing

## Manual Testing Steps

Once the browsers open, follow these steps:

### Window 1 (Left - User 1):
1. Click **"Create Group"** button
2. Fill in:
   - Group name: "Test Notifications Group"
   - Description: "Testing session notifications"
   - Exam type: BCBA
3. Click **"Create"**
4. **Note the invite code** displayed (e.g., "ABC123")

### Window 2 (Right - User 2):
1. Click **"Join Group"** button
2. Enter the invite code from User 1
3. Click **"Join"**
4. Verify you're in the same group

### Test Notifications:
1. **User 1**: Click **"Schedule"** tab
2. **User 1**: Click **"Schedule Session"**
3. **User 1**: Fill in session details:
   - Title: "Test Study Session"
   - Date: Tomorrow
   - Time: 6:00 PM
   - Duration: 60 minutes
4. **User 1**: Click **"Schedule"**
5. **User 2**: Watch for notification! 🔔
6. **User 2**: Check "Schedule" tab updates automatically
7. **User 2**: Click **"Join Session"** button
8. **User 2**: Button should change to **"✓ Attending"**

## Expected Results

✅ User 2 receives real-time notification when User 1 schedules a session  
✅ User 2's schedule tab updates automatically  
✅ Join/Attending status works correctly  
✅ Both users see the same session details  

## Ports Used

- **5002** - Your app (http://localhost:5002)
- **4000** - Emulator UI (http://localhost:4000)
- **9099** - Auth Emulator
- **8080** - Firestore Emulator
- **9199** - Storage Emulator

*Note: Port 5002 is used instead of 5000 because macOS uses 5000 for AirPlay*

## Viewing Emulator Data

While testing, you can view real-time data at:
**http://localhost:4000**

This shows:
- All user accounts
- Firestore documents
- Auth tokens
- Storage files

## Stopping the Test

- Browser windows will stay open for 5 minutes
- Press **Ctrl+C** in Terminal 2 to close browsers early
- Press **Ctrl+C** in Terminal 1 to stop emulators

## Troubleshooting

### "Emulators are not running"
- Make sure Terminal 1 has emulators running
- Check for "✔  All emulators ready!" message
- Wait a few seconds after starting emulators

### Port Already in Use
```bash
# Kill processes on emulator ports
lsof -ti:5002 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:9099 | xargs kill -9
```

### Browser Won't Open
- Check if Chrome is installed
- Puppeteer will download Chromium automatically

### Can't Find Study Groups Button
- Wait 2-3 seconds after page loads
- Look for the 👥 icon in navigation
- Try clicking "View All" or main navigation menu

## Screenshots

All test screenshots are saved to:
```
test-screenshots/simple-*.png
```

## Clean Up

After testing:
```bash
# Terminal 1 (Emulators)
Ctrl+C

# Terminal 2 (Test)
Ctrl+C

# Optional: Clear emulator data
rm -rf .firebase/

# Optional: Remove test screenshots
rm -f test-screenshots/simple-*.png
```

## Advanced: Fully Automated Test

For a fully automated version (experimental):
```bash
# This version tries to start emulators automatically
npm run test-study-groups-auto
```

*Note: The simple version (npm run test-study-groups) is more reliable*

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm start` | Start Firebase emulators |
| `npm run test-study-groups` | Run test (simple version) |
| `npm run test-study-groups-auto` | Run test (auto-start emulators) |

## Test Duration

- **Setup**: ~15 seconds
- **Manual Testing**: 5 minutes (or Ctrl+C when done)
- **Total**: ~5-6 minutes

---

**Ready to test?**

```bash
# Terminal 1
npm start

# Terminal 2 (in a new terminal)
npm run test-study-groups
```

🎉 Happy Testing!

