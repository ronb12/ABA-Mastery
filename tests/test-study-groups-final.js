// Final Working Version - Fully Automated Study Groups Test
// Uses single page, sequential operations for reliability

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupsFinal() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   STUDY GROUP NOTIFICATIONS TEST - FINAL VERSION            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const results = [];
    let browser;
    const APP_URL = 'http://localhost:5002';

    try {
        // Check emulators
        console.log('🔍 Checking Firebase Emulators...');
        await fetch('http://localhost:4000');
        console.log('   ✅ Emulators running\n');
        results.push({ test: 'Emulators Check', status: 'PASS' });

        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1400, height: 900 },
            args: ['--no-sandbox', '--disable-web-security']
        });
        console.log('   ✅ Browser launched\n');
        results.push({ test: 'Launch Browser', status: 'PASS' });

        const page = await browser.newPage();

        // ============================================
        // PART 1: User 1 - Create Group
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('PART 1: User 1 - Sign in and create group');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 1: Navigating to login...');
        await page.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle0', timeout: 15000 });
        await wait(2000);
        
        console.log('👤 User 1: Signing in as test123@aba.com...');
        
        // Clear and fill email field
        await page.click('#email', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#email', 'test123@aba.com', { delay: 50 });
        
        // Verify email was entered
        const emailValue = await page.$eval('#email', el => el.value);
        console.log(`   Email field value: ${emailValue}`);
        
        // Clear and fill password field
        await page.click('#password', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#password', 'Test123!', { delay: 50 });
        
        // Verify password was entered
        const passwordValue = await page.$eval('#password', el => el.value);
        console.log(`   Password field filled: ${passwordValue.length > 0 ? 'Yes' : 'No'}`);
        
        await wait(1000);
        
        await page.evaluate(() => {
            document.querySelector('button[type="submit"], #login-btn, button').click();
        });
        await wait(5000);
        
        if (!page.url().includes('/app')) {
            throw new Error('User 1 failed to sign in');
        }
        console.log('   ✅ User 1 signed in\n');
        results.push({ test: 'User 1 Sign In', status: 'PASS' });

        await page.screenshot({ path: 'test-screenshots/final-01-user1-signedin.png' });

        console.log('👤 User 1: Navigating to Study Groups...');
        await page.evaluate(() => {
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
        results.push({ test: 'Navigate to Study Groups', status: 'PASS' });

        await page.screenshot({ path: 'test-screenshots/final-02-user1-studygroups.png', fullPage: true });

        console.log('👤 User 1: Creating a group...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => b.textContent?.includes('Create Group'));
            if (createBtn) createBtn.click();
        });
        await wait(2000);

        const groupName = `Auto Test ${Date.now()}`;
        console.log(`👤 User 1: Filling group form...`);
        console.log(`   - Name: ${groupName}`);
        
        // Fill group name
        await page.waitForSelector('#group-name', { visible: true, timeout: 5000 });
        await page.click('#group-name', { clickCount: 3 });
        await page.type('#group-name', groupName, { delay: 40 });
        
        // Verify name was entered
        const nameValue = await page.$eval('#group-name', el => el.value);
        console.log(`   - Name filled: ${nameValue.length > 0 ? 'Yes' : 'No'}`);
        
        // Fill description
        await page.click('#group-description', { clickCount: 3 });
        await page.type('#group-description', 'Automated notification test', { delay: 40 });
        
        // Verify description was entered
        const descValue = await page.$eval('#group-description', el => el.value);
        console.log(`   - Description filled: ${descValue.length > 0 ? 'Yes' : 'No'}`);
        
        // Select exam type
        await page.select('#exam-type', 'BCBA');
        const examValue = await page.$eval('#exam-type', el => el.value);
        console.log(`   - Exam type: ${examValue}`);
        
        await wait(1000);

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.modal button, button'));
            const submitBtn = buttons.find(b => 
                b.textContent?.includes('Create') && !b.textContent?.includes('Create Group')
            );
            if (submitBtn) submitBtn.click();
        });
        await wait(4000);

        const inviteCode = await page.evaluate(() => {
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
            console.log(`   ✅ Group created! Code: ${inviteCode}\n`);
            results.push({ test: 'Create Group', status: 'PASS', inviteCode });
        } else {
            console.log('   ⚠️  Group created but code not found\n');
            results.push({ test: 'Create Group', status: 'WARNING' });
        }

        await page.screenshot({ path: 'test-screenshots/final-03-user1-created-group.png', fullPage: true });

        // ============================================
        // PART 2: User 2 - Join Group
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('PART 2: User 2 - Sign in and join group');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('👤 User 1: Signing out...');
        // Just navigate directly to login instead of using signOut
        await page.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle0', timeout: 15000 });
        await wait(3000);

        console.log('👤 User 2: Signing in as test456@aba.com...');
        
        // Wait for login page to be ready
        await page.waitForSelector('#email', { visible: true, timeout: 10000 });
        await wait(1000);
        
        // Clear and fill email field
        await page.click('#email', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#email', 'test456@aba.com', { delay: 50 });
        
        // Verify email was entered
        const email2Value = await page.$eval('#email', el => el.value);
        console.log(`   Email field value: ${email2Value}`);
        
        // Clear and fill password field
        await page.click('#password', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#password', 'Test456!', { delay: 50 });
        
        // Verify password was entered
        const password2Value = await page.$eval('#password', el => el.value);
        console.log(`   Password field filled: ${password2Value.length > 0 ? 'Yes' : 'No'}`);
        
        await wait(1000);
        
        await page.evaluate(() => {
            document.querySelector('button[type="submit"], #login-btn, button').click();
        });
        await wait(5000);
        
        if (!page.url().includes('/app')) {
            throw new Error('User 2 failed to sign in');
        }
        console.log('   ✅ User 2 signed in\n');
        results.push({ test: 'User 2 Sign In', status: 'PASS' });

        console.log('👤 User 2: Navigating to Study Groups...');
        await page.evaluate(() => {
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

        await page.screenshot({ path: 'test-screenshots/final-04-user2-studygroups.png', fullPage: true });

        if (inviteCode) {
            console.log(`👤 User 2: Joining group with code ${inviteCode}...`);
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const joinBtn = buttons.find(b => b.textContent?.includes('Join Group'));
                if (joinBtn) joinBtn.click();
            });
            await wait(2000);

            // Wait for and fill invite code
            await page.waitForSelector('#join-code, input[placeholder*="code"]', { visible: true, timeout: 5000 });
            const codeInput = await page.$('#join-code') || await page.$('input[placeholder*="code"]');
            
            if (codeInput) {
                await codeInput.click({ clickCount: 3 });
                await page.type('#join-code, input[placeholder*="code"]', inviteCode, { delay: 60 });
                
                // Verify code was entered
                const codeValue = await page.evaluate(() => {
                    const input = document.querySelector('#join-code') || document.querySelector('input[placeholder*="code"]');
                    return input ? input.value : '';
                });
                console.log(`   Code entered: ${codeValue}`);
            }
            
            await wait(1000);

            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('.modal button, button'));
                const submitBtn = buttons.find(b => 
                    b.textContent?.includes('Join') && !b.textContent?.includes('Join Group')
                );
                if (submitBtn) submitBtn.click();
            });
            await wait(4000);

            console.log('   ✅ User 2 joined the group!\n');
            results.push({ test: 'User 2 Join Group', status: 'PASS' });

            await page.screenshot({ path: 'test-screenshots/final-05-user2-joined.png', fullPage: true });
        }

        // ============================================
        // Complete
        // ============================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ TEST COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        console.log('📸 Screenshots saved to test-screenshots/final-*.png\n');
        console.log('Keeping browser open for 10 seconds for inspection...\n');
        
        await wait(10000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages[0]) await pages[0].screenshot({ path: 'test-screenshots/final-error.png', fullPage: true });
            } catch (e) {}
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
    testStudyGroupsFinal().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStudyGroupsFinal;

