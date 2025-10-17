# ABA Mastery - Deployment Guide

This guide will walk you through deploying the ABA Mastery app to Firebase Hosting.

## Prerequisites

Before deploying, ensure you have:

1. ✅ **Node.js** installed (v14 or higher)
2. ✅ **Firebase CLI** installed globally
3. ✅ **Firebase account** (free tier is sufficient)
4. ✅ **Git** installed and repository cloned

## Step 1: Install Firebase CLI

If you haven't already installed Firebase CLI:

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 3: Create Firebase Project

You have two options:

### Option A: Use Firebase Console (Recommended for first-time)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `aba-mastery-app` (or your preferred name)
4. Continue through the setup wizard
5. Disable Google Analytics (optional for this app)
6. Create project

### Option B: Use Firebase CLI

```bash
firebase projects:create aba-mastery-app
```

## Step 4: Link Project

Update `.firebaserc` with your project ID if different:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

Or run:

```bash
firebase use --add
```

Select your project from the list.

## Step 5: Deploy to Firebase Hosting

### First Deployment

```bash
firebase deploy --only hosting
```

You'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/aba-mastery-app/overview
Hosting URL: https://aba-mastery-app.web.app
```

### Subsequent Deployments

Every time you make changes and want to deploy:

```bash
# From the project directory
cd "/Users/ronellbradley/Desktop/ABA Mastery"

# Deploy
firebase deploy --only hosting
```

## Step 6: Verify Deployment

1. Open the Hosting URL provided in the terminal
2. Test core functionality:
   - ✅ Home page loads
   - ✅ Navigate to Study view
   - ✅ Take a practice exam
   - ✅ Try flashcards
   - ✅ Toggle dark mode
   - ✅ Test offline (disable network in DevTools)
   - ✅ Install as PWA

## Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `abamastery.com`)
4. Firebase will provide DNS records

### Update DNS

Add these records to your domain provider:

**For root domain:**
```
Type: A
Name: @
Value: [IP addresses provided by Firebase]
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: [domain provided by Firebase]
```

### Verification

1. DNS changes can take 24-48 hours
2. Firebase will automatically provision SSL certificate
3. Your app will be accessible via your custom domain

## Deployment Method

**This project uses MANUAL DEPLOYMENT ONLY.**

All deployments must be done manually using:
```bash
firebase deploy --only hosting
```

**No GitHub Actions or automatic deployment is configured.**

This gives you full control over when and what gets deployed to production.

## Updating Content

### Add New Questions

1. Edit `content.json`
2. Add questions to `practiceQuestions` array
3. Increment version in files if needed:
   - `index.html` (update v= in script/css links)
   - `sw.js` (update CACHE_NAME)
   - `content.json` metadata

4. Commit and deploy:
   ```bash
   git add .
   git commit -m "Add new practice questions"
   git push origin main
   firebase deploy --only hosting
   ```

### Update Study Topics

1. Edit `content.json`
2. Modify topics in relevant category
3. Follow same commit/deploy process

## Performance Optimization

### Check Performance

```bash
firebase hosting:channel:deploy preview
```

Use Lighthouse in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Review PWA, Performance, Accessibility scores

### Current Optimizations

- ✅ Service Worker caching
- ✅ Versioned assets (cache busting)
- ✅ Minified/optimized code
- ✅ Lazy loading where appropriate
- ✅ Compressed assets
- ✅ CDN delivery via Firebase

## Monitoring

### View Analytics

```bash
firebase hosting:channel:list
```

### Check Deployment Status

```bash
firebase hosting:channel:list
```

### View Logs

Check Firebase Console > Hosting for:
- Deployment history
- Bandwidth usage
- Request counts
- Geographic distribution

## Troubleshooting

### Deployment Fails

**Error: "Not authorized"**
```bash
firebase logout
firebase login
firebase deploy --only hosting
```

**Error: "Project not found"**
```bash
firebase use --add
# Select correct project
```

**Error: "Cannot deploy"**
- Check `firebase.json` is valid JSON
- Ensure all files exist
- Check `.firebaserc` has correct project ID

### Cache Issues

Users seeing old version:

1. Update version numbers
2. Clear Firebase hosting cache:
   ```bash
   firebase hosting:channel:delete live
   firebase deploy --only hosting
   ```

3. Instruct users to:
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache
   - Reinstall PWA

### Service Worker Issues

```javascript
// Users can unregister in browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

Then hard refresh the page.

## Security

### Firebase Security Rules

Currently using Hosting only (no database), but if you add Firestore/Realtime DB:

1. Go to Firebase Console > Firestore/Database
2. Set appropriate security rules
3. Test rules thoroughly

### Content Security Policy

Headers are configured in `firebase.json`:
- X-Content-Type-Options
- X-Frame-Options  
- X-XSS-Protection

## Rollback

If you need to rollback to a previous version:

```bash
firebase hosting:channel:list
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID DEST_SITE_ID:live
```

Or redeploy from previous git commit:

```bash
git checkout [previous-commit-hash]
firebase deploy --only hosting
git checkout main
```

## Maintenance

### Regular Updates

1. **Weekly**: Review user feedback, update questions
2. **Monthly**: Add new content, review analytics
3. **Quarterly**: Update dependencies, security audit
4. **Yearly**: Major content review, feature additions

### Version Management

Follow semantic versioning:
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features
- **Patch** (1.0.1): Bug fixes

Update in:
- `manifest.json` (version field - add if needed)
- `README.md`
- Git tags

## Cost Management

Firebase free tier includes:
- 10 GB hosting storage
- 360 MB/day bandwidth
- Custom domain and SSL

**Monitor usage:**
1. Firebase Console > Usage
2. Set up billing alerts
3. Upgrade to Spark plan if needed (pay-as-you-go)

## Support

For deployment issues:

- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **Firebase Support**: https://firebase.google.com/support
- **GitHub Issues**: https://github.com/ronb12/ABA-Mastery/issues

---

## Quick Reference

```bash
# Login
firebase login

# Deploy
firebase deploy --only hosting

# Check status  
firebase hosting:channel:list

# View project
firebase open hosting

# Help
firebase help hosting
```

---

**Deployed by Bradley Virtual Solutions, LLC**

Last Updated: October 17, 2025

