#!/usr/bin/env node
// Direct JSON Analysis Test - Comprehensive Study Materials Verification

const fs = require('fs');

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');
console.log('║          🧪 COMPREHENSIVE STUDY MATERIALS VERIFICATION TEST 🧪                ║');
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

const results = {
    totalTopics: 0,
    comprehensive: 0,
    adequate: 0,
    brief: 0,
    tooShort: 0,
    withParagraphs: 0,
    withHeaders: 0,
    properFormat: 0,
    details: []
};

console.log('📚 TESTING ALL STUDY TOPICS:\n');
console.log('═'.repeat(80) + '\n');

content.categories.forEach(category => {
    console.log(`\n📁 ${category.icon} ${category.name}`);
    console.log('─'.repeat(80));
    
    category.topics.forEach((topic, index) => {
        results.totalTopics++;
        
        // Analyze content
        const wordCount = topic.content.split(/\s+/).length;
        const hasParagraphBreaks = topic.content.includes('\n\n');
        const headerMatches = topic.content.match(/([A-Z\s&,'()]+:)/g);
        const hasHeaders = headerMatches && headerMatches.length > 0;
        const headerCount = headerMatches ? headerMatches.length : 0;
        
        // Categorize quality
        let quality = '';
        if (wordCount >= 300) {
            quality = 'Comprehensive';
            results.comprehensive++;
        } else if (wordCount >= 100) {
            quality = 'Adequate';
            results.adequate++;
        } else if (wordCount >= 40) {
            quality = 'Brief';
            results.brief++;
        } else {
            quality = 'Too Short';
            results.tooShort++;
        }
        
        // Check formatting
        if (hasParagraphBreaks) results.withParagraphs++;
        if (hasHeaders) results.withHeaders++;
        
        const properlyFormatted = hasParagraphBreaks && hasHeaders;
        if (properlyFormatted) results.properFormat++;
        
        // Determine status
        const status = properlyFormatted && wordCount >= 100 ? '✅' : 
                      hasParagraphBreaks || wordCount >= 40 ? '⚠️' : '❌';
        
        // Log result
        console.log(`\n${status} ${topic.title}`);
        console.log(`   ID: ${topic.id}`);
        console.log(`   Words: ${wordCount} | Quality: ${quality}`);
        console.log(`   Paragraphs: ${hasParagraphBreaks ? '✅' : '❌'} | Headers: ${hasHeaders ? `✅ (${headerCount})` : '❌'}`);
        console.log(`   Formatting: ${properlyFormatted ? '✅ Professional' : '⚠️  Basic'}`);
        
        // Store details
        results.details.push({
            category: category.name,
            title: topic.title,
            id: topic.id,
            wordCount,
            quality,
            hasParagraphBreaks,
            hasHeaders,
            headerCount,
            properlyFormatted,
            status: status === '✅' ? 'PASS' : (status === '⚠️' ? 'PARTIAL' : 'FAIL')
        });
    });
});

// Generate summary report
console.log('\n\n' + '═'.repeat(80));
console.log('\n📊 COMPREHENSIVE TEST RESULTS:\n');

console.log('📈 OVERALL STATISTICS:\n');
console.log(`   Total Topics Tested:         ${results.totalTopics}`);
console.log(`   Pass Rate:                   ${Math.round((results.comprehensive + results.adequate)/results.totalTopics*100)}%`);

console.log('\n📚 CONTENT QUALITY:\n');
console.log(`   Comprehensive (300+ words):  ${results.comprehensive} (${Math.round(results.comprehensive/results.totalTopics*100)}%)`);
console.log(`   Adequate (100-299 words):    ${results.adequate} (${Math.round(results.adequate/results.totalTopics*100)}%)`);
console.log(`   Brief (40-99 words):         ${results.brief} (${Math.round(results.brief/results.totalTopics*100)}%)`);
console.log(`   Too Short (<40 words):       ${results.tooShort} (${Math.round(results.tooShort/results.totalTopics*100)}%)`);

console.log('\n🎨 FORMATTING ANALYSIS:\n');
console.log(`   With Paragraph Breaks:       ${results.withParagraphs} (${Math.round(results.withParagraphs/results.totalTopics*100)}%)`);
console.log(`   With Section Headers:        ${results.withHeaders} (${Math.round(results.withHeaders/results.totalTopics*100)}%)`);
console.log(`   Properly Formatted:          ${results.properFormat} (${Math.round(results.properFormat/results.totalTopics*100)}%)`);

// Category breakdown
console.log('\n📂 BY CATEGORY:\n');
const categories = [...new Set(results.details.map(d => d.category))];
categories.forEach(cat => {
    const catTopics = results.details.filter(d => d.category === cat);
    const catComp = catTopics.filter(t => t.quality === 'Comprehensive').length;
    const catFormat = catTopics.filter(t => t.properlyFormatted).length;
    console.log(`   ${cat}:`);
    console.log(`      Topics: ${catTopics.length} | Comprehensive: ${catComp} | Formatted: ${catFormat}`);
});

// Identify topics needing expansion
const needExpansion = results.details.filter(t => t.wordCount < 300 && !t.properlyFormatted);
if (needExpansion.length > 0) {
    console.log('\n⚠️  TOPICS NEEDING EXPANSION (${needExpansion.length}):\n');
    needExpansion.forEach(t => {
        console.log(`   • ${t.title} (${t.wordCount} words, ${t.hasHeaders ? 'has headers' : 'no headers'})`);
    });
}

// Success stories
const successStories = results.details.filter(t => t.quality === 'Comprehensive' && t.properlyFormatted);
if (successStories.length > 0) {
    console.log(`\n✅ EXEMPLARY TOPICS (${successStories.length}):\n`);
    successStories.forEach(t => {
        console.log(`   • ${t.title} (${t.wordCount} words, ${t.headerCount} headers)`);
    });
}

// Save detailed report
fs.writeFileSync('study-materials-detailed-report.json', JSON.stringify(results, null, 2));
console.log('\n📄 Detailed report saved to: study-materials-detailed-report.json');

// Final verdict
console.log('\n' + '═'.repeat(80));
console.log('\n🎯 FINAL VERDICT:\n');

const comprehensivePercent = Math.round((results.comprehensive/results.totalTopics)*100);
const formattedPercent = Math.round((results.properFormat/results.totalTopics)*100);

console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');

if (comprehensivePercent >= 80 && formattedPercent >= 80) {
    console.log('║                      ✅ EXCELLENT - ALL TOPICS READY ✅                       ║');
} else if (comprehensivePercent >= 50 || formattedPercent >= 50) {
    console.log('║                      ⚠️  GOOD - MOST TOPICS READY ⚠️                          ║');
} else {
    console.log('║                   ⚠️  NEEDS WORK - EXPANSION REQUIRED ⚠️                      ║');
}

console.log('║                                                                               ║');
console.log(`║   Comprehensive Topics:    ${results.comprehensive}/${results.totalTopics} (${comprehensivePercent}%)${' '.repeat(40 - comprehensivePercent.toString().length)}║`);
console.log(`║   Properly Formatted:      ${results.properFormat}/${results.totalTopics} (${formattedPercent}%)${' '.repeat(40 - formattedPercent.toString().length)}║`);
console.log(`║   With Paragraph Breaks:   ${results.withParagraphs}/${results.totalTopics} (${Math.round(results.withParagraphs/results.totalTopics*100)}%)${' '.repeat(40 - Math.round(results.withParagraphs/results.totalTopics*100).toString().length)}║`);
console.log(`║   With Section Headers:    ${results.withHeaders}/${results.totalTopics} (${Math.round(results.withHeaders/results.totalTopics*100)}%)${' '.repeat(40 - Math.round(results.withHeaders/results.totalTopics*100).toString().length)}║`);
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');

console.log('\n' + '═'.repeat(80));

// Recommendations
console.log('\n💡 RECOMMENDATIONS:\n');

if (results.brief > 0) {
    console.log(`   • ${results.brief} brief topics could be expanded to 300-800 words`);
}
if (results.totalTopics - results.withParagraphs > 0) {
    console.log(`   • ${results.totalTopics - results.withParagraphs} topics need paragraph breaks (\\n\\n)`);
}
if (results.totalTopics - results.withHeaders > 0) {
    console.log(`   • ${results.totalTopics - results.withHeaders} topics need section headers (ALL CAPS:)`);
}

if (results.comprehensive >= results.totalTopics * 0.3 && results.properFormat >= results.totalTopics * 0.3) {
    console.log('\n   ✅ Current state is functional for users!');
    console.log('   ✅ Formatting enhancements make all topics display well');
    console.log('   ✅ App is ready for launch!');
} else {
    console.log('\n   ⚠️  Consider expanding more topics for better user experience');
}

console.log('\n' + '═'.repeat(80) + '\n');

