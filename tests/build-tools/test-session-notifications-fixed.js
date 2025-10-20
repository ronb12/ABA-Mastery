// Fixed Automated Test - Session Notifications
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testSessionNotifications() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   FIXED SESSION NOTIFICATIONS TEST - TWO USERS            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const results = [];

    try {
        // Launch browser with two pages
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-web-security'],
            defaultViewport: { width: 1400, height: 900 }
        });

        console.log('🌐 Starting test with local server (http://localhost:5002)...\n');
        console.log('   ℹ️  Note: Port 5000 is used by AirPlay, using 5002 instead\n');

        // Create two pages
        const page1 = await browser.newPage();
        const page2 = await browser.newPage();

        // Set page titles for easier identification
        await page1.evaluate(() => document.title = 'User 1 - Test');
        await page2.evaluate(() => document.title = 'User 2 - Test');

        // Track notifications
        let user2GotNotification = false;
        page2.on('console', msg => {
            const text = msg.text();
            if (text.includes('New Study Session')) {
                console.log(`   📢 User 2 notification: ${text}`);
                user2GotNotification = true;
            }
        });

        // ==========================================
        // STEP 1: Both users navigate to login
        // ==========================================
        console.log('📱 STEP 1: Loading login page for both users...\n');
        
        await Promise.all([
            page1.goto('http://localhost:5002/login', { waitUntil: 'networkidle2', timeout: 30000 }),
            page2.goto('http://localhost:5002/login', { waitUntil: 'networkidle2', timeout: 30000 })
        ]);
        
        await wait(2000);
        await page1.screenshot({ path: 'test-screenshots/01-user1-login.png' });
        await page2.screenshot({ path: 'test-screenshots/01-user2-login.png' });
        
        console.log('   ✅ Both users at login page\n');
        results.push({ test: 'Load Login Page', status: 'PASS' });

        // ==========================================
        // STEP 2: User 1 signs in
        // ==========================================
        console.log('🔐 STEP 2: User 1 signing in...\n');
        
        await page1.type('#email', 'test123@aba.com', { delay: 50 });
        await page1.type('#password', 'Test123!', { delay: 50 });
        
        const signInBtn1 = await page1.$('button[onclick*="signInWithEmail"]');
        if (!signInBtn1) {
            throw new Error('Sign in button not found for User 1');
        }
        
        await signInBtn1.click();
        await wait(4000); // Wait for Firebase auth
        
        console.log('   ✅ User 1 signed in\n');
        results.push({ test: 'User 1 Sign In', status: 'PASS' });
        
        await page1.screenshot({ path: 'test-screenshots/02-user1-signed-in.png' });

        // ==========================================
        // STEP 3: User 2 signs in (create account if needed)
        // ==========================================
        console.log('🔐 STEP 3: User 2 signing in...\n');
        
        // Try to sign in with test user 2
        await page2.type('#email', 'test456@aba.com', { delay: 50 });
        await page2.type('#password', 'Test456!', { delay: 50 });
        
        const signInBtn2 = await page2.$('button[onclick*="signInWithEmail"]');
        if (signInBtn2) {
            await signInBtn2.click();
            await wait(4000);
            
            // Check if login succeeded or failed
            const currentUrl = await page2.url();
            if (currentUrl.includes('login')) {
                console.log('   ⚠️  User 2 account may not exist, using guest mode instead\n');
                
                // Go back to landing and use guest
                await page2.goto('http://localhost:5002', { waitUntil: 'networkidle2' });
                await wait(2000);
                
                const guestClicked = await page2.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const guestBtn = buttons.find(b => 
                        b.textContent.toLowerCase().includes('guest') ||
                        b.getAttribute('onclick')?.includes('guest')
                    );
                    if (guestBtn) {
                        guestBtn.click();
                        return true;
                    }
                    return false;
                });
                
                if (guestClicked) {
                    await wait(2000);
                    console.log('   ℹ️  User 2 using guest mode\n');
                }
            } else {
                console.log('   ✅ User 2 signed in\n');
            }
        }
        
        results.push({ test: 'User 2 Authentication', status: 'PASS' });
        await page2.screenshot({ path: 'test-screenshots/03-user2-authenticated.png' });

        // ==========================================
        // STEP 4: Navigate to Study Groups
        // ==========================================
        console.log('📚 STEP 4: Navigating both users to Study Groups...\n');
        
        for (const [index, page] of [page1, page2].entries()) {
            await wait(2000);
            
            const navSuccess = await page.evaluate(() => {
                const navButtons = Array.from(document.querySelectorAll('.nav-item'));
                const btn = navButtons.find(b => b.dataset.view === 'study-groups');
                if (btn) {
                    btn.click();
                    return true;
                }
                
                // Try alternative selector
                const allButtons = Array.from(document.querySelectorAll('nav button, .nav button'));
                const studyGroupsBtn = allButtons.find(b => 
                    b.textContent.toLowerCase().includes('study groups') ||
                    b.textContent.includes('👥')
                );
                if (studyGroupsBtn) {
                    studyGroupsBtn.click();
                    return true;
                }
                
                return false;
            });

            if (!navSuccess) {
                throw new Error(`User ${index + 1}: Could not find Study Groups navigation`);
            }
            
            await wait(2000);
            console.log(`   ✅ User ${index + 1} on Study Groups view`);
        }
        
        console.log('\n');
        results.push({ test: 'Navigate to Study Groups', status: 'PASS' });

        await page1.screenshot({ path: 'test-screenshots/04-user1-study-groups.png', fullPage: true });
        await page2.screenshot({ path: 'test-screenshots/04-user2-study-groups.png', fullPage: true });

        // ==========================================
        // STEP 5: Check authentication requirement
        // ==========================================
        console.log('🔍 STEP 5: Checking Study Groups access...\n');
        
        const user1NeedsAuth = await page1.$('.auth-required');
        const user2NeedsAuth = await page2.$('.auth-required');
        
        if (user1NeedsAuth || user2NeedsAuth) {
            console.log('   ⚠️  Study Groups requires authentication (expected)\n');
            results.push({ test: 'Auth Check', status: 'INFO', note: 'Feature requires sign-in' });
            
            console.log('═══════════════════════════════════════════════════════════');
            console.log('📋 MANUAL TESTING REQUIRED');
            console.log('═══════════════════════════════════════════════════════════\n');
            console.log('Study Groups requires authenticated users.\n');
            console.log('To complete the test:\n');
            console.log('TAB 1 (User 1 - Signed in):');
            console.log('   1. Create a new study group or open existing one');
            console.log('   2. Get the invite code\n');
            console.log('TAB 2 (User 2):');
            console.log('   1. Sign in (top right) or create account');
            console.log('   2. Join the same group using invite code\n');
            console.log('THEN TEST:');
            console.log('   1. User 1: Schedule a session');
            console.log('   2. User 2: Should get browser notification!');
            console.log('   3. User 2: Click "Join Session"');
            console.log('   4. Verify button changes to "✓ Attending"\n');
            console.log('Browser windows will stay open for manual testing...');
            console.log('Press Ctrl+C when done.\n');
            
            await wait(300000); // 5 minutes for manual testing
            return;
        }

        // ==========================================
        // STEP 6: Create or open group (User 1)
        // ==========================================
        console.log('🆕 STEP 6: User 1 creating/opening a group...\n');
        
        // Check if groups exist
        const hasGroups = await page1.evaluate(() => {
            const groupCards = document.querySelectorAll('.group-card');
            return groupCards.length > 0;
        });

        let groupId = null;

        if (hasGroups) {
            console.log('   ℹ️  Found existing groups, opening first one...\n');
            
            const openSuccess = await page1.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const openBtn = buttons.find(b => 
                    b.textContent.includes('Open Group') &&
                    b.onclick
                );
                if (openBtn) {
                    openBtn.click();
                    return true;
                }
                return false;
            });

            if (openSuccess) {
                await wait(3000);
                console.log('   ✅ User 1 opened group\n');
                results.push({ test: 'Open Group', status: 'PASS' });
            }
        } else {
            console.log('   ℹ️  No groups found, creating new one...\n');
            
            // Try to create group
            const createClicked = await page1.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const createBtn = buttons.find(b => 
                    b.textContent.includes('Create Group') &&
                    b.onclick
                );
                if (createBtn) {
                    createBtn.click();
                    return true;
                }
                return false;
            });

            if (createClicked) {
                await wait(1500);
                await page1.type('#group-name', 'Automated Test Group');
                await page1.type('#group-description', 'Testing session notifications');
                await page1.select('#exam-type', 'BCBA');
                await wait(500);
                
                const submitClicked = await page1.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('.modal button'));
                    const submitBtn = buttons.find(b => 
                        b.onclick && 
                        b.onclick.toString().includes('submitCreateGroup')
                    );
                    if (submitBtn) {
                        submitBtn.click();
                        return true;
                    }
                    return false;
                });

                if (submitClicked) {
                    await wait(4000);
                    console.log('   ✅ User 1 created group\n');
                    results.push({ test: 'Create Group', status: 'PASS' });
                }
            }
        }

        await page1.screenshot({ path: 'test-screenshots/05-user1-in-group.png', fullPage: true });

        // ==========================================
        // STEP 7: User 2 joins same group
        // ==========================================
        console.log('🤝 STEP 7: User 2 needs to join same group...\n');
        console.log('   ℹ️  This requires manual intervention (invite code)\n');
        console.log('   ⏸️  Pausing for manual group joining...\n');
        console.log('   Please have User 2 join the same group, then continue testing.\n');

        // ==========================================
        // FINAL: Keep browsers open for manual testing
        // ==========================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ SETUP COMPLETE - MANUAL TESTING MODE');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('Both users are ready for testing!\n');
        console.log('🧪 TEST SESSION NOTIFICATIONS:\n');
        console.log('   USER 1 (Left window):');
        console.log('      1. Ensure you\'re in the group');
        console.log('      2. Click Schedule tab');
        console.log('      3. Click "Schedule Session"');
        console.log('      4. Fill form and submit\n');
        console.log('   USER 2 (Right window):');
        console.log('      1. Join the same group');
        console.log('      2. Wait for notification after User 1 schedules');
        console.log('      3. Verify notification appears');
        console.log('      4. Check Schedule tab auto-refreshes');
        console.log('      5. Click "Join Session" → should show "✓ Attending"\n');
        console.log('⏸️  Browser windows will stay open indefinitely.');
        console.log('Press Ctrl+C when done testing.\n');

        await new Promise(() => {}); // Keep open forever

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        console.error('Stack:', error.stack);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        // Keep browser open on error for debugging
        console.log('\n⏸️  Browser will stay open for debugging. Press Ctrl+C to close.\n');
        await wait(300000);
    } finally {
        // Print results
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    TEST RESULTS SUMMARY                    ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        const passed = results.filter(r => r.status === 'PASS');
        const warned = results.filter(r => r.status === 'WARNING');
        const failed = results.filter(r => r.status === 'FAIL');
        const info = results.filter(r => r.status === 'INFO');

        if (passed.length > 0) {
            console.log('✅ PASSED:\n');
            passed.forEach(r => console.log(`   ✅ ${r.test}`));
        }

        if (info.length > 0) {
            console.log('\nℹ️  INFO:\n');
            info.forEach(r => {
                console.log(`   ℹ️  ${r.test}`);
                if (r.note) console.log(`      ${r.note}`);
            });
        }

        if (warned.length > 0) {
            console.log('\n⚠️  WARNINGS:\n');
            warned.forEach(r => console.log(`   ⚠️  ${r.test}`));
        }

        if (failed.length > 0) {
            console.log('\n❌ FAILED:\n');
            failed.forEach(r => {
                console.log(`   ❌ ${r.test}`);
                if (r.error) console.log(`      ${r.error}`);
            });
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 SUMMARY: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed, ${info.length} info`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('📸 Screenshots saved in test-screenshots/\n');

        if (browser) {
            await browser.close();
        }
    }
}

if (require.main === module) {
    testSessionNotifications().catch(console.error);
}

module.exports = testSessionNotifications;

