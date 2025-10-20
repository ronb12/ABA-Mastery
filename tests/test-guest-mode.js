/**
 * Test App in Guest Mode (No Login Required)
 * This tests all pages and features accessible without authentication
 */

const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://aba-mastery-app.web.app';

// Color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, 'cyan');
    console.log('='.repeat(60));
}

function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${status}: ${name}`, color);
    if (details) {
        log(`   ${details}`, 'yellow');
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log('\n' + '█'.repeat(60));
    log('ABA MASTERY - GUEST MODE TEST', 'cyan');
    log('Testing all pages without authentication', 'blue');
    console.log('█'.repeat(60) + '\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const allResults = {
        passed: [],
        failed: []
    };
    
    try {
        const page = await browser.newPage();
        
        // Enable console logging
        page.on('console', msg => {
            if (msg.type() === 'error') {
                log(`   🔴 Console Error: ${msg.text()}`, 'red');
            }
        });
        
        // Track 404 errors
        const errors404 = [];
        page.on('response', response => {
            if (response.status() === 404) {
                errors404.push(response.url());
            }
        });
        
        logSection('TEST 1: Landing Page');
        log('→ Navigating to landing page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        
        const title = await page.title();
        logTest('Page title correct', title.includes('ABA Mastery'), `Title: ${title}`);
        if (title.includes('ABA Mastery')) allResults.passed.push('Landing page title');
        else allResults.failed.push('Landing page title');
        
        logSection('TEST 2: Start as Guest');
        log('→ Clicking Start as Guest button...');
        
        const guestButtonClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => btn.textContent.includes('Guest'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        logTest('Guest button clicked', guestButtonClicked);
        if (guestButtonClicked) allResults.passed.push('Guest button found');
        else allResults.failed.push('Guest button not found');
        
        if (guestButtonClicked) {
            await delay(3000);
            
            const url = page.url();
            const onAppPage = url.includes('app.html');
            logTest('Redirected to app', onAppPage, `URL: ${url}`);
            if (onAppPage) allResults.passed.push('Guest mode redirect');
            else allResults.failed.push('Guest mode redirect failed');
            
            if (onAppPage) {
                logSection('TEST 3: App Navigation');
                
                // Wait for content to load
                await delay(3000);
                
                // Check for navigation
                const navButtons = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    return buttons.map(btn => btn.textContent.trim()).filter(text => text.length > 0);
                });
                
                log(`   Found ${navButtons.length} buttons`, 'blue');
                logTest('Navigation buttons exist', navButtons.length > 0);
                if (navButtons.length > 0) allResults.passed.push(`${navButtons.length} nav buttons`);
                else allResults.failed.push('No nav buttons');
                
                // Test each main view
                const views = [
                    { name: 'Study', keywords: ['Study', 'Topics', 'Materials'] },
                    { name: 'Practice', keywords: ['Practice', 'Questions', 'Quiz'] },
                    { name: 'Flashcards', keywords: ['Flashcards', 'Flash', 'Cards'] },
                    { name: 'Scenarios', keywords: ['Scenarios', 'Scenario'] },
                    { name: 'Case Studies', keywords: ['Case Studies', 'Case', 'Studies'] },
                    { name: 'Progress', keywords: ['Progress', 'Stats', 'Dashboard'] }
                ];
                
                for (const view of views) {
                    logSection(`TEST: ${view.name} View`);
                    
                    // Try to find and click the button
                    const clicked = await page.evaluate((keywords) => {
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const button = buttons.find(btn => {
                            const text = btn.textContent;
                            return keywords.some(kw => text.includes(kw));
                        });
                        if (button) {
                            button.click();
                            return true;
                        }
                        return false;
                    }, view.keywords);
                    
                    if (clicked) {
                        await delay(2000);
                        
                        // Check if view content is visible
                        const viewVisible = await page.evaluate((keywords) => {
                            const allText = document.body.textContent;
                            return keywords.some(kw => allText.includes(kw));
                        }, view.keywords);
                        
                        logTest(`${view.name} accessible`, viewVisible);
                        if (viewVisible) allResults.passed.push(`${view.name} view`);
                        else allResults.failed.push(`${view.name} view not visible`);
                        
                        await page.screenshot({ 
                            path: `tests/screenshots/guest-${view.name.toLowerCase().replace(' ', '-')}.png`,
                            fullPage: true 
                        });
                        log(`   📸 Screenshot saved`, 'blue');
                    } else {
                        logTest(`${view.name} button`, false, 'Button not found');
                        allResults.failed.push(`${view.name} button`);
                    }
                }
                
                logSection('TEST: Scenario Quiz');
                
                // Navigate to scenarios
                await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const button = buttons.find(btn => btn.textContent.includes('Scenarios'));
                    if (button) button.click();
                });
                
                await delay(2000);
                
                // Check for Start Quiz button
                const hasStartButton = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    return buttons.some(btn => btn.textContent.includes('Start') && btn.textContent.includes('Quiz'));
                });
                
                logTest('Start Quiz button exists', hasStartButton);
                if (hasStartButton) {
                    allResults.passed.push('Start Quiz button');
                    
                    // Click Start Quiz
                    await page.evaluate(() => {
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const button = buttons.find(btn => btn.textContent.includes('Start') && btn.textContent.includes('Quiz'));
                        if (button) button.click();
                    });
                    
                    await delay(2000);
                    
                    // Check if quiz started
                    const quizStarted = await page.evaluate(() => {
                        const text = document.body.textContent;
                        return text.includes('Client:') || text.includes('Behavior:') || text.includes('Question');
                    });
                    
                    logTest('Quiz started', quizStarted);
                    if (quizStarted) allResults.passed.push('Quiz functionality');
                    else allResults.failed.push('Quiz did not start');
                } else {
                    allResults.failed.push('Start Quiz button');
                }
            }
        }
        
        logSection('TEST: 404 Errors');
        logTest('No 404 errors', errors404.length === 0, errors404.length > 0 ? `Found ${errors404.length}: ${errors404.join(', ')}` : '');
        if (errors404.length === 0) allResults.passed.push('No 404 errors');
        else allResults.failed.push(`${errors404.length} 404 errors`);
        
        await page.close();
        
    } catch (error) {
        log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
        allResults.failed.push(`Fatal: ${error.message}`);
    } finally {
        await browser.close();
    }
    
    // Final summary
    logSection('FINAL SUMMARY');
    
    log(`✅ Passed: ${allResults.passed.length}`, 'green');
    log(`❌ Failed: ${allResults.failed.length}`, 'red');
    log(`📊 Total: ${allResults.passed.length + allResults.failed.length}`, 'blue');
    
    const successRate = ((allResults.passed.length / (allResults.passed.length + allResults.failed.length)) * 100).toFixed(1);
    log(`📈 Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
    
    if (allResults.failed.length > 0) {
        log('\n❌ FAILED TESTS:', 'red');
        allResults.failed.forEach((fail, i) => {
            log(`   ${i + 1}. ${fail}`, 'yellow');
        });
    }
    
    console.log('\n' + '█'.repeat(60));
    log(allResults.failed.length === 0 ? '✅ ALL TESTS PASSED!' : `⚠️  ${allResults.failed.length} TEST(S) FAILED`, 
        allResults.failed.length === 0 ? 'green' : 'yellow');
    console.log('█'.repeat(60) + '\n');
    
    process.exit(allResults.failed.length === 0 ? 0 : 1);
}

runTests().catch(error => {
    log(`\n❌ TEST RUNNER ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});

