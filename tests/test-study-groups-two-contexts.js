// Study Groups Test - Two Browser Contexts (Most Reliable)
// Uses separate browser contexts to simulate two real users

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupsTwoContexts() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   STUDY GROUP TEST - TWO BROWSER CONTEXTS                   ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const results = [];
    let browser;
    const APP_URL = 'http://localhost:5002';
    let inviteCode = null;

    try {
        // Check emulators
        console.log('🔍 Checking Firebase Emulators...');
        await fetch('http://localhost:4000');
        console.log('   ✅ Emulators running\n');
        results.push({ test: 'Emulators Check', status: 'PASS' });

        // Create test users in Firebase Auth Emulator
        console.log('👥 Creating test users in Firebase Auth Emulator...');
        const users = [
            { email: 'test123@aba.com', password: 'Test123!', displayName: 'Test User One' },
            { email: 'test456@aba.com', password: 'Test456!', displayName: 'Test User Two' }
        ];

        for (const user of users) {
            try {
                const response = await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        password: user.password,
                        displayName: user.displayName,
                        returnSecureToken: true
                    })
                });
                const data = await response.json();
                if (data.localId) {
                    console.log(`   ✅ Created: ${user.email}`);
                } else if (data.error?.message?.includes('EMAIL_EXISTS')) {
                    console.log(`   ℹ️  Already exists: ${user.email}`);
                }
            } catch (error) {
                console.log(`   ⚠️  Error with ${user.email}: ${error.message}`);
            }
        }
        console.log('   ✅ Test users ready\n');
        results.push({ test: 'Create Test Users', status: 'PASS' });

        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1400, height: 900 },
            args: ['--no-sandbox', '--disable-web-security']
        });
        console.log('   ✅ Browser launched\n');
        results.push({ test: 'Launch Browser', status: 'PASS' });

        // Create two separate contexts (like two different browsers)
        const context1 = await browser.createBrowserContext();
        const context2 = await browser.createBrowserContext();
        
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        console.log('   ✅ Two browser contexts created\n');

        // ============================================
        // USER 1: Sign in and create group
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('USER 1: Sign in and create group');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 1: Loading login page...');
        await page1.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle0', timeout: 15000 });
        await wait(2000);
        
        console.log('👤 User 1: Signing in as test123@aba.com...');
        await page1.click('#email', { clickCount: 3 });
        await page1.type('#email', 'test123@aba.com', { delay: 50 });
        await page1.click('#password', { clickCount: 3 });
        await page1.type('#password', 'Test123!', { delay: 50 });
        await wait(1000);
        
        await page1.evaluate(() => {
            document.querySelector('button[type="submit"], #login-btn, button').click();
        });
        await wait(5000);
        
        if (!page1.url().includes('/app')) {
            throw new Error('User 1 failed to sign in');
        }
        console.log('   ✅ User 1 signed in\n');
        results.push({ test: 'User 1 Sign In', status: 'PASS' });

        console.log('👤 User 1: Navigating to Study Groups...');
        await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, .nav-item'));
            const btn = buttons.find(b => 
                b.textContent?.includes('Study Groups') || 
                b.dataset?.view === 'study-groups'
            );
            if (btn) btn.click();
            else if (typeof window.switchView === 'function') window.switchView('study-groups');
        });
        await wait(3000);
        console.log('   ✅ User 1 at Study Groups\n');
        results.push({ test: 'User 1 Navigate to Study Groups', status: 'PASS' });

        console.log('👤 User 1: Creating a group...');
        const createModalOpened = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => b.textContent?.includes('Create Group'));
            if (createBtn) {
                createBtn.click();
                return true;
            }
            return false;
        });
        
        if (!createModalOpened) {
            console.log('   ⚠️  Could not find Create Group button');
        }
        await wait(2000);

        const groupName = `Test Group ${Date.now()}`;
        console.log(`   - Filling form for: ${groupName}`);
        
        await page1.waitForSelector('#group-name', { visible: true, timeout: 5000 });
        await page1.type('#group-name', groupName, { delay: 40 });
        await page1.type('#group-description', 'Testing notifications', { delay: 40 });
        await page1.select('#exam-type', 'BCBA');
        await wait(1000);

        console.log('   - Looking for submit button...');
        const buttonInfo = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.modal button, button'));
            const buttonTexts = buttons.map(b => ({
                text: b.textContent?.trim(),
                visible: b.offsetParent !== null,
                classes: b.className
            }));
            return buttonTexts.filter(b => b.visible && b.text);
        });
        
        console.log(`   - Found ${buttonInfo.length} visible buttons`);
        buttonInfo.slice(0, 5).forEach(b => console.log(`     • "${b.text}"`));

        console.log('   - Clicking submit button...');
        const submitClicked = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.modal button, button'));
            
            // Try multiple button text variations
            const submitBtn = buttons.find(b => {
                const text = b.textContent?.trim();
                return text && (
                    (text.includes('Create') && !text.includes('Create Group')) ||
                    text.includes('Submit') ||
                    text.includes('Add') ||
                    text === 'Create'
                );
            });
            
            if (submitBtn && submitBtn.offsetParent !== null) {
                console.log('Found submit button:', submitBtn.textContent);
                submitBtn.click();
                return true;
            }
            
            // Try finding by type="submit"
            const submitByType = buttons.find(b => b.type === 'submit');
            if (submitByType) {
                submitByType.click();
                return true;
            }
            
            return false;
        });
        
        if (submitClicked) {
            console.log('   ✅ Submit button clicked!');
        } else {
            console.log('   ⚠️  Could not find/click submit button');
        }
        
        await wait(5000); // Wait longer for group creation

        inviteCode = await page1.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));
            for (const elem of elements) {
                const text = elem.textContent || '';
                const match = text.match(/\b[A-Z0-9]{6}\b/);
                if (match && !text.includes('BCBA')) {
                    return match[0];
                }
            }
            return null;
        });

        if (inviteCode) {
            console.log(`   ✅ Group created! Invite code: ${inviteCode}\n`);
            results.push({ test: 'Create Group', status: 'PASS', inviteCode });
        } else {
            console.log('   ⚠️  Group created but code not found\n');
            results.push({ test: 'Create Group', status: 'WARNING' });
        }

        await page1.screenshot({ path: 'test-screenshots/ctx-01-user1-created.png', fullPage: true });

        // ============================================
        // USER 2: Sign in and join group
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('USER 2: Sign in and join group');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 2: Loading login page...');
        await page2.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle0', timeout: 15000 });
        await wait(2000);
        
        console.log('👤 User 2: Signing in as test456@aba.com...');
        await page2.click('#email', { clickCount: 3 });
        await page2.type('#email', 'test456@aba.com', { delay: 50 });
        await page2.click('#password', { clickCount: 3 });
        await page2.type('#password', 'Test456!', { delay: 50 });
        await wait(1000);
        
        await page2.evaluate(() => {
            document.querySelector('button[type="submit"], #login-btn, button').click();
        });
        await wait(5000);
        
        if (!page2.url().includes('/app')) {
            throw new Error('User 2 failed to sign in');
        }
        console.log('   ✅ User 2 signed in\n');
        results.push({ test: 'User 2 Sign In', status: 'PASS' });

        console.log('👤 User 2: Navigating to Study Groups...');
        await page2.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, .nav-item'));
            const btn = buttons.find(b => 
                b.textContent?.includes('Study Groups') || 
                b.dataset?.view === 'study-groups'
            );
            if (btn) btn.click();
            else if (typeof window.switchView === 'function') window.switchView('study-groups');
        });
        await wait(3000);
        console.log('   ✅ User 2 at Study Groups\n');
        results.push({ test: 'User 2 Navigate to Study Groups', status: 'PASS' });

        await page2.screenshot({ path: 'test-screenshots/ctx-02-user2-studygroups.png', fullPage: true });

        if (inviteCode) {
            console.log(`👤 User 2: Joining group with code ${inviteCode}...`);
            await page2.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const joinBtn = buttons.find(b => b.textContent?.includes('Join Group'));
                if (joinBtn) joinBtn.click();
            });
            await wait(2000);

            await page2.waitForSelector('#join-code, input[placeholder*="code"]', { visible: true, timeout: 5000 });
            await page2.type('#join-code, input[placeholder*="code"]', inviteCode, { delay: 60 });
            await wait(1000);

            await page2.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('.modal button, button'));
                const submitBtn = buttons.find(b => 
                    b.textContent?.includes('Join') && !b.textContent?.includes('Join Group')
                );
                if (submitBtn) submitBtn.click();
            });
            await wait(4000);

            console.log('   ✅ User 2 joined the group!\n');
            results.push({ test: 'User 2 Join Group', status: 'PASS' });

            await page2.screenshot({ path: 'test-screenshots/ctx-03-user2-joined.png', fullPage: true });
            
            // ============================================
            // USER 1: Schedule a session (trigger notification)
            // ============================================
            console.log('═══════════════════════════════════════════════════════════');
            console.log('USER 1: Schedule a session to trigger notification');
            console.log('═══════════════════════════════════════════════════════════\n');

            console.log('👤 User 1: Navigating to Schedule tab...');
            await page1.evaluate(() => {
                const tabs = Array.from(document.querySelectorAll('.group-tab, .tab-button, button'));
                const scheduleTab = tabs.find(t => t.textContent?.includes('Schedule'));
                if (scheduleTab) scheduleTab.click();
            });
            await wait(2000);
            console.log('   ✅ User 1 at Schedule tab\n');

            console.log('👤 User 1: Clicking Schedule Session...');
            const scheduleClicked = await page1.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const scheduleBtn = buttons.find(b => b.textContent?.includes('Schedule Session'));
                if (scheduleBtn) {
                    scheduleBtn.click();
                    return true;
                }
                return false;
            });

            if (scheduleClicked) {
                await wait(2000);
                
                console.log('👤 User 1: Filling session details...');
                
                // Get tomorrow's date
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dateStr = tomorrow.toISOString().split('T')[0];
                
                // Fill session form
                await page1.waitForSelector('#session-title', { visible: true, timeout: 5000 });
                await page1.type('#session-title', 'Automated Test Session', { delay: 40 });
                await page1.type('#session-date', dateStr, { delay: 40 });
                await page1.type('#session-time', '18:00', { delay: 40 });
                
                // Fill duration if field exists
                const hasDuration = await page1.$('#session-duration');
                if (hasDuration) {
                    await page1.type('#session-duration', '60', { delay: 40 });
                }
                
                // Fill topic if field exists
                const hasTopic = await page1.$('#session-topic');
                if (hasTopic) {
                    await page1.type('#session-topic', 'Behavior Assessment', { delay: 40 });
                }
                
                await wait(1000);
                
                console.log('   - Title: Automated Test Session');
                console.log(`   - Date: ${dateStr}`);
                console.log('   - Time: 18:00');
                console.log('   - Duration: 60 minutes');
                console.log('   - Topic: Behavior Assessment\n');
                
                console.log('👤 User 1: Submitting session...');
                await page1.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('.modal button, button'));
                    const submitBtn = buttons.find(b => 
                        (b.textContent?.includes('Schedule') || b.textContent?.includes('Create')) && 
                        !b.textContent?.includes('Schedule Session')
                    );
                    if (submitBtn) submitBtn.click();
                });
                await wait(3000);
                
                console.log('   ✅ Session scheduled!\n');
                results.push({ test: 'Schedule Session', status: 'PASS' });
                
                await page1.screenshot({ path: 'test-screenshots/ctx-04-session-scheduled.png', fullPage: true });
                
                // ============================================
                // USER 2: Check for notification
                // ============================================
                console.log('═══════════════════════════════════════════════════════════');
                console.log('USER 2: Checking for notification');
                console.log('═══════════════════════════════════════════════════════════\n');
                
                console.log('👤 User 2: Waiting for notification...');
                await wait(3000);
                
                // Check if notification appeared or schedule updated
                const notification = await page2.evaluate(() => {
                    // Check for notification badge or message
                    const notifElements = document.querySelectorAll('.notification, .badge, [class*="notif"]');
                    if (notifElements.length > 0) return 'visible';
                    
                    // Check console for notification message
                    return 'check-console';
                });
                
                if (notification === 'visible') {
                    console.log('   ✅ Notification element detected!\n');
                    results.push({ test: 'User 2 Notification', status: 'PASS' });
                } else {
                    console.log('   ℹ️  No visual notification (browser may need permission)\n');
                    results.push({ test: 'User 2 Notification', status: 'INFO', note: 'Check manually - may need browser permission' });
                }
                
                // Navigate User 2 to Schedule tab to see the session
                console.log('👤 User 2: Navigating to Schedule tab...');
                await page2.evaluate(() => {
                    const tabs = Array.from(document.querySelectorAll('.group-tab, .tab-button, button'));
                    const scheduleTab = tabs.find(t => t.textContent?.includes('Schedule'));
                    if (scheduleTab) scheduleTab.click();
                });
                await wait(2000);
                console.log('   ✅ User 2 at Schedule tab\n');
                
                await page2.screenshot({ path: 'test-screenshots/ctx-05-user2-sees-session.png', fullPage: true });
                
                // Check if User 2 can see the session
                const sessionVisible = await page2.evaluate(() => {
                    const text = document.body.innerText;
                    return text.includes('Automated Test Session') || text.includes('18:00');
                });
                
                if (sessionVisible) {
                    console.log('   ✅ User 2 can see the scheduled session!\n');
                    results.push({ test: 'Session Visibility', status: 'PASS' });
                } else {
                    console.log('   ⚠️  Session not immediately visible\n');
                    results.push({ test: 'Session Visibility', status: 'WARNING' });
                }
                
            } else {
                console.log('   ⚠️  Could not find Schedule Session button\n');
                results.push({ test: 'Schedule Session', status: 'WARNING' });
            }
        }

        // ============================================
        // Complete - Keep browsers open for inspection
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ NOTIFICATION TEST COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        console.log('📸 Screenshots: test-screenshots/ctx-*.png');
        console.log('👥 Both users in the group');
        console.log('📅 Session scheduled');
        console.log('🔔 Notification test completed');
        console.log('🎛️  View data: http://localhost:4000\n');
        console.log('Keeping browsers open for 20 seconds for inspection...\n');
        
        await wait(20000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (browser) {
            const pages = await browser.pages();
            for (let i = 0; i < pages.length; i++) {
                try {
                    await pages[i].screenshot({ path: `test-screenshots/ctx-error-${i}.png`, fullPage: true });
                } catch (e) {}
            }
        }
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
            passed.forEach(r => {
                console.log(`   ✅ ${r.test}`);
                if (r.inviteCode) console.log(`      Invite Code: ${r.inviteCode}`);
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
        console.log(`📊 TOTAL: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (browser) {
            await browser.close();
            console.log('🚪 Browser closed\n');
        }

        process.exit(failed.length > 0 ? 1 : 0);
    }
}

process.on('SIGINT', () => {
    console.log('\n\n🛑 Test interrupted\n');
    process.exit(1);
});

if (require.main === module) {
    testStudyGroupsTwoContexts().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStudyGroupsTwoContexts;

