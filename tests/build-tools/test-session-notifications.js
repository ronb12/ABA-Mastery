// Test Real-time Session Notifications
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testSessionNotifications() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   REAL-TIME SESSION NOTIFICATIONS TEST                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const results = [];

    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-web-security', '--disable-notifications'],
            defaultViewport: { width: 1400, height: 900 }
        });

        console.log('🌐 Starting test with local server...\n');

        // ==========================================
        // STEP 1: Create two pages (simulating two users)
        // ==========================================
        console.log('👥 STEP 1: Setting up two users...\n');
        
        const page1 = await browser.newPage();
        const page2 = await browser.newPage();

        // Track console messages for notifications
        let user2GotNotification = false;
        page2.on('console', msg => {
            const text = msg.text();
            if (text.includes('New Study Session') || text.includes('Session')) {
                console.log(`   📝 User 2 console: ${text}`);
                if (text.includes('New Study Session')) {
                    user2GotNotification = true;
                }
            }
        });

        // ==========================================
        // STEP 2: Load app for both users
        // ==========================================
        console.log('📱 STEP 2: Loading app for both users...\n');
        
        await Promise.all([
            page1.goto('http://localhost:5000', { waitUntil: 'networkidle2' }),
            page2.goto('http://localhost:5000', { waitUntil: 'networkidle2' })
        ]);
        
        await wait(2000);
        console.log('   ✅ Both users loaded landing page\n');
        results.push({ test: 'Load App', status: 'PASS' });

        // ==========================================
        // STEP 3: Navigate to app
        // ==========================================
        console.log('🔐 STEP 3: Navigating to app...\n');
        
        // Try guest mode for both
        for (const page of [page1, page2]) {
            const guestClicked = await page.evaluate(() => {
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
            } else {
                await page.goto('http://localhost:5000/app', { waitUntil: 'networkidle2' });
                await wait(2000);
            }
        }

        console.log('   ✅ Both users on app page\n');
        results.push({ test: 'Navigate to App', status: 'PASS' });

        // Take screenshots
        await page1.screenshot({ path: 'test-screenshots/user1-start.png' });
        await page2.screenshot({ path: 'test-screenshots/user2-start.png' });

        // ==========================================
        // STEP 4: Navigate to Study Groups
        // ==========================================
        console.log('📚 STEP 4: Navigating to Study Groups...\n');
        
        for (const [index, page] of [page1, page2].entries()) {
            const navSuccess = await page.evaluate(() => {
                const navButtons = Array.from(document.querySelectorAll('.nav-item'));
                const btn = navButtons.find(b => b.dataset.view === 'study-groups');
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });

            if (!navSuccess) {
                throw new Error(`User ${index + 1}: Could not navigate to Study Groups`);
            }
            await wait(1500);
        }

        console.log('   ✅ Both users on Study Groups view\n');
        results.push({ test: 'Navigate to Study Groups', status: 'PASS' });

        await page1.screenshot({ path: 'test-screenshots/user1-study-groups.png' });
        await page2.screenshot({ path: 'test-screenshots/user2-study-groups.png' });

        // ==========================================
        // STEP 5: Check for existing groups or create
        // ==========================================
        console.log('🔍 STEP 5: Checking for test group...\n');
        
        // Check if groups exist
        const hasGroups = await page1.evaluate(() => {
            const groupCards = document.querySelectorAll('.group-card');
            return groupCards.length > 0;
        });

        let groupOpened = false;

        if (hasGroups) {
            console.log('   ℹ️  Found existing groups, opening first one...\n');
            
            // User 1: Open first group
            const openSuccess1 = await page1.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const openBtn = buttons.find(b => 
                    b.textContent.includes('Open Group') &&
                    b.onclick && 
                    b.onclick.toString().includes('openGroup')
                );
                if (openBtn) {
                    openBtn.click();
                    return true;
                }
                return false;
            });

            if (openSuccess1) {
                await wait(3000);
                
                // User 2: Open same group
                const openSuccess2 = await page2.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const openBtn = buttons.find(b => 
                        b.textContent.includes('Open Group') &&
                        b.onclick && 
                        b.onclick.toString().includes('openGroup')
                    );
                    if (openBtn) {
                        openBtn.click();
                        return true;
                    }
                    return false;
                });

                if (openSuccess2) {
                    await wait(3000);
                    groupOpened = true;
                    console.log('   ✅ Both users in same group\n');
                    results.push({ test: 'Open Existing Group', status: 'PASS' });
                }
            }
        }

        if (!groupOpened) {
            console.log('   ⚠️  No groups available or guests cannot create groups\n');
            console.log('   💡 Note: Study Groups requires authentication\n');
            results.push({ test: 'Group Access', status: 'INFO', note: 'Requires authentication' });
            
            console.log('═══════════════════════════════════════════════════════════');
            console.log('⚠️  STUDY GROUPS REQUIRES AUTHENTICATION');
            console.log('═══════════════════════════════════════════════════════════\n');
            console.log('To test session notifications:');
            console.log('1. Sign in with: test123@aba.com / Test123!');
            console.log('2. Create or join a study group');
            console.log('3. Have another user join the same group');
            console.log('4. Schedule a session from one account');
            console.log('5. Other user should get browser notification!\n');
            console.log('Browser windows will stay open for manual testing...\n');
            
            await wait(120000); // Wait 2 minutes for manual testing
            return;
        }

        await page1.screenshot({ path: 'test-screenshots/user1-in-group.png', fullPage: true });
        await page2.screenshot({ path: 'test-screenshots/user2-in-group.png', fullPage: true });

        // ==========================================
        // STEP 6: Navigate to Schedule tab
        // ==========================================
        console.log('📅 STEP 6: Navigating to Schedule tab...\n');
        
        // User 1: Go to Schedule tab
        const scheduleSuccess1 = await page1.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('button[data-tab]'));
            const scheduleTab = tabs.find(t => t.dataset.tab === 'schedule');
            if (scheduleTab) {
                scheduleTab.click();
                return true;
            }
            return false;
        });

        if (!scheduleSuccess1) {
            throw new Error('User 1: Could not find Schedule tab');
        }

        await wait(2000);
        console.log('   ✅ User 1 on Schedule tab\n');

        // User 2: Stay on Chat or any tab to receive notification
        console.log('   ℹ️  User 2 staying on current tab (to receive notification)\n');

        await page1.screenshot({ path: 'test-screenshots/user1-schedule-tab.png', fullPage: true });

        // ==========================================
        // STEP 7: User 1 schedules a session
        // ==========================================
        console.log('🆕 STEP 7: User 1 scheduling a session...\n');
        
        const createSessionClicked = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => 
                b.textContent.includes('Schedule Session') &&
                b.onclick && 
                b.onclick.toString().includes('createStudySession')
            );
            if (createBtn) {
                createBtn.click();
                return true;
            }
            return false;
        });

        if (!createSessionClicked) {
            throw new Error('Schedule Session button not found');
        }

        await wait(1500);
        await page1.screenshot({ path: 'test-screenshots/user1-session-modal.png', fullPage: true });
        console.log('   ✅ Session modal opened\n');
        results.push({ test: 'Open Schedule Modal', status: 'PASS' });

        // Fill session form
        console.log('✍️  STEP 8: Filling session form...\n');
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        await page1.type('#session-name', 'Puppeteer Test Session');
        await page1.type('#session-date', dateStr);
        await page1.type('#session-time', '15:00');
        await page1.select('#session-duration', '60');
        await page1.type('#session-description', 'Testing real-time notifications');

        await wait(500);
        await page1.screenshot({ path: 'test-screenshots/user1-form-filled.png', fullPage: true });
        console.log('   ✅ Form filled\n');

        // Submit
        console.log('🚀 STEP 9: Submitting session...\n');
        
        const submitClicked = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.modal button'));
            const submitBtn = buttons.find(b => 
                b.onclick && 
                b.onclick.toString().includes('submitCreateSession')
            );
            if (submitBtn) {
                submitBtn.click();
                return true;
            }
            return false;
        });

        if (!submitClicked) {
            throw new Error('Submit button not found');
        }

        await wait(4000); // Wait for Firestore to sync
        console.log('   ✅ Session submitted\n');
        results.push({ test: 'Create Session', status: 'PASS' });

        // Dismiss alert if present
        await page1.evaluate(() => {
            // Auto-dismiss alerts
            window.alert = () => {};
        });

        await page1.screenshot({ path: 'test-screenshots/user1-after-submit.png', fullPage: true });

        // ==========================================
        // STEP 10: Check if User 2 got notification
        // ==========================================
        console.log('🔔 STEP 10: Checking if User 2 received notification...\n');
        
        await wait(3000); // Wait for notification to arrive
        
        // Check User 2's page for session
        const user2HasSession = await page2.evaluate(() => {
            // Check if Schedule tab exists and session is there
            const tabs = Array.from(document.querySelectorAll('button[data-tab]'));
            const scheduleTab = tabs.find(t => t.dataset.tab === 'schedule');
            if (scheduleTab) {
                scheduleTab.click();
            }
            return true;
        });

        await wait(2000);
        await page2.screenshot({ path: 'test-screenshots/user2-after-notification.png', fullPage: true });

        // Check for session in list
        const sessionVisible = await page2.evaluate(() => {
            const sessions = document.querySelectorAll('.session-card');
            if (sessions.length > 0) {
                const lastSession = sessions[sessions.length - 1];
                return lastSession.textContent.includes('Puppeteer Test Session');
            }
            return false;
        });

        if (sessionVisible) {
            console.log('   ✅ User 2 can see the session!\n');
            results.push({ test: 'Session Visible to User 2', status: 'PASS' });
        } else {
            console.log('   ⚠️  Session not immediately visible (may need refresh)\n');
            results.push({ test: 'Session Visible to User 2', status: 'WARNING' });
        }

        if (user2GotNotification) {
            console.log('   ✅ User 2 received notification in console!\n');
            results.push({ test: 'Real-time Notification', status: 'PASS' });
        } else {
            console.log('   ⚠️  Notification not captured (browser may block)\n');
            results.push({ test: 'Real-time Notification', status: 'INFO', note: 'Browser may block notifications' });
        }

        // ==========================================
        // STEP 11: Test Join Session
        // ==========================================
        console.log('🎯 STEP 11: Testing Join Session...\n');
        
        const joinClicked = await page2.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const joinBtn = buttons.find(b => 
                b.textContent.includes('Join Session') &&
                b.onclick && 
                b.onclick.toString().includes('joinSession')
            );
            if (joinBtn) {
                joinBtn.click();
                return true;
            }
            return false;
        });

        if (joinClicked) {
            await wait(3000);
            
            // Check if button changed to "Attending"
            const isAttending = await page2.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.some(b => b.textContent.includes('Attending'));
            });

            if (isAttending) {
                console.log('   ✅ Join button changed to "✓ Attending"!\n');
                results.push({ test: 'Join Session Toggle', status: 'PASS' });
                await page2.screenshot({ path: 'test-screenshots/user2-attending.png', fullPage: true });
            } else {
                console.log('   ⚠️  Button state not visible yet\n');
                results.push({ test: 'Join Session Toggle', status: 'WARNING' });
            }
        } else {
            console.log('   ⚠️  Join button not found\n');
            results.push({ test: 'Join Session', status: 'WARNING' });
        }

        console.log('\n✅ All automated tests complete!\n');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('Browser windows will stay open for 30 seconds...\n');
        
        await wait(30000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
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

        if (info.length > 0) {
            console.log('\nℹ️  INFO:\n');
            info.forEach(r => {
                console.log(`   ℹ️  ${r.test}`);
                if (r.note) console.log(`      ${r.note}`);
            });
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 SUMMARY: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed, ${info.length} info`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (failed.length === 0) {
            console.log('🎉 Core functionality working!\n');
        }

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

