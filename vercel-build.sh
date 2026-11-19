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
# Build the browser-compatible Firebase config from the tracked, masked
# Firebase module. The browser file itself is not committed to Git.
# Never echo the environment key or insert credentials into source control.
if [ -f firebase-config-browser.js ]; then
  cp firebase-config-browser.js public/firebase-config-browser.js
elif [ -f firebase-config.js ]; then
  node <<'FIREBASE_BROWSER_CONFIG'
const fs = require('node:fs');
const source = fs.readFileSync('firebase-config.js', 'utf8');
const match = source.match(/(?:const|let|var)\s+firebaseConfig\s*=\s*(\{[\s\S]*?\});/);
if (!match) {
  console.error('Firebase configuration template could not be found');
  process.exit(1);
}
const key = String(process.env.FIREBASE_API_KEY || '').trim();
let objectLiteral = match[1];
if (key) {
  if (!/(['"])FIREBASE_API_KEY_MASKED\1/.test(objectLiteral)) {
    console.error('Expected masked API key placeholder was not found');
    process.exit(1);
  }
  objectLiteral = objectLiteral.replace(/(['"])FIREBASE_API_KEY_MASKED\1/, JSON.stringify(key));
}
fs.writeFileSync('public/firebase-config-browser.js', 'window.FIREBASE_CONFIG = ' + objectLiteral + ';\n');
FIREBASE_BROWSER_CONFIG
else
  echo 'ERROR: Missing tracked Firebase configuration template'
  exit 1
fi
# Kept for existing browser paths. Both files are generated, not hand-edited.
cp public/firebase-config-browser.js public/firebase-config.js
if [ -n "$FIREBASE_API_KEY" ]; then
  echo "OK: Firebase browser bootstrap generated from configured environment"
else
  echo "WARN: FIREBASE_API_KEY not set - guest mode only; Google sign-in is unavailable"
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
