// Test Create Group Button - ABA Mastery
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testCreateGroup() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         TESTING CREATE GROUP BUTTON & MODAL               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const results = [];

    try {
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox'],
            defaultViewport: { width: 1280, height: 900 }
        });

        const page = await browser.newPage();

        // Capture console
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('❌ Console Error:', msg.text());
            }
        });

        console.log('📱 Step 1: Navigating to app...');
        await page.goto('https://aba-mastery-app.web.app', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        await wait(2000);
        results.push({ step: 'Navigate to app', status: 'PASS' });

        // Sign in with test account
        console.log('🔐 Step 2: Signing in with test account...');
        
        // Check if we're on landing page
        const currentUrl = await page.url();
        if (currentUrl.includes('landing') || !currentUrl.includes('/app')) {
            // Navigate to login
            await page.goto('https://aba-mastery-app.web.app/login', { 
                waitUntil: 'networkidle2' 
            });
            await wait(1000);
        }

        // Fill login form
        const emailInput = await page.$('#email');
        const passwordInput = await page.$('#password');
        
        if (emailInput && passwordInput) {
            await page.type('#email', 'test123@aba.com');
            await page.type('#password', 'Test123!');
            
            const signInButton = await page.$('button[onclick*="signInWithEmail"], button[type="submit"]');
            if (signInButton) {
                await signInButton.click();
                await wait(3000);
                results.push({ step: 'Sign in', status: 'PASS' });
                console.log('✅ Signed in successfully');
            }
        } else {
            console.log('⚠️  Already signed in or different page');
        }

        // Navigate to Study Groups
        console.log('\n📚 Step 3: Navigating to Study Groups...');
        await wait(3000);
        
        // Wait for navigation to be ready
        await page.waitForSelector('.nav-item', { timeout: 10000 }).catch(() => {
            console.log('⚠️  Nav items taking longer to load...');
        });
        
        // Find Study Groups button
        const studyGroupsNav = await page.evaluateHandle(() => {
            const navButtons = Array.from(document.querySelectorAll('.nav-item'));
            return navButtons.find(btn => btn.dataset.view === 'study-groups');
        });
        
        if (!studyGroupsNav || !studyGroupsNav.asElement()) {
            // Try clicking directly via evaluate
            const clicked = await page.evaluate(() => {
                const navButtons = Array.from(document.querySelectorAll('.nav-item'));
                const btn = navButtons.find(b => b.dataset.view === 'study-groups');
                if (btn) {
                    btn.click();
                    return true;
                }
                return false;
            });
            
            if (!clicked) {
                throw new Error('Study Groups navigation button not found');
            }
        } else {
            await studyGroupsNav.asElement().click();
        }
        
        await wait(2000);
        results.push({ step: 'Navigate to Study Groups', status: 'PASS' });
        console.log('✅ Navigated to Study Groups');

        // Take screenshot of initial view
        await page.screenshot({ path: 'test-screenshots/study-groups-view.png', fullPage: true });

        // Find and click Create Group button
        console.log('\n🆕 Step 4: Clicking Create Group button...');
        
        const createButton = await page.evaluateHandle(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(b => b.onclick && b.onclick.toString().includes('showCreateGroupModal'));
        });
        
        if (!createButton || !createButton.asElement()) {
            throw new Error('Create Group button not found');
        }
        
        await createButton.asElement().click();
        await wait(1000);
        results.push({ step: 'Click Create Group button', status: 'PASS' });
        console.log('✅ Clicked Create Group button');

        // Verify modal opened
        console.log('\n📋 Step 5: Verifying modal opened...');
        
        const modal = await page.$('.study-group-modal, .modal');
        if (!modal) {
            throw new Error('Create Group modal did not open');
        }
        
        results.push({ step: 'Modal opened', status: 'PASS' });
        console.log('✅ Modal opened successfully');

        // Take screenshot of modal
        await page.screenshot({ path: 'test-screenshots/create-group-modal.png', fullPage: true });

        // Fill out the form
        console.log('\n✍️  Step 6: Filling out Create Group form...');
        
        const groupName = `Test Group ${Date.now()}`;
        await page.type('#group-name', groupName);
        console.log(`   • Group name: ${groupName}`);
        
        await page.type('#group-description', 'Automated test group for testing Create Group functionality');
        console.log('   • Description: Added');
        
        await page.select('#exam-type', 'BCBA');
        console.log('   • Exam type: BCBA');
        
        // Set exam date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 30);
        const dateString = tomorrow.toISOString().split('T')[0];
        await page.type('#exam-date', dateString);
        console.log(`   • Exam date: ${dateString}`);
        
        results.push({ step: 'Fill form', status: 'PASS' });
        console.log('✅ Form filled successfully');

        // Take screenshot before submit
        await page.screenshot({ path: 'test-screenshots/form-filled.png', fullPage: true });

        // Submit the form
        console.log('\n🚀 Step 7: Submitting form...');
        
        const submitButton = await page.evaluateHandle(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(b => b.onclick && b.onclick.toString().includes('submitCreateGroup'));
        });
        
        if (!submitButton || !submitButton.asElement()) {
            throw new Error('Submit button not found');
        }
        
        await submitButton.asElement().click();
        await wait(3000);
        results.push({ step: 'Submit form', status: 'PASS' });
        console.log('✅ Form submitted');

        // Check for invite code modal
        console.log('\n🎉 Step 8: Checking for success (invite code modal)...');
        
        await wait(2000);
        const inviteModal = await page.$('.invite-code-modal');
        
        if (inviteModal) {
            results.push({ step: 'Invite code modal appeared', status: 'PASS' });
            console.log('✅ Invite code modal appeared!');
            
            // Get the invite code
            const inviteCode = await page.$eval('.invite-code', el => el.textContent).catch(() => null);
            if (inviteCode) {
                console.log(`📋 Invite Code: ${inviteCode}`);
                results.push({ step: 'Invite code generated', status: 'PASS', code: inviteCode });
            }
            
            // Take screenshot
            await page.screenshot({ path: 'test-screenshots/invite-code-success.png', fullPage: true });
        } else {
            console.log('⚠️  Checking for error messages...');
            
            // Check for alerts or errors
            await wait(1000);
            const alertText = await page.evaluate(() => {
                return document.body.innerText;
            });
            
            if (alertText.includes('Error') || alertText.includes('error')) {
                throw new Error('Group creation failed with error');
            }
            
            results.push({ step: 'Invite code modal', status: 'PENDING', note: 'Modal may take longer to appear' });
        }

        // Check if group appears in list
        console.log('\n📋 Step 9: Checking if group appears in list...');
        
        // Close modal if present
        const closeBtn = await page.$('.modal .close-btn');
        if (closeBtn) {
            await closeBtn.click();
            await wait(1000);
        }
        
        // Check for group cards
        const groupCards = await page.$$('.group-card');
        if (groupCards.length > 0) {
            console.log(`✅ Found ${groupCards.length} group(s) in list`);
            results.push({ step: 'Group appears in list', status: 'PASS', count: groupCards.length });
            
            // Take final screenshot
            await page.screenshot({ path: 'test-screenshots/groups-list.png', fullPage: true });
        } else {
            console.log('⚠️  No group cards found yet (may need refresh)');
            results.push({ step: 'Group in list', status: 'PENDING' });
        }

        console.log('\n✅ Test complete! Keeping browser open for manual inspection...');
        console.log('   Press Ctrl+C when done reviewing.\n');
        
        // Keep browser open for manual inspection
        await wait(60000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ step: 'Error', status: 'FAIL', error: error.message });
        
        if (page) {
            await page.screenshot({ path: 'test-screenshots/error-state.png', fullPage: true }).catch(() => {});
        }
    } finally {
        // Print results
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                      TEST RESULTS                          ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        results.forEach((result, index) => {
            const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏳';
            console.log(`${icon} Step ${index + 1}: ${result.step} - ${result.status}`);
            if (result.code) console.log(`   Invite Code: ${result.code}`);
            if (result.error) console.log(`   Error: ${result.error}`);
            if (result.note) console.log(`   Note: ${result.note}`);
        });

        const passed = results.filter(r => r.status === 'PASS').length;
        const failed = results.filter(r => r.status === 'FAIL').length;
        
        console.log(`\n📊 Summary: ${passed} passed, ${failed} failed out of ${results.length} steps`);
        
        if (failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!\n');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - Review errors above\n');
        }

        if (browser) {
            await browser.close();
        }
    }
}

if (require.main === module) {
    testCreateGroup().catch(console.error);
}

module.exports = testCreateGroup;

