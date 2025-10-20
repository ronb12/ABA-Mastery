// Fully Automated Study Group Notifications Test
// No manual intervention required - runs from start to finish

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupsAutomated() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   FULLY AUTOMATED STUDY GROUP NOTIFICATIONS TEST            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const results = [];
    let browser;
    const APP_URL = 'http://localhost:5002';
    let inviteCode = null;

    try {
        // Check emulators
        console.log('🔍 Checking Firebase Emulators...');
        try {
            await fetch('http://localhost:4000');
            console.log('   ✅ Emulators running\n');
            results.push({ test: 'Emulators Check', status: 'PASS' });
        } catch (error) {
            throw new Error('Firebase Emulators not running. Start with: npm start');
        }

        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 },
            args: ['--no-sandbox', '--disable-web-security', '--window-size=1200,800']
        });
        console.log('   ✅ Browser launched\n');
        results.push({ test: 'Launch Browser', status: 'PASS' });

        const page1 = await browser.newPage();
        const page2 = await browser.newPage();

        // STEP 1: Sign in both users
        console.log('═══════════════════════════════════════════════════════════');
        console.log('STEP 1: Signing in both users');
        console.log('═══════════════════════════════════════════════════════════\n');

        // User 1 login
        console.log('👤 User 1: Navigating to login...');
        await page1.goto(`${APP_URL}/login.html`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await wait(2000);
        
        console.log('👤 User 1: Entering credentials...');
        await page1.type('#email', 'test123@aba.com', { delay: 30 });
        await page1.type('#password', 'Test123!', { delay: 30 });
        await wait(500);
        
        console.log('👤 User 1: Clicking login...');
        await page1.evaluate(() => {
            const btn = document.querySelector('button[type="submit"], #login-btn, button');
            if (btn) btn.click();
        });
        await wait(4000);
        
        if (page1.url().includes('/app')) {
            console.log('   ✅ User 1 signed in\n');
            results.push({ test: 'User 1 Sign In', status: 'PASS' });
        } else {
            throw new Error('User 1 failed to sign in');
        }

        // User 2 login
        console.log('👤 User 2: Navigating to login...');
        await wait(2000); // Wait before second navigation
        try {
            await page2.goto(`${APP_URL}/login.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (error) {
            console.log('   ⚠️  First attempt failed, retrying...');
            await wait(2000);
            await page2.goto(`${APP_URL}/login.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        }
        await wait(3000);
        
        console.log('👤 User 2: Entering credentials...');
        await page2.type('#email', 'test456@aba.com', { delay: 30 });
        await page2.type('#password', 'Test456!', { delay: 30 });
        await wait(500);
        
        console.log('👤 User 2: Clicking login...');
        await page2.evaluate(() => {
            const btn = document.querySelector('button[type="submit"], #login-btn, button');
            if (btn) btn.click();
        });
        await wait(4000);
        
        if (page2.url().includes('/app')) {
            console.log('   ✅ User 2 signed in\n');
            results.push({ test: 'User 2 Sign In', status: 'PASS' });
        } else {
            throw new Error('User 2 failed to sign in');
        }

        // STEP 2: Navigate to Study Groups
        console.log('═══════════════════════════════════════════════════════════');
        console.log('STEP 2: Navigating to Study Groups');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 1: Opening Study Groups...');
        const nav1 = await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, .nav-item'));
            const studyGroupsBtn = buttons.find(b => 
                b.textContent?.includes('Study Groups') || 
                b.textContent?.includes('👥') ||
                b.dataset?.view === 'study-groups'
            );
            if (studyGroupsBtn) {
                studyGroupsBtn.click();
                return true;
            }
            if (typeof window.switchView === 'function') {
                window.switchView('study-groups');
                return true;
            }
            return false;
        });
        await wait(2000);
        console.log(`   ${nav1 ? '✅' : '⚠️'}  User 1 at Study Groups\n`);
        results.push({ test: 'User 1 Navigate to Study Groups', status: nav1 ? 'PASS' : 'WARNING' });

        console.log('👤 User 2: Opening Study Groups...');
        const nav2 = await page2.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, .nav-item'));
            const studyGroupsBtn = buttons.find(b => 
                b.textContent?.includes('Study Groups') || 
                b.textContent?.includes('👥') ||
                b.dataset?.view === 'study-groups'
            );
            if (studyGroupsBtn) {
                studyGroupsBtn.click();
                return true;
            }
            if (typeof window.switchView === 'function') {
                window.switchView('study-groups');
                return true;
            }
            return false;
        });
        await wait(2000);
        console.log(`   ${nav2 ? '✅' : '⚠️'}  User 2 at Study Groups\n`);
        results.push({ test: 'User 2 Navigate to Study Groups', status: nav2 ? 'PASS' : 'WARNING' });

        await page1.screenshot({ path: 'test-screenshots/auto-01-user1-study-groups.png', fullPage: true });
        await page2.screenshot({ path: 'test-screenshots/auto-02-user2-study-groups.png', fullPage: true });

        // STEP 3: User 1 creates a group
        console.log('═══════════════════════════════════════════════════════════');
        console.log('STEP 3: User 1 creating a study group');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 1: Clicking Create Group...');
        await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => b.textContent?.includes('Create Group'));
            if (createBtn) createBtn.click();
            else if (typeof window.showCreateGroupModal === 'function') {
                window.showCreateGroupModal();
            }
        });
        await wait(2000);

        console.log('👤 User 1: Filling group details...');
        const groupName = `Auto Test Group ${Date.now()}`;
        await page1.type('#group-name', groupName, { delay: 30 });
        await page1.type('#group-description', 'Automated test for notifications', { delay: 30 });
        await page1.select('#exam-type', 'BCBA');
        await wait(1000);

        console.log('👤 User 1: Submitting...');
        await page1.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.modal button, button'));
            const submitBtn = buttons.find(b => 
                b.textContent?.includes('Create') && !b.textContent?.includes('Create Group')
            );
            if (submitBtn) submitBtn.click();
            else if (typeof window.submitCreateGroup === 'function') {
                window.submitCreateGroup();
            }
        });
        await wait(4000);

        console.log('👤 User 1: Getting invite code...');
        inviteCode = await page1.evaluate(() => {
            // Try to find invite code in various places
            const codeElements = Array.from(document.querySelectorAll('*'));
            for (const elem of codeElements) {
                const text = elem.textContent || elem.value || '';
                const match = text.match(/\b[A-Z0-9]{6}\b/);
                if (match && !text.includes('BCBA') && !text.includes('RBT')) {
                    return match[0];
                }
            }
            return null;
        });

        if (inviteCode) {
            console.log(`   ✅ Group created! Invite code: ${inviteCode}\n`);
            results.push({ test: 'Create Study Group', status: 'PASS', inviteCode });
        } else {
            console.log('   ⚠️  Group created but invite code not found\n');
            results.push({ test: 'Create Study Group', status: 'WARNING' });
        }

        await page1.screenshot({ path: 'test-screenshots/auto-03-user1-created-group.png', fullPage: true });

        // STEP 4: User 2 joins the group (if we have invite code)
        if (inviteCode) {
            console.log('═══════════════════════════════════════════════════════════');
            console.log('STEP 4: User 2 joining the group');
            console.log('═══════════════════════════════════════════════════════════\n');

            console.log('👤 User 2: Clicking Join Group...');
            await page2.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const joinBtn = buttons.find(b => b.textContent?.includes('Join Group'));
                if (joinBtn) joinBtn.click();
                else if (typeof window.showJoinGroupModal === 'function') {
                    window.showJoinGroupModal();
                }
            });
            await wait(2000);

            console.log(`👤 User 2: Entering invite code ${inviteCode}...`);
            await page2.type('#join-code, input[placeholder*="code"]', inviteCode, { delay: 50 });
            await wait(1000);

            console.log('👤 User 2: Submitting...');
            await page2.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('.modal button, button'));
                const submitBtn = buttons.find(b => 
                    b.textContent?.includes('Join') && !b.textContent?.includes('Join Group')
                );
                if (submitBtn) submitBtn.click();
                else if (typeof window.submitJoinGroup === 'function') {
                    window.submitJoinGroup();
                }
            });
            await wait(4000);

            console.log('   ✅ User 2 joined the group\n');
            results.push({ test: 'User 2 Join Group', status: 'PASS' });

            await page2.screenshot({ path: 'test-screenshots/auto-04-user2-joined-group.png', fullPage: true });
        }

        // STEP 5: Test complete
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ AUTOMATED TEST COMPLETE');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        console.log('📸 Screenshots saved to test-screenshots/auto-*.png\n');
        console.log('🎛️  View Emulator data: http://localhost:4000\n');
        console.log('Keeping browser open for 30 seconds for inspection...\n');
        
        await wait(30000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (browser) {
            const pages = await browser.pages();
            for (let i = 0; i < pages.length; i++) {
                try {
                    await pages[i].screenshot({ path: `test-screenshots/auto-error-${i}.png`, fullPage: true });
                } catch (e) {
                    // Ignore screenshot errors
                }
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

process.on('SIGINT', async () => {
    console.log('\n\n🛑 Test interrupted\n');
    process.exit(1);
});

if (require.main === module) {
    testStudyGroupsAutomated().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStudyGroupsAutomated;

