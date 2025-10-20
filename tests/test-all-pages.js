/**
 * Comprehensive Puppeteer Test for ABA Mastery App
 * Tests all pages, navigation, and core functionality
 */

const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://aba-mastery-app.web.app';
const TEST_USER = {
    email: 'test123@aba.com',
    password: 'Test123!'
};

// Color codes for console output
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

async function loginUser(page) {
    log('→ Logging in...');
    await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);
    
    // Check for error messages before login
    const errorsBefore = await page.evaluate(() => {
        const errorEl = document.getElementById('error-message');
        return errorEl ? errorEl.textContent : '';
    });
    
    if (errorsBefore) {
        log(`   ⚠️  Error on page before login: ${errorsBefore}`, 'yellow');
    }
    
    await page.type('input[type="email"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    
    // Click submit button
    await page.click('button[type="submit"]');
    
    // Wait for navigation or timeout gracefully
    try {
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (error) {
        log('   ⚠️  Initial navigation timeout, checking for errors...', 'yellow');
        
        // Check for error messages
        const errors = await page.evaluate(() => {
            const errorEl = document.getElementById('error-message');
            return errorEl ? errorEl.textContent : '';
        });
        
        if (errors) {
            log(`   ❌ Login error: ${errors}`, 'red');
        }
    }
    
    // Additional wait for Firebase Auth to complete
    await delay(5000);
    
    // Check if we're on app page
    const url = page.url();
    const isLoggedIn = url.includes('app.html');
    
    if (isLoggedIn) {
        log('   ✅ Successfully logged in', 'green');
    } else {
        log(`   ⚠️  Not redirected to app. URL: ${url}`, 'yellow');
        
        // Check console logs
        const consoleLogs = await page.evaluate(() => {
            return document.body.textContent.includes('error') || document.body.textContent.includes('invalid');
        });
        
        if (consoleLogs) {
            log('   ⚠️  Page may contain error messages', 'yellow');
        }
    }
    
    return isLoggedIn;
}

async function takeScreenshot(page, name) {
    try {
        await page.screenshot({ 
            path: `tests/screenshots/${name}.png`,
            fullPage: true 
        });
        log(`   📸 Screenshot saved: ${name}.png`, 'blue');
    } catch (error) {
        log(`   ⚠️  Screenshot failed: ${error.message}`, 'yellow');
    }
}

async function testLandingPage(browser) {
    logSection('TEST 1: Landing Page');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Navigate to landing page
        log('→ Navigating to landing page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        
        // Check if page loaded
        const title = await page.title();
        if (title.includes('ABA Mastery')) {
            results.passed.push('Page title correct');
            logTest('Landing page loaded', true, `Title: ${title}`);
        } else {
            results.failed.push('Page title incorrect');
            logTest('Landing page loaded', false, `Title: ${title}`);
        }
        
        // Check for key elements
        const hasHeader = await page.$('h1');
        logTest('Header exists', !!hasHeader);
        if (hasHeader) results.passed.push('Header found');
        else results.failed.push('Header not found');
        
        const hasSignInButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.textContent.includes('Sign In'));
        });
        logTest('Sign In button exists', hasSignInButton);
        if (hasSignInButton) results.passed.push('Sign In button found');
        else results.failed.push('Sign In button not found');
        
        const hasGuestButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.textContent.includes('Guest'));
        });
        logTest('Guest mode button exists', hasGuestButton);
        if (hasGuestButton) results.passed.push('Guest button found');
        else results.failed.push('Guest button not found');
        
        // Check for 404 errors
        const errors = [];
        page.on('response', response => {
            if (response.status() === 404) {
                errors.push(response.url());
            }
        });
        
        await delay(2000);
        logTest('No 404 errors', errors.length === 0, errors.length > 0 ? `Found: ${errors.join(', ')}` : '');
        if (errors.length === 0) results.passed.push('No 404 errors');
        else results.failed.push(`404 errors: ${errors.length}`);
        
        await takeScreenshot(page, '01-landing-page');
        
    } catch (error) {
        logTest('Landing page test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testLoginPage(browser) {
    logSection('TEST 2: Login Page');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        log('→ Navigating to login page...');
        await page.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        
        // Check page loaded
        const url = page.url();
        logTest('Login page loaded', url.includes('login.html'), `URL: ${url}`);
        if (url.includes('login.html')) results.passed.push('Login page accessible');
        else results.failed.push('Login page not accessible');
        
        // Check for form elements
        const hasEmailField = await page.$('input[type="email"]');
        logTest('Email field exists', !!hasEmailField);
        if (hasEmailField) results.passed.push('Email field found');
        else results.failed.push('Email field not found');
        
        const hasPasswordField = await page.$('input[type="password"]');
        logTest('Password field exists', !!hasPasswordField);
        if (hasPasswordField) results.passed.push('Password field found');
        else results.failed.push('Password field not found');
        
        const hasSubmitButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.type === 'submit' || btn.textContent.includes('Sign In'));
        });
        logTest('Submit button exists', hasSubmitButton);
        if (hasSubmitButton) results.passed.push('Submit button found');
        else results.failed.push('Submit button not found');
        
        await takeScreenshot(page, '02-login-page');
        
    } catch (error) {
        logTest('Login page test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testSignupPage(browser) {
    logSection('TEST 3: Signup Page');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        log('→ Navigating to signup page...');
        await page.goto(`${BASE_URL}/signup.html`, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        
        // Check page loaded
        const url = page.url();
        logTest('Signup page loaded', url.includes('signup.html'), `URL: ${url}`);
        if (url.includes('signup.html')) results.passed.push('Signup page accessible');
        else results.failed.push('Signup page not accessible');
        
        // Check for form elements
        const hasEmailField = await page.$('input[type="email"]');
        logTest('Email field exists', !!hasEmailField);
        if (hasEmailField) results.passed.push('Email field found');
        else results.failed.push('Email field not found');
        
        const hasPasswordField = await page.$('input[type="password"]');
        logTest('Password field exists', !!hasPasswordField);
        if (hasPasswordField) results.passed.push('Password field found');
        else results.failed.push('Password field not found');
        
        const hasNameField = await page.$('input[name="fullname"], input[id="fullname"], input[name="name"], input[placeholder*="name" i]');
        logTest('Name field exists', !!hasNameField);
        if (hasNameField) results.passed.push('Name field found');
        else results.failed.push('Name field not found');
        
        await takeScreenshot(page, '03-signup-page');
        
    } catch (error) {
        logTest('Signup page test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testAppPageAuthenticated(browser) {
    logSection('TEST 4: Main App (Authenticated)');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Login first
        const isLoggedIn = await loginUser(page);
        
        // Check if we're on app page
        const url = page.url();
        logTest('Redirected to app', isLoggedIn && url.includes('app.html'), `URL: ${url}`);
        if (url.includes('app.html')) results.passed.push('Login successful');
        else results.failed.push('Login failed or wrong redirect');
        
        await takeScreenshot(page, '04-app-authenticated');
        
        // Check for navigation tabs
        log('→ Checking navigation tabs...');
        const navTabs = await page.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('.nav-item, .tab-item, [role="tab"], button[onclick*="switchView"]'));
            return tabs.map(tab => tab.textContent.trim());
        });
        
        log(`   Found ${navTabs.length} navigation items: ${navTabs.join(', ')}`, 'blue');
        logTest('Navigation tabs exist', navTabs.length > 0);
        if (navTabs.length > 0) results.passed.push(`Found ${navTabs.length} nav tabs`);
        else results.failed.push('No navigation tabs found');
        
        // Test each view
        const views = ['Study', 'Practice', 'Flashcards', 'Scenarios', 'Case Studies', 'Groups', 'Progress'];
        
        for (const viewName of views) {
            try {
                log(`→ Testing ${viewName} view...`);
                
                // Try to find and click the navigation button
                const clicked = await page.evaluate((name) => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const button = buttons.find(btn => btn.textContent.includes(name));
                    if (button) {
                        button.click();
                        return true;
                    }
                    return false;
                }, viewName);
                
                if (clicked) {
                    await delay(1500);
                    
                    // Check if view is visible
                    const viewVisible = await page.evaluate((name) => {
                        const views = Array.from(document.querySelectorAll('[id*="view"], section, .view'));
                        return views.some(view => {
                            const style = window.getComputedStyle(view);
                            return style.display !== 'none' && view.textContent.includes(name);
                        });
                    }, viewName);
                    
                    logTest(`${viewName} view`, viewVisible);
                    if (viewVisible) results.passed.push(`${viewName} view accessible`);
                    else results.failed.push(`${viewName} view not visible`);
                    
                    await takeScreenshot(page, `05-${viewName.toLowerCase().replace(' ', '-')}-view`);
                } else {
                    logTest(`${viewName} view`, false, 'Navigation button not found');
                    results.failed.push(`${viewName} nav button not found`);
                }
                
            } catch (error) {
                logTest(`${viewName} view`, false, error.message);
                results.failed.push(`${viewName}: ${error.message}`);
            }
        }
        
    } catch (error) {
        logTest('App page test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testScenarioQuiz(browser) {
    logSection('TEST 5: Scenario Quiz Functionality');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Login and navigate to scenarios
        log('→ Navigating to Scenarios...');
        await loginUser(page);
        
        // Click on Scenarios tab
        const scenariosClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => btn.textContent.includes('Scenarios'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        logTest('Scenarios tab clicked', scenariosClicked);
        if (scenariosClicked) results.passed.push('Scenarios tab found');
        else results.failed.push('Scenarios tab not found');
        
        await delay(2000);
        
        // Check for Start Quiz button
        const hasStartButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.textContent.includes('Start') && btn.textContent.includes('Quiz'));
        });
        
        logTest('Start Quiz button exists', hasStartButton);
        if (hasStartButton) results.passed.push('Start Quiz button found');
        else results.failed.push('Start Quiz button not found');
        
        if (hasStartButton) {
            // Click Start Quiz
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const button = buttons.find(btn => btn.textContent.includes('Start') && btn.textContent.includes('Quiz'));
                if (button) button.click();
            });
            
            await delay(2000);
            
            // Check if quiz started
            const quizStarted = await page.evaluate(() => {
                const scenario = document.body.textContent;
                return scenario.includes('Client:') || scenario.includes('Behavior:') || scenario.includes('Question');
            });
            
            logTest('Scenario quiz started', quizStarted);
            if (quizStarted) results.passed.push('Quiz successfully started');
            else results.failed.push('Quiz did not start');
            
            await takeScreenshot(page, '06-scenario-quiz');
        }
        
    } catch (error) {
        logTest('Scenario quiz test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testCaseStudies(browser) {
    logSection('TEST 6: Case Studies');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Login and navigate to case studies
        log('→ Navigating to Case Studies...');
        await loginUser(page);
        
        // Click on Case Studies tab
        const caseStudiesClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => btn.textContent.includes('Case Studies'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        logTest('Case Studies tab clicked', caseStudiesClicked);
        if (caseStudiesClicked) results.passed.push('Case Studies tab found');
        else results.failed.push('Case Studies tab not found');
        
        await delay(2000);
        
        // Check for case study content
        const hasCaseStudies = await page.evaluate(() => {
            const content = document.body.textContent;
            return content.includes('Published') || content.includes('Study') || content.includes('Authors');
        });
        
        logTest('Case studies content loaded', hasCaseStudies);
        if (hasCaseStudies) results.passed.push('Case studies loaded');
        else results.failed.push('Case studies not loaded');
        
        await takeScreenshot(page, '07-case-studies');
        
    } catch (error) {
        logTest('Case studies test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function testProgressReport(browser) {
    logSection('TEST 7: Progress Report & PDF Export');
    
    const page = await browser.newPage();
    const results = {
        passed: [],
        failed: []
    };
    
    try {
        // Login and navigate to progress
        log('→ Navigating to Progress...');
        await loginUser(page);
        
        // Click on Progress tab
        const progressClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => btn.textContent.includes('Progress'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        logTest('Progress tab clicked', progressClicked);
        if (progressClicked) results.passed.push('Progress tab found');
        else results.failed.push('Progress tab not found');
        
        await delay(2000);
        
        // Check for PDF export buttons
        const hasExportButtons = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const progressBtn = buttons.some(btn => btn.textContent.includes('Export Progress'));
            const dataBtn = buttons.some(btn => btn.textContent.includes('Export Study Data'));
            return { progressBtn, dataBtn };
        });
        
        logTest('Export Progress Report button', hasExportButtons.progressBtn);
        logTest('Export Study Data button', hasExportButtons.dataBtn);
        
        if (hasExportButtons.progressBtn) results.passed.push('Export Progress button found');
        else results.failed.push('Export Progress button not found');
        
        if (hasExportButtons.dataBtn) results.passed.push('Export Study Data button found');
        else results.failed.push('Export Study Data button not found');
        
        await takeScreenshot(page, '08-progress-view');
        
    } catch (error) {
        logTest('Progress report test', false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function runAllTests() {
    console.log('\n' + '█'.repeat(60));
    log('ABA MASTERY - COMPREHENSIVE PAGE TEST', 'cyan');
    log('Testing all pages and functionality', 'blue');
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
        // Run all tests
        const test1 = await testLandingPage(browser);
        allResults.passed.push(...test1.passed);
        allResults.failed.push(...test1.failed);
        
        const test2 = await testLoginPage(browser);
        allResults.passed.push(...test2.passed);
        allResults.failed.push(...test2.failed);
        
        const test3 = await testSignupPage(browser);
        allResults.passed.push(...test3.passed);
        allResults.failed.push(...test3.failed);
        
        const test4 = await testAppPageAuthenticated(browser);
        allResults.passed.push(...test4.passed);
        allResults.failed.push(...test4.failed);
        
        const test5 = await testScenarioQuiz(browser);
        allResults.passed.push(...test5.passed);
        allResults.failed.push(...test5.failed);
        
        const test6 = await testCaseStudies(browser);
        allResults.passed.push(...test6.passed);
        allResults.failed.push(...test6.failed);
        
        const test7 = await testProgressReport(browser);
        allResults.passed.push(...test7.passed);
        allResults.failed.push(...test7.failed);
        
    } catch (error) {
        log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
        allResults.failed.push(`Fatal: ${error.message}`);
    } finally {
        await browser.close();
    }
    
    // Final summary
    logSection('FINAL TEST SUMMARY');
    
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
    log(allResults.failed.length === 0 ? '✅ ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED', 
        allResults.failed.length === 0 ? 'green' : 'yellow');
    console.log('█'.repeat(60) + '\n');
    
    process.exit(allResults.failed.length === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
    log(`\n❌ TEST RUNNER ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});

