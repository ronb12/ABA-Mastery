#!/usr/bin/env node
// Verify all study materials follow consistent formatting

const fs = require('fs');

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');
console.log('║              📋 STUDY MATERIALS FORMAT VERIFICATION 📋                        ║');
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

let totalTopics = 0;
let topicsWithParagraphs = 0;
let topicsWithHeaders = 0;
let topicsWithProperFormat = 0;
const issues = [];

console.log('📊 ANALYZING ALL STUDY TOPICS:\n');

content.categories.forEach(category => {
    console.log(`\n📁 Category: ${category.name} (${category.topics.length} topics)`);
    console.log('─'.repeat(80));
    
    category.topics.forEach(topic => {
        totalTopics++;
        
        const hasParagraphBreaks = topic.content.includes('\n\n');
        const headerMatches = topic.content.match(/([A-Z\s&,'()]+:)/g);
        const hasHeaders = headerMatches && headerMatches.length > 0;
        const wordCount = topic.content.split(/\s+/).length;
        
        if (hasParagraphBreaks) topicsWithParagraphs++;
        if (hasHeaders) topicsWithHeaders++;
        
        const isProperlyFormatted = hasParagraphBreaks && hasHeaders;
        if (isProperlyFormatted) topicsWithProperFormat++;
        
        const status = isProperlyFormatted ? '✅' : '⚠️';
        
        console.log(`\n   ${status} ${topic.title}`);
        console.log(`      ID: ${topic.id}`);
        console.log(`      Words: ${wordCount}`);
        console.log(`      Paragraph breaks: ${hasParagraphBreaks ? 'Yes ✓' : 'No ✗'}`);
        console.log(`      Section headers: ${hasHeaders ? `Yes (${headerMatches.length}) ✓` : 'No ✗'}`);
        
        if (!isProperlyFormatted) {
            issues.push({
                category: category.name,
                topic: topic.title,
                id: topic.id,
                missingParagraphs: !hasParagraphBreaks,
                missingHeaders: !hasHeaders,
                wordCount: wordCount
            });
        }
    });
});

console.log('\n\n' + '═'.repeat(80));
console.log('\n📊 SUMMARY STATISTICS:\n');

console.log(`   Total Study Topics: ${totalTopics}`);
console.log(`   Topics with paragraph breaks (\\n\\n): ${topicsWithParagraphs} (${Math.round(topicsWithParagraphs/totalTopics*100)}%)`);
console.log(`   Topics with section headers: ${topicsWithHeaders} (${Math.round(topicsWithHeaders/totalTopics*100)}%)`);
console.log(`   Topics with proper format: ${topicsWithProperFormat} (${Math.round(topicsWithProperFormat/totalTopics*100)}%)`);

if (issues.length > 0) {
    console.log('\n\n' + '═'.repeat(80));
    console.log('\n⚠️ FORMATTING ISSUES FOUND:\n');
    
    issues.forEach((issue, index) => {
        console.log(`\n   ${index + 1}. ${issue.topic} (${issue.id})`);
        console.log(`      Category: ${issue.category}`);
        console.log(`      Word Count: ${issue.wordCount}`);
        if (issue.missingParagraphs) {
            console.log(`      ❌ Missing paragraph breaks`);
        }
        if (issue.missingHeaders) {
            console.log(`      ❌ Missing section headers`);
        }
    });
    
    console.log('\n\n   RECOMMENDATION: Update these topics to include:');
    console.log('   1. Paragraph breaks (\\n\\n between sections)');
    console.log('   2. Section headers (ALL CAPS followed by colon)');
    console.log('   3. Consistent formatting like the newly added topics\n');
} else {
    console.log('\n\n' + '═'.repeat(80));
    console.log('\n✅ ALL TOPICS PROPERLY FORMATTED!\n');
    console.log('   All 47 study topics have:');
    console.log('   • Proper paragraph breaks (\\n\\n)');
    console.log('   • Section headers (ALL CAPS:)');
    console.log('   • Consistent formatting throughout');
    console.log('   • Ready for display with enhanced formatting!\n');
}

console.log('═'.repeat(80));

console.log('\n📋 FORMAT REQUIREMENTS CHECKLIST:\n');
console.log('   ✓ Paragraph breaks: \\n\\n between major sections');
console.log('   ✓ Section headers: ALL CAPS TEXT followed by colon');
console.log('   ✓ Examples: "HISTORICAL FOUNDATIONS:", "REINFORCEMENT:"');
console.log('   ✓ Line breaks within paragraphs: \\n for lists/steps');
console.log('   ✓ Consistent voice and tone');
console.log('   ✓ Professional, educational content\n');

console.log('═'.repeat(80));

console.log('\n🎯 FINAL VERDICT:\n');

if (topicsWithProperFormat === totalTopics) {
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                               ║');
    console.log('║                  ✅ ALL STUDY MATERIALS PROPERLY FORMATTED ✅                  ║');
    console.log('║                                                                               ║');
    console.log(`║   ${totalTopics} out of ${totalTopics} topics have consistent formatting                          ║`);
    console.log('║   • Paragraph breaks: 100% ✅                                                 ║');
    console.log('║   • Section headers: 100% ✅                                                  ║');
    console.log('║   • Display-ready: 100% ✅                                                    ║');
    console.log('║                                                                               ║');
    console.log('║   All study materials will display beautifully with:                          ║');
    console.log('║   • Proper spacing between paragraphs                                         ║');
    console.log('║   • Bold, colored section headers                                             ║');
    console.log('║   • Professional textbook appearance                                          ║');
    console.log('║                                                                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
} else {
    const percentage = Math.round(topicsWithProperFormat/totalTopics*100);
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                               ║');
    console.log(`║                  ⚠️  ${percentage}% OF TOPICS PROPERLY FORMATTED ⚠️                    ║`);
    console.log('║                                                                               ║');
    console.log(`║   ${topicsWithProperFormat} out of ${totalTopics} topics have consistent formatting                      ║`);
    console.log(`║   ${issues.length} topics need formatting updates                                        ║`);
    console.log('║                                                                               ║');
    console.log('║   ACTION NEEDED: Update topics to match new format                            ║');
    console.log('║                                                                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
}

console.log('\n');

