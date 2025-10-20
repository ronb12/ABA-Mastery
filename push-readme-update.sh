#!/bin/bash

# Push README updates to GitHub
cd "/Users/ronellbradley/Desktop/ABA Mastery"

echo "📝 Adding files..."
git add README.md README-CREDENTIALS-FIXED.md README-DISCLAIMER-ADDED.md

echo ""
echo "💾 Committing changes..."
git commit -m "Update README: fix test credentials and add professional exam success disclaimer"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Check GitHub: https://github.com/ronb12/ABA-Mastery"


