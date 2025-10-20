#!/bin/bash

# Update GitHub with all changes
# Run this script to commit and push all changes to GitHub

echo "🔄 Updating GitHub..."
echo ""

cd "/Users/ronellbradley/Desktop/ABA Mastery"

# Stage all changes
echo "📝 Staging all changes..."
git add .

# Commit with message
echo "💾 Committing changes..."
git commit -m "Major update: Profile management, personalization system, rating system, enhanced AI features (IRT, Bayesian), bug fixes, comprehensive documentation (65+ files changed)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ GitHub updated successfully!"
echo "🔍 View changes at: https://github.com/YOUR-USERNAME/ABA-Mastery"

