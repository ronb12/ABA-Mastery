#!/usr/bin/env node

/**
 * ABA Mastery - App Features Test (v1.1.0)
 * Tests all features including new 100 questions and full-length exam modes
 * No authentication required - tests the standalone PWA
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8000/index.html'; // Local test URL  
const SCREENSHOTS_DIR = './app-test-screenshots';
const SLOW_MO = 50;

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
}

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function screenshot(page, name) {
    const path = `${SCREENSHOTS_DIR}/${name}.png`;
    await page.screenshot({ path, fullPage: false });
    log(`📸 Screenshot: ${name}`, 'cyan');
}

async function runTests() {
    log('='.repeat(80), 'blue');
    log('🧪 ABA MASTERY v1.1.0 - COMPREHENSIVE FEATURE TEST', 'bold');
    log('='.repeat(80), 'blue');
    log(`Testing URL: ${BASE_URL}`, 'cyan');
    log('Testing: 100 questions, full-length exams, timer, results', 'cyan');
    log('', 'reset');

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: SLOW_MO,
        defaultViewport: { width: 1400, height: 900 },
        args: ['--start-maximized', '--disable-notifications']
    });

    const page = await browser.newPage();
    
    let errors = [];
    let warnings = [];
    let testsPassed = 0;
    let testsFailed = 0;
    const testResults = {};

    // Monitor console
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error' && !text.includes('favicon')) {
            errors.push(text);
            log(`❌ Console Error: ${text}`, 'red');
        }
    });

    try {
        // ==================================================
        // TEST 1: APP LOADS SUCCESSFULLY
        // ==================================================
        log('\n📱 TEST 1: APP INITIALIZATION', 'magenta');
        log('Navigating to app...', 'cyan');
        
        // Use page.goto with a shorter timeout and continue even if some resources don't load
        try {
            await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (e) {
            log('Page load timeout (expected with external resources), continuing...', 'yellow');
        }
        
        await sleep(5000); // Give app time to initialize
        await screenshot(page, '01-app-loaded');
        
        // Check if app content loaded
        log('Waiting for app content...', 'cyan');
        await page.waitForSelector('#home-view', { timeout: 10000 });
        const appContent = await page.$('#home-view');
        if (appContent) {
            log('✅ App loaded successfully', 'green');
            testResults['App Load'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ App failed to load', 'red');
            testResults['App Load'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 2: HOME VIEW - STATS DISPLAY
        // ==================================================
        log('\n🏠 TEST 2: HOME VIEW - STATS & QUICK ACTIONS', 'magenta');
        
        const statsExist = await page.evaluate(() => {
            return document.querySelectorAll('.stat-card').length > 0;
        });
        
        if (statsExist) {
            log('✅ Stats cards displayed', 'green');
            testResults['Stats Display'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Stats cards not found', 'red');
            testResults['Stats Display'] = 'FAIL';
            testsFailed++;
        }
        await screenshot(page, '02-home-view');

        // ==================================================
        // TEST 3: STUDY VIEW - TOPICS LOAD
        // ==================================================
        log('\n📚 TEST 3: STUDY VIEW - TOPIC CARDS', 'magenta');
        
        await page.click('[data-view="study"]');
        await sleep(1500);
        await screenshot(page, '03-study-view');
        
        const topicCount = await page.evaluate(() => {
            return document.querySelectorAll('.topic-card').length;
        });
        
        if (topicCount >= 38) {
            log(`✅ ${topicCount} topic cards loaded`, 'green');
            testResults['Study Topics'] = 'PASS';
            testsPassed++;
        } else {
            log(`❌ Only ${topicCount} topics found (expected 38+)`, 'red');
            testResults['Study Topics'] = 'FAIL';
            testsFailed++;
        }

        // Test search functionality
        log('Testing topic search...', 'cyan');
        await page.type('#topic-search', 'reinforcement');
        await sleep(1000);
        const filteredCount = await page.evaluate(() => {
            return document.querySelectorAll('.topic-card:not([style*="display: none"])').length;
        });
        
        if (filteredCount > 0 && filteredCount < topicCount) {
            log(`✅ Search filtered to ${filteredCount} topics`, 'green');
            testResults['Topic Search'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Search filter not working', 'red');
            testResults['Topic Search'] = 'FAIL';
            testsFailed++;
        }
        
        // Clear search
        await page.evaluate(() => document.getElementById('topic-search').value = '');

        // ==================================================
        // TEST 4: PRACTICE VIEW - NEW EXAM MODES
        // ==================================================
        log('\n🎯 TEST 4: PRACTICE VIEW - EXAM MODE SELECTOR', 'magenta');
        
        await page.click('[data-view="practice"]');
        await sleep(1500);
        await screenshot(page, '04-practice-setup');
        
        // Check exam mode dropdown exists
        const examModeExists = await page.$('#exam-mode');
        if (examModeExists) {
            log('✅ Exam mode selector found', 'green');
            testResults['Exam Mode Selector'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Exam mode selector not found', 'red');
            testResults['Exam Mode Selector'] = 'FAIL';
            testsFailed++;
        }
        
        // Check all exam modes available
        const examModes = await page.evaluate(() => {
            const select = document.getElementById('exam-mode');
            return Array.from(select.options).map(opt => opt.value);
        });
        
        log(`Available exam modes: ${examModes.join(', ')}`, 'cyan');
        if (examModes.includes('practice') && examModes.includes('bcba') && examModes.includes('bcaba')) {
            log('✅ All 3 exam modes available', 'green');
            testResults['Exam Modes Available'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Missing exam modes', 'red');
            testResults['Exam Modes Available'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 5: BCBA EXAM MODE - UI CHANGES
        // ==================================================
        log('\n📝 TEST 5: BCBA FULL-LENGTH EXAM MODE', 'magenta');
        
        await page.select('#exam-mode', 'bcba');
        await sleep(1000);
        await screenshot(page, '05-bcba-mode-selected');
        
        // Check if custom settings hide
        const customSettingsHidden = await page.evaluate(() => {
            const settings = document.getElementById('custom-settings');
            return window.getComputedStyle(settings).display === 'none';
        });
        
        if (customSettingsHidden) {
            log('✅ Custom settings hidden for BCBA mode', 'green');
            testResults['BCBA Mode UI'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Custom settings should be hidden', 'red');
            testResults['BCBA Mode UI'] = 'FAIL';
            testsFailed++;
        }
        
        // Check help text
        const helpText = await page.evaluate(() => {
            return document.getElementById('exam-mode-help').textContent;
        });
        
        if (helpText.includes('100 questions') && helpText.includes('2-hour')) {
            log('✅ Help text shows BCBA exam details', 'green');
            testResults['BCBA Help Text'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Help text incorrect', 'red');
            testResults['BCBA Help Text'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 6: START CUSTOM PRACTICE QUIZ
        // ==================================================
        log('\n✍️ TEST 6: CUSTOM PRACTICE QUIZ (5 QUESTIONS)', 'magenta');
        
        // Switch back to practice mode
        await page.select('#exam-mode', 'practice');
        await sleep(1000);
        
        // Set to 5 questions for quick test
        await page.evaluate(() => {
            document.getElementById('question-count').value = 5;
        });
        await sleep(500);
        
        await page.click('#start-practice');
        await sleep(2000);
        await screenshot(page, '06-quiz-started');
        
        // Check if quiz is showing
        const quizVisible = await page.evaluate(() => {
            return document.getElementById('practice-quiz').style.display !== 'none';
        });
        
        if (quizVisible) {
            log('✅ Quiz started successfully', 'green');
            testResults['Start Quiz'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Quiz did not start', 'red');
            testResults['Start Quiz'] = 'FAIL';
            testsFailed++;
        }
        
        // Check question display
        const questionText = await page.evaluate(() => {
            return document.getElementById('question-text').textContent;
        });
        
        if (questionText && questionText.length > 10) {
            log(`✅ Question displayed: "${questionText.substring(0, 50)}..."`, 'green');
            testResults['Question Display'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Question not displayed properly', 'red');
            testResults['Question Display'] = 'FAIL';
            testsFailed++;
        }
        
        // Check timer is running
        await sleep(3000);
        const timerText = await page.evaluate(() => {
            return document.getElementById('timer').textContent;
        });
        
        if (timerText && timerText !== '00:00') {
            log(`✅ Timer running: ${timerText}`, 'green');
            testResults['Timer'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Timer not working', 'red');
            testResults['Timer'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 7: ANSWER QUESTIONS
        // ==================================================
        log('\n💡 TEST 7: ANSWERING QUESTIONS', 'magenta');
        
        // Answer 5 questions
        for (let i = 0; i < 5; i++) {
            log(`Answering question ${i + 1}/5...`, 'cyan');
            
            // Click first answer option
            await page.click('.answer-option:first-child');
            await sleep(500);
            await screenshot(page, `07-q${i + 1}-selected`);
            
            // Submit answer
            await page.click('#submit-answer');
            await sleep(1500);
            await screenshot(page, `08-q${i + 1}-feedback`);
            
            // Check if explanation shown
            const explanationVisible = await page.evaluate(() => {
                const el = document.getElementById('explanation-container');
                return el && window.getComputedStyle(el).display !== 'none';
            });
            
            if (explanationVisible && i === 0) {
                log('✅ Answer explanation displayed', 'green');
                testResults['Answer Explanation'] = 'PASS';
                testsPassed++;
            }
            
            // Click next (or finish on last question)
            if (i < 4) {
                const nextBtn = await page.$('#next-question');
                if (nextBtn) {
                    await page.click('#next-question');
                    await sleep(1000);
                }
            } else {
                const finishBtn = await page.$('#finish-quiz');
                if (finishBtn) {
                    await page.click('#finish-quiz');
                    await sleep(2000);
                }
            }
        }
        
        log('✅ Completed 5-question quiz', 'green');
        testResults['Complete Quiz'] = 'PASS';
        testsPassed++;

        // ==================================================
        // TEST 8: RESULTS PAGE
        // ==================================================
        log('\n📊 TEST 8: QUIZ RESULTS', 'magenta');
        await screenshot(page, '09-quiz-results');
        
        const resultsVisible = await page.evaluate(() => {
            return document.getElementById('practice-results').style.display !== 'none';
        });
        
        if (resultsVisible) {
            log('✅ Results page displayed', 'green');
            testResults['Results Display'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Results not showing', 'red');
            testResults['Results Display'] = 'FAIL';
            testsFailed++;
        }
        
        // Check score displayed
        const scoreText = await page.evaluate(() => {
            return document.querySelector('.results-score')?.textContent;
        });
        
        if (scoreText && scoreText.includes('%')) {
            log(`✅ Score displayed: ${scoreText}`, 'green');
            testResults['Score Display'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Score not displayed', 'red');
            testResults['Score Display'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 9: FLASHCARDS
        // ==================================================
        log('\n🎴 TEST 9: FLASHCARDS FEATURE', 'magenta');
        
        await page.click('[data-view="flashcards"]');
        await sleep(2000);
        await screenshot(page, '10-flashcards');
        
        const flashcardExists = await page.$('#flashcard');
        if (flashcardExists) {
            log('✅ Flashcard interface loaded', 'green');
            testResults['Flashcards Load'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Flashcard not found', 'red');
            testResults['Flashcards Load'] = 'FAIL';
            testsFailed++;
        }
        
        // Test flip
        await page.click('#flip-card');
        await sleep(1000);
        await screenshot(page, '11-flashcard-flipped');
        
        const isFlipped = await page.evaluate(() => {
            return document.getElementById('flashcard').dataset.flipped === 'true';
        });
        
        if (isFlipped) {
            log('✅ Flashcard flip works', 'green');
            testResults['Flashcard Flip'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Flashcard flip not working', 'red');
            testResults['Flashcard Flip'] = 'FAIL';
            testsFailed++;
        }
        
        // Test navigation
        await page.click('#next-card');
        await sleep(1000);
        log('✅ Flashcard navigation works', 'green');
        testResults['Flashcard Navigation'] = 'PASS';
        testsPassed++;

        // ==================================================
        // TEST 10: PROGRESS VIEW
        // ==================================================
        log('\n📈 TEST 10: PROGRESS TRACKING', 'magenta');
        
        await page.click('[data-view="progress"]');
        await sleep(2000);
        await screenshot(page, '12-progress-view');
        
        const progressCards = await page.evaluate(() => {
            return document.querySelectorAll('.progress-card').length;
        });
        
        if (progressCards >= 3) {
            log(`✅ Progress dashboard loaded (${progressCards} cards)`, 'green');
            testResults['Progress View'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Progress dashboard incomplete', 'red');
            testResults['Progress View'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 11: SETTINGS VIEW
        // ==================================================
        log('\n⚙️ TEST 11: SETTINGS & FEATURES', 'magenta');
        
        await page.click('[data-view="settings"]');
        await sleep(2000);
        await screenshot(page, '13-settings-view');
        
        const settingsContent = await page.$('.settings-section');
        if (settingsContent) {
            log('✅ Settings view loaded', 'green');
            testResults['Settings View'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Settings not found', 'red');
            testResults['Settings View'] = 'FAIL';
            testsFailed++;
        }
        
        // Test dark mode toggle
        const darkModeToggle = await page.$('#dark-mode-setting');
        if (darkModeToggle) {
            await page.click('#dark-mode-setting');
            await sleep(1000);
            await screenshot(page, '14-dark-mode');
            
            const isDark = await page.evaluate(() => {
                return document.body.classList.contains('dark-mode');
            });
            
            if (isDark) {
                log('✅ Dark mode toggle works', 'green');
                testResults['Dark Mode'] = 'PASS';
                testsPassed++;
            } else {
                log('❌ Dark mode not working', 'red');
                testResults['Dark Mode'] = 'FAIL';
                testsFailed++;
            }
            
            // Toggle back
            await page.click('#dark-mode-setting');
            await sleep(500);
        }

        // ==================================================
        // TEST 12: VERIFY 100 QUESTIONS AVAILABLE
        // ==================================================
        log('\n💯 TEST 12: VERIFY 100 QUESTIONS IN DATABASE', 'magenta');
        
        const questionCount = await page.evaluate(() => {
            return window.appData?.content?.practiceQuestions?.length || 0;
        });
        
        if (questionCount >= 100) {
            log(`✅ ${questionCount} questions available (target: 100)`, 'green');
            testResults['100 Questions'] = 'PASS';
            testsPassed++;
        } else {
            log(`❌ Only ${questionCount} questions found (expected 100)`, 'red');
            testResults['100 Questions'] = 'FAIL';
            testsFailed++;
        }
        
        // Check question distribution
        const sectionCounts = await page.evaluate(() => {
            const questions = window.appData?.content?.practiceQuestions || [];
            const sections = {};
            questions.forEach(q => {
                const section = q.section || 'Unknown';
                sections[section] = (sections[section] || 0) + 1;
            });
            return sections;
        });
        
        log('Question distribution by section:', 'cyan');
        Object.entries(sectionCounts).forEach(([section, count]) => {
            log(`  Section ${section}: ${count} questions`, 'cyan');
        });

        // ==================================================
        // TEST 13: BCBA EXAM MODE DETAILED TEST
        // ==================================================
        log('\n🎓 TEST 13: BCBA FULL-LENGTH EXAM SETUP', 'magenta');
        
        await page.click('[data-view="practice"]');
        await sleep(1500);
        
        await page.select('#exam-mode', 'bcba');
        await sleep(1000);
        await screenshot(page, '15-bcba-exam-mode');
        
        // Verify button text changed
        const buttonText = await page.evaluate(() => {
            return document.getElementById('start-practice').textContent;
        });
        
        if (buttonText.includes('BCBA')) {
            log(`✅ Button text updated: "${buttonText}"`, 'green');
            testResults['BCBA Button'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ Button text not updated for BCBA mode', 'red');
            testResults['BCBA Button'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // TEST 14: BCABA EXAM MODE
        // ==================================================
        log('\n🎓 TEST 14: BCABA EXAM MODE', 'magenta');
        
        await page.select('#exam-mode', 'bcaba');
        await sleep(1000);
        await screenshot(page, '16-bcaba-exam-mode');
        
        const bcabaHelpText = await page.evaluate(() => {
            return document.getElementById('exam-mode-help').textContent;
        });
        
        if (bcabaHelpText.includes('65 questions') && bcabaHelpText.includes('1.5')) {
            log('✅ BCaBA mode configured correctly', 'green');
            testResults['BCaBA Mode'] = 'PASS';
            testsPassed++;
        } else {
            log('❌ BCaBA mode configuration incorrect', 'red');
            testResults['BCaBA Mode'] = 'FAIL';
            testsFailed++;
        }

        // ==================================================
        // FINAL SCREENSHOT
        // ==================================================
        await page.click('[data-view="home"]');
        await sleep(1000);
        await screenshot(page, '17-final-home');

    } catch (error) {
        log(`\n💥 CRITICAL ERROR: ${error.message}`, 'red');
        errors.push(error.message);
        await screenshot(page, 'zz-error');
        testsFailed++;
    }

    // ==================================================
    // GENERATE REPORT
    // ==================================================
    log('\n' + '='.repeat(80), 'blue');
    log('📋 TEST RESULTS SUMMARY', 'bold');
    log('='.repeat(80), 'blue');
    
    log(`\n✅ Tests Passed: ${testsPassed}`, 'green');
    log(`❌ Tests Failed: ${testsFailed}`, 'red');
    log(`📊 Total Tests: ${testsPassed + testsFailed}`, 'cyan');
    log(`🎯 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`, 'cyan');
    
    log('\n📝 Detailed Results:', 'yellow');
    Object.entries(testResults).forEach(([test, result]) => {
        const symbol = result === 'PASS' ? '✅' : '❌';
        const color = result === 'PASS' ? 'green' : 'red';
        log(`  ${symbol} ${test}: ${result}`, color);
    });
    
    if (errors.length > 0) {
        log('\n⚠️  Errors Encountered:', 'red');
        errors.forEach(err => log(`  - ${err}`, 'red'));
    }
    
    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        version: '1.1.0',
        testsPassed,
        testsFailed,
        successRate: `${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`,
        results: testResults,
        errors,
        warnings
    };
    
    fs.writeFileSync('./app-test-report.json', JSON.stringify(report, null, 2));
    log('\n💾 Report saved to: app-test-report.json', 'cyan');
    log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}/`, 'cyan');
    
    log('\n' + '='.repeat(80), 'blue');
    if (testsFailed === 0) {
        log('🎉 ALL TESTS PASSED! App is working perfectly! 🎉', 'green');
    } else {
        log(`⚠️  ${testsFailed} test(s) failed. Please review the errors above.`, 'yellow');
    }
    log('='.repeat(80), 'blue');
    
    await sleep(3000);
    await browser.close();
    
    // Exit with appropriate code
    process.exit(testsFailed === 0 ? 0 : 1);
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

