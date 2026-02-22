#!/bin/bash
# Restore files wiped by sed, then remove AdSense from thin-content pages only.
set -e
cd "$(dirname "$0")"

echo "Restoring from backups..."
for f in index login signup billing; do
  if [ -f "${f}.html.bak" ] && [ ! -s "${f}.html" ]; then
    cp -f "${f}.html.bak" "${f}.html"
    echo "  Restored ${f}.html"
  fi
done

echo "Removing AdSense from thin-content pages (index, login, signup, billing)..."
for file in index.html login.html signup.html billing.html; do
  [ ! -f "$file" ] || [ ! -s "$file" ] && continue
  # Use temp file to avoid sed -i truncation issue on macOS
  sed '/name="google-adsense-account"/d; /Google AdSense/d; /pagead2.googlesyndication.com/d' "$file" > "${file}.new"
  mv "${file}.new" "$file"
  echo "  Updated $file"
done

echo "Done. Deploy with: vercel --prod --yes"
