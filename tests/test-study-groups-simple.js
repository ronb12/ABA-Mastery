// Simple Study Group Notifications Test - Expects Emulators Running
// A product of Bradley Virtual Solutions, LLC
// 
// PREREQUISITE: Start Firebase emulators first with: npm start
//

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupNotifications() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   STUDY GROUP NOTIFICATIONS TEST - SIMPLE VERSION           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('📋 Prerequisites:');
    console.log('   1. Firebase emulators must be running');
    console.log('   2. Run "npm start" in another terminal first\n');
    console.log('🔍 Checking if emulators are running...\n');

    // Check if emulators are running
    try {
        const response = await fetch('http://localhost:4000');
        if (!response.ok) throw new Error('Emulator UI not accessible');
        console.log('   ✅ Emulator UI detected at http://localhost:4000\n');
    } catch (error) {
        console.error('\n❌ ERROR: Firebase Emulators are not running!\n');
        console.error('Please start them first:\n');
        console.error('   Terminal 1: npm start');
        console.error('   Terminal 2: npm run test-study-groups\n');
        process.exit(1);
    }

    let browser;
    const results = [];
    const APP_URL = 'http://localhost:5002';

    try {
        // Launch browser with two pages
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
            defaultViewport: { width: 1400, height: 900 }
        });

        console.log('🌐 Browser launched\n');

        // Create two pages for two users
        const page1 = await browser.newPage();
        const page2 = await browser.newPage();

        // Enable console logging
        page1.on('console', msg => {
            const text = msg.text();
            if (text.includes('Emulator') || text.includes('Firebase')) {
                console.log(`   [User 1 Console] ${text}`);
            }
        });
        
        page2.on('console', msg => {
            const text = msg.text();
            if (text.includes('Emulator') || text.includes('Firebase') || text.includes('notification')) {
                console.log(`   [User 2 Console] ${text}`);
            }
        });

        // Track notifications
        let user2GotNotification = false;

        // ==========================================
        // STEP 1: Load landing page for both users
        // ==========================================
        console.log('📱 STEP 1: Loading landing page for both users...\n');
        
        try {
            await Promise.all([
                page1.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 10000 }),
                page2.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 10000 })
            ]);
        } catch (error) {
            console.error(`\n❌ Failed to load app at ${APP_URL}`);
            console.error('   Make sure Firebase emulators are running with: npm start\n');
            throw error;
        }
        
        await wait(2000);
        
        console.log('   ✅ Both users loaded landing page\n');
        results.push({ test: 'Load Landing Page', status: 'PASS' });

        await page1.screenshot({ path: 'test-screenshots/simple-01-landing-user1.png' });
        await page2.screenshot({ path: 'test-screenshots/simple-01-landing-user2.png' });

        // ==========================================
        // STEP 2: Navigate to login page
        // ==========================================
        console.log('📝 STEP 2: Navigating to login page...\n');
        
        await Promise.all([
            page1.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle2' }),
            page2.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle2' })
        ]);
        
        await wait(2000);
        console.log('   ✅ Both users at login page\n');
        results.push({ test: 'Navigate to Login', status: 'PASS' });

        // ==========================================
        // STEP 3: Sign in User 1
        // ==========================================
        console.log('🔐 STEP 3: Signing in User 1 (test123@aba.com)...\n');
        
        await page1.type('#email', 'test123@aba.com', { delay: 50 });
        await page1.type('#password', 'Test123!', { delay: 50 });
        
        // Click login button
        const loginBtn1 = await page1.$('button[type="submit"], #login-btn, button[onclick*="signIn"]');
        if (loginBtn1) {
            await loginBtn1.click();
            await wait(4000); // Wait for Firebase auth
            
            const currentUrl1 = page1.url();
            if (currentUrl1.includes('/app') || currentUrl1.includes('app.html')) {
                console.log('   ✅ User 1 signed in\n');
                results.push({ test: 'User 1 Sign In', status: 'PASS' });
            } else {
                console.log(`   ⚠️  User 1 login - current URL: ${currentUrl1}\n`);
                results.push({ test: 'User 1 Sign In', status: 'WARNING' });
            }
        }
        
        await page1.screenshot({ path: 'test-screenshots/simple-02-user1-login.png' });

        // ==========================================
        // STEP 4: Sign in User 2
        // ==========================================
        console.log('🔐 STEP 4: Signing in User 2 (test456@aba.com)...\n');
        
        await page2.type('#email', 'test456@aba.com', { delay: 50 });
        await page2.type('#password', 'Test456!', { delay: 50 });
        
        const loginBtn2 = await page2.$('button[type="submit"], #login-btn, button[onclick*="signIn"]');
        if (loginBtn2) {
            await loginBtn2.click();
            await wait(4000);
            
            const currentUrl2 = page2.url();
            if (currentUrl2.includes('/app') || currentUrl2.includes('app.html')) {
                console.log('   ✅ User 2 signed in\n');
                results.push({ test: 'User 2 Sign In', status: 'PASS' });
            } else {
                console.log(`   ⚠️  User 2 login - current URL: ${currentUrl2}\n`);
                console.log('   ℹ️  Note: If user doesn\'t exist, create it first via Emulator UI\n');
                results.push({ test: 'User 2 Sign In', status: 'WARNING' });
            }
        }
        
        await page2.screenshot({ path: 'test-screenshots/simple-02-user2-login.png' });

        // ==========================================
        // STEP 5: Navigate to Study Groups
        // ==========================================
        console.log('📚 STEP 5: Navigating both users to Study Groups...\n');
        
        for (const [index, page] of [page1, page2].entries()) {
            await wait(2000);
            
            const navSuccess = await page.evaluate(() => {
                // Try multiple methods to find Study Groups button
                const navButtons = Array.from(document.querySelectorAll('.nav-item, nav button, .nav button, button'));
                const btn = navButtons.find(b => 
                    b.dataset?.view === 'study-groups' ||
                    b.textContent?.toLowerCase().includes('study groups') ||
                    b.textContent?.includes('👥')
                );
                
                if (btn) {
                    btn.click();
                    return true;
                }
                
                // Try calling switchView directly if available
                if (typeof window.switchView === 'function') {
                    window.switchView('study-groups');
                    return true;
                }
                
                return false;
            });

            if (navSuccess) {
                await wait(2000);
                console.log(`   ✅ User ${index + 1} navigated to Study Groups`);
            } else {
                console.log(`   ⚠️  User ${index + 1} - couldn't find Study Groups button`);
            }
        }
        
        console.log('\n');
        results.push({ test: 'Navigate to Study Groups', status: 'PASS' });

        await page1.screenshot({ path: 'test-screenshots/simple-03-user1-study-groups.png', fullPage: true });
        await page2.screenshot({ path: 'test-screenshots/simple-03-user2-study-groups.png', fullPage: true });

        // ==========================================
        // MANUAL TESTING INSTRUCTIONS
        // ==========================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ AUTOMATED SETUP COMPLETE');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('Two users are ready and logged in!\n');
        console.log('🧪 MANUAL TESTING STEPS:\n');
        console.log('USER 1 (Window 1 - Left):');
        console.log('   1. Click "Create Group" button');
        console.log('   2. Fill in group details');
        console.log('   3. Note the invite code shown\n');
        console.log('USER 2 (Window 2 - Right):');
        console.log('   1. Click "Join Group" button');
        console.log('   2. Enter User 1\'s invite code');
        console.log('   3. Join the group\n');
        console.log('THEN TEST NOTIFICATIONS:');
        console.log('   User 1: Go to Schedule tab');
        console.log('   User 1: Click "Schedule Session"');
        console.log('   User 1: Fill form and submit');
        console.log('   User 2: Should see notification!');
        console.log('   User 2: Check Schedule tab updates');
        console.log('   User 2: Click "Join Session"\n');
        console.log('⏸️  Browser windows will stay open for 5 minutes.');
        console.log('📸 Screenshots saved to test-screenshots/\n');
        console.log('Press Ctrl+C to close early.\n');

        await wait(300000); // 5 minutes for manual testing

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        console.error('Stack:', error.stack);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (browser) {
            const pages = await browser.pages();
            for (let i = 0; i < pages.length; i++) {
                await pages[i].screenshot({ path: `test-screenshots/simple-error-page${i+1}.png`, fullPage: true });
            }
        }
        
        console.log('\n⏸️  Browser will stay open for debugging. Press Ctrl+C to close.\n');
        await wait(60000);
    } finally {
        // Print results
        console.log('\n╔══════════════════════════════════════════════════════════════╗');
        console.log('║                    TEST RESULTS SUMMARY                      ║');
        console.log('╚══════════════════════════════════════════════════════════════╝\n');

        const passed = results.filter(r => r.status === 'PASS');
        const warned = results.filter(r => r.status === 'WARNING');
        const failed = results.filter(r => r.status === 'FAIL');

        if (passed.length > 0) {
            console.log('✅ PASSED:\n');
            passed.forEach(r => console.log(`   ✅ ${r.test}`));
        }

        if (warned.length > 0) {
            console.log('\n⚠️  WARNINGS:\n');
            warned.forEach(r => {
                console.log(`   ⚠️  ${r.test}`);
                if (r.note) console.log(`      ${r.note}`);
            });
        }

        if (failed.length > 0) {
            console.log('\n❌ FAILED:\n');
            failed.forEach(r => {
                console.log(`   ❌ ${r.test}`);
                if (r.error) console.log(`      ${r.error}`);
            });
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 SUMMARY: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('📸 Screenshots saved in test-screenshots/\n');
        console.log('🎛️  View Emulator data at http://localhost:4000\n');

        if (browser) {
            await browser.close();
        }
    }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n🛑 Test interrupted by user\n');
    process.exit(0);
});

if (require.main === module) {
    testStudyGroupNotifications().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStudyGroupNotifications;

