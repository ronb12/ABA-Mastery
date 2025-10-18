# 🔄 Clear Cache Instructions - Updated Version Deployed!

**Version 1.2.0 is now LIVE** with the logout button feature!

---

## 🚀 Quick Fix: Hard Refresh

The easiest way to see the new logout button is to do a **hard refresh**:

### **On Mac:**
- **Chrome/Edge**: `Cmd + Shift + R`
- **Safari**: `Cmd + Option + R`
- **Firefox**: `Cmd + Shift + R`

### **On Windows:**
- **Chrome/Edge/Firefox**: `Ctrl + Shift + R`

### **On Mobile:**
- **iOS Safari**: Settings > Safari > Clear History and Website Data
- **Android Chrome**: Settings > Privacy > Clear browsing data

---

## 🧹 Complete Cache Clear (If Hard Refresh Doesn't Work)

### **Chrome/Edge:**
1. Open Developer Tools (`F12` or `Cmd/Ctrl + Shift + I`)
2. Right-click the **Refresh button** in browser toolbar
3. Select **"Empty Cache and Hard Reload"**

OR

1. Go to `chrome://settings/clearBrowserData`
2. Select **"Cached images and files"**
3. Click **"Clear data"**

### **Safari:**
1. Go to **Safari > Preferences > Advanced**
2. Check **"Show Develop menu in menu bar"**
3. Click **Develop > Empty Caches**
4. Refresh the page

### **Firefox:**
1. Go to **Settings > Privacy & Security**
2. Under **Cookies and Site Data**, click **"Clear Data"**
3. Check **"Cached Web Content"**
4. Click **"Clear"**

---

## 📱 Clear Service Worker Cache

If the app still shows the old version:

1. Open Developer Tools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **"Service Workers"** in the left sidebar
4. Click **"Unregister"** next to `aba-mastery-app.web.app`
5. Click **"Cache Storage"** in the left sidebar
6. Right-click on cache entries and select **"Delete"**
7. Refresh the page

---

## ✅ How to Verify the Update Worked

After clearing cache, you should see:

1. **Version Number**: Check console logs for "v1.2.0"
2. **Logout Button**: Look for a 👤 user icon button in the top-right header (it will be hidden until you sign in)
3. **Button Order**: Should be: 👤 (Logout) | 🌙 (Dark Mode) | ☰ (Menu)

---

## 🎯 What Changed in v1.2.0

- ✅ Added logout button to header (👤 icon)
- ✅ Positioned next to dark mode button
- ✅ Shows when signed in, hidden in guest mode
- ✅ Distinctive red-tinted styling
- ✅ Functional sign-out process
- ✅ Updated cache version to force refresh

---

## 🔧 Still Not Working?

Try this nuclear option:

1. **Close all browser tabs** of the app
2. **Clear all browser data** for the site:
   - Chrome: `chrome://settings/content/all` → Find `aba-mastery-app.web.app` → Remove
3. **Restart your browser completely**
4. **Open the app** in a **new private/incognito window**: https://aba-mastery-app.web.app
5. If it works there, the cache should be cleared in normal mode too

---

## 💡 Why This Happens

PWAs (Progressive Web Apps) are designed to work offline, so they cache files aggressively. When we update the app, sometimes browsers hold onto old cached versions. By updating the version number from `v1.1.0` to `v1.2.0`, the service worker will:

1. Detect the new version
2. Delete old cache files
3. Download fresh files
4. Show the updated app

---

## 📞 Confirmation

Once you've cleared the cache and see the logout button appear next to the dark mode button, everything is working correctly! The button will:

- ❌ Be **hidden** when you're in guest mode
- ✅ **Appear** when you sign in with a test account
- 🔴 Have a subtle **red tint** to distinguish it

---

**Updated**: October 18, 2025  
**Version**: 1.2.0  
**Status**: ✅ Deployed and Live

