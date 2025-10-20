# Study Groups - Complete Manual Test Guide
**A Product of Bradley Virtual Solutions, LLC**

**Test Date:** October 18, 2025  
**Version:** 6.1.0  
**Tester:** ____________

---

## 🎯 Test Objective

Verify all Study Groups Premium features work correctly, including:
- Group creation with modal
- All 7 tabs functionality
- Chat messaging
- File sharing (free storage)
- Video calls
- Quizzes
- Leaderboards
- Schedules

---

## ⚙️ Test Setup

### **Prerequisites:**
- ✅ Browser: Chrome, Firefox, or Safari (latest version)
- ✅ Account: test123@aba.com / Test123!
- ✅ URL: https://aba-mastery-app.web.app
- ✅ Hard refresh before starting (Cmd+Shift+R or Ctrl+Shift+R)

### **Before Starting:**
1. Clear browser cache (optional but recommended)
2. Open browser console (F12 or Cmd+Option+I)
3. Check for console message: "✅ Study Groups Manager initialized"
4. If not present, hard refresh again

---

## 📋 Test Checklist

### **TEST 1: Sign In ✓**

**Steps:**
1. Go to: https://aba-mastery-app.web.app
2. Sign in with:
   - Email: test123@aba.com
   - Password: Test123!
3. Verify app loads

**Expected Result:**
- ✅ Successfully signed in
- ✅ Redirected to app
- ✅ See navigation menu

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 2: Navigate to Study Groups ✓**

**Steps:**
1. Click 👥 "Study Groups" in navigation menu

**Expected Result:**
- ✅ Study Groups view loads
- ✅ See "Create Group" and "Join Group" buttons
- ✅ See "My Groups (0)" section

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 3: Create Group Modal ✓**

**Steps:**
1. Click "Create Group" button

**Expected Result:**
- ✅ Dark overlay appears covering page
- ✅ Modal appears CENTERED on screen (not at bottom!)
- ✅ Modal has professional design
- ✅ See all form fields:
  - [ ] Group Name *
  - [ ] Description
  - [ ] Exam Type dropdown (BCBA/BCaBA/RBT)
  - [ ] Target Exam Date picker
  - [ ] Max Members number field
  - [ ] "Make group private" checkbox
  - [ ] 5 Feature toggles (Chat, Video, Files, Quizzes, Leaderboard)
- ✅ See Cancel and Create Group buttons
- ✅ Close button (×) in header works

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 4: Create a Group ✓**

**Steps:**
1. Fill form:
   - Name: "Test Study Group"
   - Description: "Testing all features"
   - Exam Type: BCBA
   - Date: (any future date)
   - Leave other defaults
2. Click "Create Group" button

**Expected Result:**
- ✅ First modal closes
- ✅ New modal appears with invite code
- ✅ Invite code is 8 characters (e.g., "ABC12XYZ")
- ✅ "Copy Code" button works
- ✅ Success message displayed

**Status:** [ ] PASS  [ ] FAIL  
**Invite Code:** _______________  
**Notes:** _______________________________________________

---

### **TEST 5: Group Appears in List ✓**

**Steps:**
1. Close invite code modal
2. Check "My Groups" section

**Expected Result:**
- ✅ Group card appears
- ✅ Shows group name
- ✅ Shows exam type badge
- ✅ Shows member count (1 member)
- ✅ "Open Group" button visible

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 6: Open Group Interface ✓**

**Steps:**
1. Click "Open Group" on your created group

**Expected Result:**
- ✅ Group interface loads
- ✅ See group name in header
- ✅ See "← Back to Groups" button
- ✅ See "📤 Invite" button
- ✅ See 7 tabs:
  - [ ] 💬 Chat
  - [ ] 📹 Video Call
  - [ ] 📁 Files
  - [ ] 📝 Quizzes
  - [ ] 🏆 Leaderboard
  - [ ] 📅 Schedule
  - [ ] 👥 Members (1)
- ✅ Chat tab active by default

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 7: Chat Feature ✓**

**Steps:**
1. Ensure Chat tab is active
2. Type message in chat input: "Hello! Testing chat feature 🎉"
3. Press Enter OR click Send button
4. Wait 2 seconds

**Expected Result:**
- ✅ Chat input field visible
- ✅ Send button visible
- ✅ Message sends successfully
- ✅ Message appears in chat area
- ✅ Shows your name
- ✅ Shows timestamp
- ✅ Message has styling (bubble/card)
- ✅ Input clears after send

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 8: Video Call Tab ✓**

**Steps:**
1. Click "📹 Video Call" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See "Start Video Call" button
- ✅ See description: "High-quality video calls with up to 50 participants"
- ✅ See Jitsi container area

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

**Optional - Test Video Call:**
- Click "Start Video Call" button
- Jitsi interface should load
- Camera/mic permissions requested
- Video call interface appears

**Video Call Works:** [ ] YES  [ ] NO  [ ] SKIP

---

### **TEST 9: Files Tab (FREE Storage) ✓**

**Steps:**
1. Click "📁 Files" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See green "Share Files (100% FREE Forever)" header
- ✅ See TWO upload options:
  - [ ] 💚 Small Files (Under 1MB) with "Upload Small File" button
  - [ ] 🔗 Large Files (Any Size) with "Share External Link" button
- ✅ See info box explaining free storage
- ✅ See empty state or file list

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

**Optional - Test Small File Upload:**
1. Click "Upload Small File"
2. Select a screenshot or small PDF (<1MB)
3. File should upload and appear with "💚 Free Storage" badge

**Small File Upload Works:** [ ] YES  [ ] NO  [ ] SKIP

**Optional - Test External Link:**
1. Click "Share External Link"
2. Modal should open with Google Drive/Dropbox instructions
3. Should have form fields for URL, name, service

**External Link Modal Works:** [ ] YES  [ ] NO  [ ] SKIP

---

### **TEST 10: Quizzes Tab ✓**

**Steps:**
1. Click "📝 Quizzes" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See "➕ Create Quiz" button
- ✅ See empty state or quiz list

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

**Test Create Quiz Modal:**
1. Click "➕ Create Quiz" button
2. **Modal should pop up (NOT browser prompt!)**
3. Modal should have:
   - [ ] Quiz Name field
   - [ ] Number of Questions field
   - [ ] Difficulty dropdown
   - [ ] Category dropdown
   - [ ] Time Limit field
   - [ ] Cancel and Create Quiz buttons

**Create Quiz Modal Works:** [ ] YES  [ ] NO  
**Notes:** _______________________________________________

---

### **TEST 11: Leaderboard Tab ✓**

**Steps:**
1. Click "🏆 Leaderboard" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See "Group Leaderboard 🏆" title
- ✅ See filter buttons (Overall, This Week, This Month)
- ✅ See leaderboard list (may be empty for new group)

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 12: Schedule Tab ✓**

**Steps:**
1. Click "📅 Schedule" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See "Group Study Schedule 📅" title
- ✅ See "➕ Schedule Session" button
- ✅ See empty state or session list

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

**Test Schedule Session Modal:**
1. Click "➕ Schedule Session" button
2. **Modal should pop up (NOT browser prompt!)**
3. Modal should have:
   - [ ] Session Name field
   - [ ] Date picker
   - [ ] Time picker
   - [ ] Duration dropdown
   - [ ] Description field
   - [ ] Cancel and Schedule Session buttons

**Schedule Session Modal Works:** [ ] YES  [ ] NO  
**Notes:** _______________________________________________

---

### **TEST 13: Members Tab ✓**

**Steps:**
1. Click "👥 Members" tab

**Expected Result:**
- ✅ Tab activates
- ✅ See "Group Members (1/50)" title
- ✅ See your member card with:
  - [ ] Avatar (first letter of name)
  - [ ] Your display name
  - [ ] "👑 Admin" badge

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

### **TEST 14: Join Group Modal ✓**

**Steps:**
1. Go back to Study Groups list
2. Click "Join Group" button

**Expected Result:**
- ✅ Modal pops up (centered, with overlay)
- ✅ See "Join Study Group" title
- ✅ See invite code input field
- ✅ Input auto-uppercases text
- ✅ See Cancel and Join Group buttons

**Status:** [ ] PASS  [ ] FAIL  
**Notes:** _______________________________________________

---

## 📊 Test Summary

### **Features Tested:**

| Feature | Status | Notes |
|---------|--------|-------|
| Sign In | [ ] Pass [ ] Fail | |
| Navigate to Study Groups | [ ] Pass [ ] Fail | |
| Create Group Modal | [ ] Pass [ ] Fail | |
| Create Group Success | [ ] Pass [ ] Fail | |
| Invite Code Generation | [ ] Pass [ ] Fail | |
| Group in List | [ ] Pass [ ] Fail | |
| Open Group Interface | [ ] Pass [ ] Fail | |
| Chat Tab | [ ] Pass [ ] Fail | |
| Chat Messaging | [ ] Pass [ ] Fail | |
| Video Tab | [ ] Pass [ ] Fail | |
| Files Tab | [ ] Pass [ ] Fail | |
| File Upload UI | [ ] Pass [ ] Fail | |
| Quizzes Tab | [ ] Pass [ ] Fail | |
| Create Quiz Modal | [ ] Pass [ ] Fail | |
| Leaderboard Tab | [ ] Pass [ ] Fail | |
| Schedule Tab | [ ] Pass [ ] Fail | |
| Schedule Modal | [ ] Pass [ ] Fail | |
| Members Tab | [ ] Pass [ ] Fail | |
| Join Group Modal | [ ] Pass [ ] Fail | |

### **Critical Features:**
- [ ] ✅ Modals appear centered (not at bottom)
- [ ] ✅ Chat sends and displays messages
- [ ] ✅ All 7 tabs work
- [ ] ✅ Create Quiz uses modal (not prompt)
- [ ] ✅ Schedule Session uses modal (not prompt)

---

## ✅ Expected Results Summary

### **What Should Work:**

**Modals:**
- ✅ Create Group modal - Beautiful centered popup
- ✅ Join Group modal - Centered with invite code input
- ✅ Invite Code modal - Shows generated code
- ✅ Create Quiz modal - Professional form (NOT browser prompt)
- ✅ Schedule Session modal - Date/time pickers (NOT browser prompt)
- ✅ Share Link modal - Google Drive/Dropbox instructions

**Group Interface:**
- ✅ 7 tabs all clickable and functional
- ✅ Chat with real-time messaging
- ✅ Video call button (Jitsi integration)
- ✅ File upload with FREE storage options
- ✅ Quiz creation with modal
- ✅ Leaderboard display
- ✅ Session scheduling with modal
- ✅ Members list

**User Experience:**
- ✅ Professional design
- ✅ Smooth animations
- ✅ No browser prompts
- ✅ All modals centered on screen
- ✅ Dark overlay backgrounds
- ✅ Easy to use

---

## 🐛 Known Issues (If Any)

List any issues found during testing:

1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

---

## ✅ Test Completion

**Date Tested:** _______________  
**Tester:** _______________  
**Overall Status:** [ ] PASS  [ ] FAIL  

**Recommendation:**
- [ ] Ready for production
- [ ] Needs fixes (list above)
- [ ] Ready for users

---

## 📝 Notes

Additional observations:
________________________________________________________
________________________________________________________
________________________________________________________
________________________________________________________

---

**Test completed by:** _______________  
**Date:** _______________  
**Signature:** _______________

