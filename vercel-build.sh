#!/bin/bash
# Copy all static assets to public/ so Vercel serves real content (fixes 0-byte white page)
set -e
mkdir -p public public/icons public/api

# Main HTML pages only (no test/duplicate HTML)
for f in index.html landing.html app.html login.html signup.html billing.html about.html privacy.html support.html editorial-policy.html; do
  [ -f "$f" ] && cp "$f" public/
done

# Styles and scripts
cp *.css public/ 2>/dev/null || true
cp *.js public/ 2>/dev/null || true
# Firebase config: key is masked in repo; inject real key from FIREBASE_API_KEY at build
cp firebase-config-browser.js public/firebase-config.js
if [ -n "$FIREBASE_API_KEY" ]; then
  sed "s/FIREBASE_API_KEY_MASKED/$FIREBASE_API_KEY/g" public/firebase-config.js > public/firebase-config.js.tmp && mv public/firebase-config.js.tmp public/firebase-config.js
  echo "OK: firebase-config.js (API key injected from env)"
else
  echo "WARN: FIREBASE_API_KEY not set - Firebase will not work until you set it in Vercel env"
fi

# Favicon and config
cp favicon.ico public/ 2>/dev/null || true
cp content.json manifest.json public/ 2>/dev/null || true
cp ads.txt public/ 2>/dev/null || true

# Icons and API
cp -r icons/* public/icons/ 2>/dev/null || true
cp api/*.js public/api/ 2>/dev/null || true

# Ensure key files exist
[ -f public/index.html ] && echo "OK: index.html" || echo "MISSING: index.html"
[ -f public/landing.html ] && echo "OK: landing.html" || echo "MISSING: landing.html"
wc -c public/index.html public/landing.html 2>/dev/null || true
