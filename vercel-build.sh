#!/bin/bash
# Copy all static assets to public/ so Vercel serves real content (fixes 0-byte white page)
set -e
mkdir -p public public/icons public/api

# Main HTML pages
for f in index.html landing.html app.html login.html signup.html billing.html; do
  [ -f "$f" ] && cp "$f" public/
done

# All other HTML (test pages etc - optional)
cp *.html public/ 2>/dev/null || true

# Styles and scripts
cp *.css public/ 2>/dev/null || true
cp *.js public/ 2>/dev/null || true

# Favicon and config
cp favicon.ico public/ 2>/dev/null || true
cp content.json manifest.json public/ 2>/dev/null || true

# Icons and API
cp -r icons/* public/icons/ 2>/dev/null || true
cp api/*.js public/api/ 2>/dev/null || true

# Ensure key files exist
[ -f public/index.html ] && echo "OK: index.html" || echo "MISSING: index.html"
[ -f public/landing.html ] && echo "OK: landing.html" || echo "MISSING: landing.html"
wc -c public/index.html public/landing.html 2>/dev/null || true
