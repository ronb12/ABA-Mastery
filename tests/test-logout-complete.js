const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test logout button visibility and functionality
async function testLogoutButton() {
    console.log('🚀 Starting Logout Button Test...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const screenshotDir = path.join(__dirname, 'logout-test-complete');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: [],
        summary: { passed: 0, failed: 0 }
    };
    
    try {
        // Test 1: Load the app
        console.log('📝 Test 1: Loading app...');
        await page.goto('https://aba-mastery-app.web.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await page.waitForSelector('#app', { timeout: 10000 });
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-app-loaded.png'),
            fullPage: true 
        });
        
        results.tests.push({
            name: 'App loads successfully',
            status: 'PASSED',
            details: 'App loaded and #app element is visible'
        });
        results.summary.passed++;
        console.log('✅ App loaded successfully\n');
        
        // Test 2: Check if logout button exists in header
        console.log('📝 Test 2: Checking for logout button element...');
        const logoutBtnExists = await page.evaluate(() => {
            const element = document.getElementById('logout-btn');
            return element !== null;
        });
        
        if (logoutBtnExists) {
            results.tests.push({
                name: 'Logout button element exists',
                status: 'PASSED',
                details: '#logout-btn element found in header'
            });
            results.summary.passed++;
            console.log('✅ Logout button element exists\n');
        } else {
            results.tests.push({
                name: 'Logout button element exists',
                status: 'FAILED',
                details: '#logout-btn element not found in DOM'
            });
            results.summary.failed++;
            console.log('❌ Logout button element NOT found\n');
        }
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '02-logout-btn-check.png'),
            fullPage: true 
        });
        
        // Test 3: Check logout button is hidden in guest mode
        console.log('📝 Test 3: Checking logout button is hidden in guest mode...');
        const isHiddenInGuestMode = await page.evaluate(() => {
            const btn = document.getElementById('logout-btn');
            if (!btn) return false;
            const style = window.getComputedStyle(btn);
            return style.display === 'none';
        });
        
        if (isHiddenInGuestMode) {
            results.tests.push({
                name: 'Logout button hidden in guest mode',
                status: 'PASSED',
                details: 'Logout button correctly hidden when not logged in'
            });
            results.summary.passed++;
            console.log('✅ Logout button is hidden in guest mode\n');
        } else {
            results.tests.push({
                name: 'Logout button hidden in guest mode',
                status: 'FAILED',
                details: 'Logout button should be hidden in guest mode'
            });
            results.summary.failed++;
            console.log('⚠️ Logout button is visible in guest mode (should be hidden)\n');
        }
        
        // Test 4: Sign in with test user
        console.log('📝 Test 4: Attempting to sign in with test user...');
        
        // Execute sign-in via Firebase
        const signInResult = await page.evaluate(async () => {
            try {
                if (typeof firebase === 'undefined' || !firebase.auth) {
                    return { success: false, error: 'Firebase not available' };
                }
                
                const userCredential = await firebase.auth().signInWithEmailAndPassword(
                    'sarah.johnson@abamastery.test',
                    'Test123456!'
                );
                
                return { 
                    success: true, 
                    email: userCredential.user.email,
                    uid: userCredential.user.uid
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });
        
        if (signInResult.success) {
            console.log(`✅ Signed in successfully as: ${signInResult.email}`);
            console.log(`   User ID: ${signInResult.uid}\n`);
            
            // Wait for UI to update
            await page.waitForTimeout(2000);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '03-signed-in.png'),
                fullPage: true 
            });
            
            results.tests.push({
                name: 'User sign-in successful',
                status: 'PASSED',
                details: `Signed in as: ${signInResult.email}`
            });
            results.summary.passed++;
            
            // Test 5: Check logout button is visible after login
            console.log('📝 Test 5: Checking logout button is visible after login...');
            
            const logoutButtonInfo = await page.evaluate(() => {
                const logoutBtn = document.getElementById('logout-btn');
                if (!logoutBtn) return { exists: false, reason: 'logout-btn not found' };
                
                const style = window.getComputedStyle(logoutBtn);
                const buttonVisible = style.display !== 'none' && logoutBtn.offsetWidth > 0 && logoutBtn.offsetHeight > 0;
                const buttonTitle = logoutBtn.getAttribute('title');
                const buttonIcon = logoutBtn.querySelector('.icon')?.textContent;
                
                return {
                    exists: true,
                    visible: buttonVisible,
                    display: style.display,
                    title: buttonTitle,
                    icon: buttonIcon
                };
            });
            
            console.log('Logout button info:', JSON.stringify(logoutButtonInfo, null, 2));
            
            if (logoutButtonInfo.exists && logoutButtonInfo.visible) {
                results.tests.push({
                    name: 'Logout button is visible after login',
                    status: 'PASSED',
                    details: `Button visible in header with title: "${logoutButtonInfo.title}"`
                });
                results.summary.passed++;
                console.log(`✅ Logout button is VISIBLE in header next to dark mode button\n`);
            } else {
                results.tests.push({
                    name: 'Logout button is visible after login',
                    status: 'FAILED',
                    details: logoutButtonInfo.exists 
                        ? `Button exists but not visible. Display: ${logoutButtonInfo.display}` 
                        : `Button not found. ${logoutButtonInfo.reason}`
                });
                results.summary.failed++;
                console.log(`❌ Logout button NOT properly visible after login\n`);
            }
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '04-signout-button-check.png'),
                fullPage: true 
            });
            
            // Test 6: Click logout button
            if (logoutButtonInfo.exists) {
                console.log('📝 Test 6: Testing logout button click...');
                
                // Set up a listener for the alert dialog
                page.on('dialog', async dialog => {
                    console.log(`   Alert message: "${dialog.message()}"`);
                    await dialog.accept();
                });
                
                // Click the logout button
                const clickResult = await page.evaluate(() => {
                    const logoutBtn = document.getElementById('logout-btn');
                    if (!logoutBtn) return { success: false, reason: 'logout-btn not found' };
                    
                    logoutBtn.click();
                    return { success: true };
                });
                
                if (clickResult.success) {
                    console.log('   Button clicked successfully');
                    
                    // Wait for sign out process and page reload
                    await page.waitForTimeout(3000);
                    
                    await page.screenshot({ 
                        path: path.join(screenshotDir, '05-after-signout.png'),
                        fullPage: true 
                    });
                    
                    // Check if user is signed out
                    const isSignedOut = await page.evaluate(() => {
                        return new Promise(resolve => {
                            if (typeof firebase === 'undefined' || !firebase.auth) {
                                resolve({ signedOut: false, reason: 'Firebase not available' });
                                return;
                            }
                            
                            firebase.auth().onAuthStateChanged(user => {
                                resolve({ signedOut: user === null, user: user ? user.email : 'none' });
                            });
                        });
                    });
                    
                    console.log('   Sign out result:', JSON.stringify(isSignedOut, null, 2));
                    
                    if (isSignedOut.signedOut) {
                        results.tests.push({
                            name: 'Sign Out functionality works',
                            status: 'PASSED',
                            details: 'User successfully signed out and returned to guest mode'
                        });
                        results.summary.passed++;
                        console.log('✅ Sign out SUCCESSFUL - User is now in guest mode\n');
                    } else {
                        results.tests.push({
                            name: 'Sign Out functionality works',
                            status: 'FAILED',
                            details: `User still signed in as: ${isSignedOut.user}`
                        });
                        results.summary.failed++;
                        console.log(`❌ Sign out FAILED - User still logged in as: ${isSignedOut.user}\n`);
                    }
                } else {
                    results.tests.push({
                        name: 'Logout button click',
                        status: 'FAILED',
                        details: `Could not click button: ${clickResult.reason}`
                    });
                    results.summary.failed++;
                    console.log(`❌ Could not click logout button: ${clickResult.reason}\n`);
                }
            }
            
        } else {
            console.log(`❌ Sign in failed: ${signInResult.error}`);
            console.log('   Skipping logout button tests\n');
            
            results.tests.push({
                name: 'User sign-in',
                status: 'FAILED',
                details: `Sign in failed: ${signInResult.error}`
            });
            results.summary.failed++;
        }
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.tests.push({
            name: 'Test Execution',
            status: 'ERROR',
            details: error.message
        });
        results.summary.failed++;
        
        await page.screenshot({ 
            path: path.join(screenshotDir, 'zz-error.png'),
            fullPage: true 
        });
    }
    
    // Save results
    fs.writeFileSync(
        path.join(screenshotDir, 'test-results.json'),
        JSON.stringify(results, null, 2)
    );
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`📁 Screenshots saved to: ${screenshotDir}`);
    console.log('='.repeat(60) + '\n');
    
    await browser.close();
    
    return results.summary.failed === 0;
}

// Run the test
testLogoutButton()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

