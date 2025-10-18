# 🔄 Clear Cache Instructions for ABA Mastery

## If You're Seeing an Old Version

Firebase and browsers cache files for performance. Here's how to see the latest version:

---

## 🌐 **FOR USERS - Clear Browser Cache**

### **Method 1: Hard Refresh (Quickest)**

**Chrome/Edge (Windows/Linux):**
- Press: `Ctrl + Shift + R`
- Or: `Ctrl + F5`

**Chrome/Edge/Safari (Mac):**
- Press: `Cmd + Shift + R`

**Firefox (Any OS):**
- Press: `Ctrl + Shift + R` (Windows/Linux)
- Press: `Cmd + Shift + R` (Mac)

---

### **Method 2: Clear Site Data**

**Chrome/Edge:**
1. Press F12 (Developer Tools)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Or:**
1. Press F12
2. Go to "Application" tab
3. Click "Clear storage"
4. Check "Unregister service workers"
5. Click "Clear site data"
6. Refresh page

---

### **Method 3: Incognito/Private Mode**

**Easiest for testing:**
1. Open Incognito/Private window
2. Visit: https://aba-mastery-app.web.app
3. You'll see the latest version (no cache)

---

## 🔧 **FOR DEVELOPERS - Force Cache Bust**

### **What I Just Did:**

1. ✅ Updated Service Worker cache name: `v1.0.0` → `v1.1.0`
2. ✅ Updated asset versions: `?v=1.0.0` → `?v=1.1.0`
3. ✅ Added landing.html and auth.js to cache
4. ⏳ Redeploying to Firebase

### **Deploy Updated Version:**

```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
firebase deploy --only hosting
```

This will:
- Upload new service worker (forces cache refresh)
- Update all cached assets
- Users will automatically get new version on next visit

---

## 🔥 **CLEAR FIREBASE HOSTING CACHE**

Firebase CDN caches for performance. To force immediate update:

### **Option 1: Wait**
- CDN cache expires automatically (usually 1 hour)
- New version deploys to all users gradually

### **Option 2: Version Bump (Done)**
- Service worker cache version updated
- Asset query strings updated (?v=1.1.0)
- Forces browsers to fetch new files

### **Option 3: Clear Firebase Cache**
```bash
# Deploy forces cache invalidation
firebase deploy --only hosting

# Or in Firebase Console:
# Hosting → ... menu → View cache
# Clear cache (if available)
```

---

## 🎯 **WHAT'S CHANGED (v1.0.0 → v1.1.0)**

- ✅ Firebase Authentication integrated
- ✅ Login/Signup fully functional
- ✅ Landing page added
- ✅ Auth.js module
- ✅ User state management
- ✅ Firestore integration ready
- ✅ Google Sign-In prepared
- ✅ Test pages added
- ✅ Comprehensive documentation

---

## 🧪 **TO SEE LATEST VERSION RIGHT NOW**

### **Fastest Method:**

1. **Open Incognito Window**
   - Chrome: Ctrl/Cmd + Shift + N
   - Firefox: Ctrl/Cmd + Shift + P
   - Safari: Cmd + Shift + N

2. **Visit**: https://aba-mastery-app.web.app

3. **You'll see**:
   - New landing page
   - Login/Signup buttons
   - Firebase Auth integration
   - All latest features

---

## 🔄 **SERVICE WORKER UPDATE**

### **Old Version:**
```javascript
const CACHE_NAME = 'aba-mastery-v1.0.0';
```

### **New Version:**
```javascript
const CACHE_NAME = 'aba-mastery-v1.1.0';
```

This forces all browsers to:
1. Download new service worker
2. Clear old cache
3. Fetch fresh files
4. Update automatically

---

## 📱 **FOR PWA USERS**

If you installed the app:

1. **Uninstall the old version**:
   - iOS: Long press icon → Remove App
   - Android: Long press → Uninstall
   - Desktop: Right click → Uninstall

2. **Visit site in browser**:
   - Hard refresh (Ctrl/Cmd + Shift + R)
   - Clear cache
   - Reinstall PWA

3. **Or just wait**:
   - PWA will auto-update on next launch
   - May take 24-48 hours

---

## ✅ **VERIFICATION**

### **To confirm you have the latest version:**

1. Open: https://aba-mastery-app.web.app
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for: `✅ Firebase initialized`
5. Check Network tab → Should see `landing.html` (new file)

**If you see landing page with login button = Latest version ✅**

---

## 🚀 **DEPLOYING CACHE-BUSTED VERSION NOW**

Running:
```bash
firebase deploy --only hosting
```

This will force update for all users!

---

**Cache Version**: Updated to v1.1.0  
**Service Worker**: Updated  
**Asset URLs**: Cache-busted  
**Ready to Deploy**: Yes

