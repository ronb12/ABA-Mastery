# 🎉 Test is Running NOW!

## What You Should See

A **Chrome browser window** should be visible on your screen with **TWO TABS**:

- **Tab 1**: User test123@aba.com (signed in)
- **Tab 2**: User test456@aba.com (signed in)

Both should be at your ABA Mastery app (http://localhost:5002)

---

## Can't See the Browser?

### Try These:

1. **Check Mission Control** (swipe up with 3 fingers)
   - Browser might be on another desktop/space

2. **Check All Windows** (F3 or swipe up with 4 fingers)
   - Look for "Google Chrome for Testing"

3. **Click Chrome Icon** in Dock
   - If it's running, clicking will bring it forward

4. **Use Alt+Tab** (Cmd+Tab on Mac)
   - Cycle through open applications

---

## Manual Testing Steps

Once you see the browser:

### TAB 1 (User 1):
1. Click **"Study Groups"** button (👥 icon in navigation)
2. Click **"Create Group"**
3. Fill in:
   - Name: "Test Notification Group"
   - Description: "Testing session notifications"
   - Exam Type: BCBA
4. Click **"Create"**
5. **Write down the INVITE CODE** shown

### TAB 2 (User 2):
1. Click **"Study Groups"** button
2. Click **"Join Group"**
3. Enter the invite code from User 1
4. Click **"Join"**

### Test Notifications:
1. **Tab 1**: Go to **"Schedule"** tab
2. **Tab 1**: Click **"Schedule Session"**
3. **Tab 1**: Fill form:
   - Title: "Test Session"
   - Date: Tomorrow
   - Time: 6:00 PM
4. **Tab 1**: Click **"Schedule"**
5. **Tab 2**: **WATCH FOR NOTIFICATION!** 🔔
6. **Tab 2**: Schedule should update automatically
7. **Tab 2**: Click **"Join Session"** button
8. **Tab 2**: Should show **"✓ Attending"**

---

## Troubleshooting

### If Browser Still Not Visible:

Open it manually:
1. Open Chrome
2. Go to: http://localhost:5002/login.html
3. Sign in with: **test123@aba.com** / **Test123!**
4. Open another tab
5. Go to: http://localhost:5002/login.html
6. Sign in with: **test456@aba.com** / **Test456!**

### Check Emulator UI:

Visit: **http://localhost:4000**
- View users
- See Firestore data
- Monitor real-time updates

---

## Stop the Test

In the terminal, press: **Ctrl+C**

---

## What's Running:

✅ Firebase Emulators (localhost:5002)  
✅ Test Users Created  
✅ Chrome Browser Launched  
✅ Both Users Signed In  

**You're all set to test!** 🚀


