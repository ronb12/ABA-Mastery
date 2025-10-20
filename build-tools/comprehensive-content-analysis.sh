#!/bin/bash
# Comprehensive Content Analysis

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║     ABA MASTERY - COMPREHENSIVE CONTENT ANALYSIS              ║"
echo "║     Comparing to BACB Task List & Cooper Textbook             ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo "📊 ANALYZING content.json..."
echo ""

# Count study topics
echo "📚 STUDY TOPICS:"
grep -o '"title": "[^"]*"' content.json | head -50 | nl
echo ""

# Count total categories
echo "📂 CATEGORIES COVERED:"
grep '"name":' content.json | grep -v "displayName" | grep -v "userName" | head -15
echo ""

# Count questions per category
echo "📝 PRACTICE QUESTIONS BY CATEGORY:"
grep -o '"category": "[^"]*"' content.json | sort | uniq -c | sort -rn
echo ""

# Count flashcards
echo "🎴 FLASHCARDS:"
grep -c '"id": "fc' content.json
echo "flashcards found"
echo ""

# Check metadata
echo "📊 METADATA:"
grep -A 10 '"metadata":' content.json | head -15
echo ""

echo "✅ Analysis complete!"
