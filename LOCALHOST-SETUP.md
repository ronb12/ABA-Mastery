# Running ABA Mastery on Localhost

## Quick Start

You can now run ABA Mastery on localhost with Firebase Emulators! This allows you to test all features locally without affecting production data.

## Prerequisites

Make sure you have Firebase CLI installed:
```bash
npm install -g firebase-tools
```

## Running the App Locally

### Option 1: Full Emulator Suite (Recommended for Development)
Start Firebase emulators with hosting, auth, firestore, and storage:

```bash
npm start
```
or
```bash
firebase emulators:start
```

This will start:
- **Hosting**: http://localhost:5002 (your app) *Note: Port 5002 instead of 5000 due to macOS AirPlay*
- **Emulator UI**: http://localhost:4000 (Firebase admin interface)
- **Auth Emulator**: localhost:9099
- **Firestore Emulator**: localhost:8080
- **Storage Emulator**: localhost:9199

### Option 2: Simple Hosting Only
If you just want to serve the static files:

```bash
npm run serve
```

This will serve the app at http://localhost:5000

## What's Been Fixed

✅ **Automatic Emulator Detection**: The app now automatically detects when running on localhost and connects to Firebase Emulators instead of production.

✅ **All Files Updated**: 
- `app.html` - Main app with full Firebase services
- `login.html` - Login page with Auth emulator
- `signup.html` - Signup page with Auth & Firestore emulators
- `landing.html` - Landing page with Auth emulator
- `firebase.json` - Emulator configuration added

✅ **Security Rules Work**: Your Firebase security rules will work the same way in emulators as in production.

## Testing Features

### Authentication
- Create test users without affecting production
- Sign in/out functionality
- All auth features work locally

### Firestore Database
- All user data, study groups, progress tracking
- Real-time updates work as expected
- Can view/edit data in Emulator UI at http://localhost:4000

### Storage
- File uploads for study groups
- Profile images
- All storage operations work locally

## Emulator UI Features

Access http://localhost:4000 to:
- View and edit Firestore data
- Manage test users
- Monitor Auth operations
- View Storage files
- Clear all data and start fresh

## Production vs Local

The app automatically detects the environment:

- **On localhost** (`localhost:5002` or `127.0.0.1:5002`):
  - Connects to Firebase Emulators
  - No impact on production data
  - Can test freely

- **On production** (your Firebase hosting URL):
  - Connects to real Firebase services
  - Uses production security rules
  - Real user data

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Find and kill the process using the port
lsof -ti:5002 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

**Note**: Port 5000 is used by macOS AirPlay Receiver, so we use port 5002 instead.

### Emulators Not Connecting
Make sure you started the emulators before opening the app:
```bash
firebase emulators:start
```

Then open http://localhost:5002 in your browser.

### Clear Emulator Data
Emulator data persists between sessions. To start fresh:
1. Stop the emulators (Ctrl+C)
2. Delete the emulator data: `rm -rf .firebase/`
3. Restart emulators

Or use the "Clear all data" button in the Emulator UI at http://localhost:4000

## Development Workflow

1. Start emulators: `npm start`
2. Open app: http://localhost:5002
3. Test features freely
4. View data in Emulator UI: http://localhost:4000
5. Make changes to code
6. Refresh browser to see changes
7. When done: Stop emulators (Ctrl+C)

## Notes

- Emulator data is NOT saved to production Firebase
- You can test destructive operations safely
- Create as many test users as needed
- Perfect for testing study groups and collaborative features

---

**Your localhost access issue is now fixed!** 🎉

Run `npm start` and access your app at http://localhost:5000

