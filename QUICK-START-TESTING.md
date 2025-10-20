# Quick Start: Study Groups Testing

## Prerequisites Check

```bash
# Check if Java is installed
java --version
```

### If Java Not Installed:
```bash
# Install Java (takes ~10 minutes)
brew install openjdk@17

# Link Java
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Verify
java --version
```

---

## Testing in 2 Steps

### Step 1: Start Emulators (Terminal 1)
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
npm start
```

**Wait for**: `✔  All emulators ready!`

### Step 2: Run Test (Terminal 2)
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
npm run test-study-groups
```

**Result**: Two browsers open, test runs automatically

---

## What the Test Does

1. ✅ Creates 2 test users
2. ✅ Logs both in
3. ✅ Opens Study Groups for both
4. ⏸️ Pauses for you to:
   - User 1: Create group → get invite code
   - User 2: Join group with code
   - User 1: Schedule session
   - User 2: See notification! 🔔

---

## Access Points

| Service | URL |
|---------|-----|
| Your App | http://localhost:5002 |
| Emulator UI | http://localhost:4000 |

---

## Manual Testing (No Automation)

Can't install Java? Test manually:

1. Open: https://aba-mastery-app.web.app (Tab 1)
2. Open: https://aba-mastery-app.web.app (Tab 2)
3. Sign in with different accounts
4. Follow testing steps above

---

## Stop Everything

```bash
# In both terminals
Ctrl+C
```

---

## Troubleshooting

### "Emulators not running"
- Start emulators first in Terminal 1
- Wait for "All emulators ready!" message

### Port already in use
```bash
lsof -ti:5002 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

### Browser won't open
- Puppeteer will auto-install Chromium
- Wait for download to complete

---

## Quick Commands

```bash
npm start                    # Start emulators
npm run test-study-groups    # Run test
firebase deploy             # Deploy to production
```

---

**Ready?** Open two terminals and follow Step 1 & 2 above! 🚀


