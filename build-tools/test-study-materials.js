#!/usr/bin/env node
// Comprehensive Puppeteer Test for All Study Materials
// Tests: Expansion, Formatting, Coverage

const puppeteer = require('puppeteer');
const fs = require('fs');

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                               ║');
console.log('║              🧪 STUDY MATERIALS COMPREHENSIVE TEST 🧪                          ║');
console.log('║                                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

const APP_URL = 'https://aba-mastery-app.web.app';
const results = {
    totalTopics: 0,
    tested: 0,
    passed: 0,
    failed: 0,
    topics: []
};

async function testStudyMaterials() {
    console.log('🚀 Launching browser...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`📱 Navigating to: ${APP_URL}\n`);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-screenshot-1-landing.png' });
    console.log('📸 Screenshot 1: Landing page');
    
    // Check if we're on landing page or app page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}\n`);
    
    // If on landing, navigate to app
    if (currentUrl.includes('landing') || !currentUrl.includes('/app')) {
        console.log('On landing page, looking for app link...');
        try {
            // Click "Get Started" or app link
            await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a, button'));
                const appLink = links.find(l => 
                    l.textContent.includes('Get Started') || 
                    l.textContent.includes('Launch App') ||
                    l.href && l.href.includes('/app')
                );
                if (appLink) appLink.click();
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            // Try direct navigation
            await page.goto(APP_URL + '/app.html', { waitUntil: 'networkidle2' });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    await page.screenshot({ path: 'test-screenshot-2-app.png' });
    console.log('📸 Screenshot 2: App page\n');
    
    // Navigate to Study view
    console.log('📚 Navigating to Study section...\n');
    try {
        // Wait for navigation to be visible
        await page.waitForSelector('.nav-item, .navigation button', { timeout: 5000 });
        
        // Click Study navigation
        await page.evaluate(() => {
            const navButtons = Array.from(document.querySelectorAll('.nav-item, button[data-view], .navigation button'));
            const studyBtn = navButtons.find(btn => 
                btn.textContent.toLowerCase().includes('study') ||
                btn.getAttribute('data-view') === 'study'
            );
            if (studyBtn) studyBtn.click();
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.screenshot({ path: 'test-screenshot-3-study.png' });
        console.log('📸 Screenshot 3: Study view\n');
    } catch (e) {
        console.log('⚠️  Error navigating to Study:', e.message);
    }
    
    // Get all study topics
    console.log('🔍 Finding all study topics...\n');
    
    // Try multiple selectors
    let topicCards = await page.$$('.topic-card');
    if (topicCards.length === 0) {
        topicCards = await page.$$('.study-topic, .topic-item, [data-topic-id]');
    }
    
    results.totalTopics = topicCards.length;
    
    console.log(`Found ${results.totalTopics} study topics\n`);
    console.log('─'.repeat(80) + '\n');
    
    // Test each topic
    for (let i = 0; i < topicCards.length; i++) {
        results.tested++;
        
        // Re-query topic cards to avoid stale elements
        const cards = await page.$$('.topic-card');
        const card = cards[i];
        
        // Get topic title
        const titleElement = await card.$('h3');
        const title = await page.evaluate(el => el.textContent, titleElement);
        
        console.log(`\n📖 Testing ${i + 1}/${results.totalTopics}: ${title}`);
        
        const testResult = {
            number: i + 1,
            title: title,
            wordCount: 0,
            hasParagraphs: false,
            hasHeaders: false,
            properFormatting: false,
            contentQuality: '',
            status: 'FAIL'
        };
        
        try {
            // Click the topic card
            await card.click();
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Wait for modal to appear
            await page.waitForSelector('.modal', { timeout: 5000 });
            
            // Get the content
            const contentElement = await page.$('.topic-full-content');
            if (!contentElement) {
                throw new Error('Content element not found');
            }
            
            // Check for paragraphs
            const paragraphs = await contentElement.$$('p');
            testResult.hasParagraphs = paragraphs.length > 0;
            
            // Check for section headers
            const headers = await contentElement.$$('strong.section-header');
            testResult.hasHeaders = headers.length > 0;
            
            // Get all text content
            const textContent = await page.evaluate(el => el.textContent, contentElement);
            const words = textContent.trim().split(/\s+/);
            testResult.wordCount = words.length;
            
            // Evaluate content quality
            if (testResult.wordCount >= 300) {
                testResult.contentQuality = 'Comprehensive';
            } else if (testResult.wordCount >= 100) {
                testResult.contentQuality = 'Adequate';
            } else if (testResult.wordCount >= 40) {
                testResult.contentQuality = 'Brief';
            } else {
                testResult.contentQuality = 'Too Short';
            }
            
            // Check formatting
            const hasProperSpacing = paragraphs.length > 1;
            testResult.properFormatting = testResult.hasParagraphs && hasProperSpacing;
            
            // Determine pass/fail
            const meetsMinimumLength = testResult.wordCount >= 40;
            const hasBasicFormatting = testResult.hasParagraphs;
            
            if (meetsMinimumLength && hasBasicFormatting) {
                testResult.status = 'PASS';
                results.passed++;
            } else {
                results.failed++;
            }
            
            // Log results
            console.log(`   Word Count: ${testResult.wordCount} words`);
            console.log(`   Quality: ${testResult.contentQuality}`);
            console.log(`   Paragraphs: ${testResult.hasParagraphs ? '✅ Yes' : '❌ No'} (${paragraphs.length} found)`);
            console.log(`   Section Headers: ${testResult.hasHeaders ? '✅ Yes' : '⚠️  No'} (${headers.length} found)`);
            console.log(`   Proper Formatting: ${testResult.properFormatting ? '✅ Yes' : '⚠️  No'}`);
            console.log(`   Status: ${testResult.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
            
            // Close modal
            await page.click('.close-btn, .modal .btn-primary');
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`   ❌ Error testing topic: ${error.message}`);
            testResult.status = 'ERROR';
            results.failed++;
        }
        
        results.topics.push(testResult);
    }
    
    await browser.close();
}

async function generateReport() {
    console.log('\n\n' + '═'.repeat(80));
    console.log('\n📊 TEST SUMMARY:\n');
    
    console.log(`   Total Topics:    ${results.totalTopics}`);
    console.log(`   Tested:          ${results.tested}`);
    console.log(`   Passed:          ${results.passed} (${Math.round(results.passed/results.tested*100)}%)`);
    console.log(`   Failed:          ${results.failed}`);
    
    // Categorize by quality
    const comprehensive = results.topics.filter(t => t.contentQuality === 'Comprehensive');
    const adequate = results.topics.filter(t => t.contentQuality === 'Adequate');
    const brief = results.topics.filter(t => t.contentQuality === 'Brief');
    const tooShort = results.topics.filter(t => t.contentQuality === 'Too Short');
    
    console.log('\n📚 CONTENT QUALITY BREAKDOWN:\n');
    console.log(`   Comprehensive (300+ words): ${comprehensive.length} topics`);
    console.log(`   Adequate (100-299 words):   ${adequate.length} topics`);
    console.log(`   Brief (40-99 words):        ${brief.length} topics`);
    console.log(`   Too Short (<40 words):      ${tooShort.length} topics`);
    
    // Formatting stats
    const withHeaders = results.topics.filter(t => t.hasHeaders).length;
    const withProperFormat = results.topics.filter(t => t.properFormatting).length;
    
    console.log('\n🎨 FORMATTING STATISTICS:\n');
    console.log(`   Topics with Paragraphs:      ${results.topics.filter(t => t.hasParagraphs).length} (${Math.round(results.topics.filter(t => t.hasParagraphs).length/results.tested*100)}%)`);
    console.log(`   Topics with Section Headers: ${withHeaders} (${Math.round(withHeaders/results.tested*100)}%)`);
    console.log(`   Topics with Proper Format:   ${withProperFormat} (${Math.round(withProperFormat/results.tested*100)}%)`);
    
    // List comprehensive topics
    if (comprehensive.length > 0) {
        console.log('\n✅ COMPREHENSIVE TOPICS:\n');
        comprehensive.forEach(t => {
            console.log(`   ${t.number}. ${t.title} (${t.wordCount} words, ${t.hasHeaders ? 'with headers' : 'no headers'})`);
        });
    }
    
    // List brief topics
    if (brief.length > 0) {
        console.log('\n⚠️  BRIEF TOPICS (Consider Expansion):\n');
        brief.slice(0, 10).forEach(t => {
            console.log(`   ${t.number}. ${t.title} (${t.wordCount} words)`);
        });
        if (brief.length > 10) {
            console.log(`   ... and ${brief.length - 10} more brief topics`);
        }
    }
    
    // List failures
    const failures = results.topics.filter(t => t.status === 'FAIL' || t.status === 'ERROR');
    if (failures.length > 0) {
        console.log('\n❌ FAILED TESTS:\n');
        failures.forEach(t => {
            console.log(`   ${t.number}. ${t.title} - ${t.status}`);
        });
    }
    
    // Generate JSON report
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total: results.totalTopics,
            tested: results.tested,
            passed: results.passed,
            failed: results.failed,
            passRate: Math.round(results.passed/results.tested*100)
        },
        quality: {
            comprehensive: comprehensive.length,
            adequate: adequate.length,
            brief: brief.length,
            tooShort: tooShort.length
        },
        formatting: {
            withParagraphs: results.topics.filter(t => t.hasParagraphs).length,
            withHeaders: withHeaders,
            properFormat: withProperFormat
        },
        topics: results.topics
    };
    
    fs.writeFileSync('study-materials-test-report.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n═'.repeat(80));
    console.log('\n✅ Test complete! Report saved to: study-materials-test-report.json\n');
    
    // Final verdict
    const passPercentage = Math.round(results.passed/results.tested*100);
    
    console.log('═'.repeat(80));
    console.log('\n🎯 FINAL VERDICT:\n');
    
    if (passPercentage >= 90) {
        console.log('   ✅ EXCELLENT: Study materials are well-formatted and comprehensive!');
    } else if (passPercentage >= 75) {
        console.log('   ✅ GOOD: Most study materials are properly formatted.');
    } else if (passPercentage >= 50) {
        console.log('   ⚠️  FAIR: Some study materials need improvement.');
    } else {
        console.log('   ❌ NEEDS WORK: Many study materials require attention.');
    }
    
    console.log(`\n   Pass Rate: ${passPercentage}%`);
    console.log(`   Comprehensive Topics: ${comprehensive.length}/${results.totalTopics}`);
    console.log(`   All Topics Display Properly: ${results.topics.filter(t => t.hasParagraphs).length === results.totalTopics ? 'YES ✅' : 'SOME ISSUES ⚠️'}`);
    console.log('\n═'.repeat(80) + '\n');
}

// Run the test
(async () => {
    try {
        await testStudyMaterials();
        await generateReport();
    } catch (error) {
        console.error('\n❌ Test failed with error:', error);
        process.exit(1);
    }
})();

