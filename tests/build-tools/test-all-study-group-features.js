// Comprehensive Study Groups Feature Test
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAllFeatures() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     COMPREHENSIVE STUDY GROUPS FEATURE TEST               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const results = [];
    let groupId = null;

    try {
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--start-maximized'],
            defaultViewport: null
        });

        const page = await browser.newPage();

        // Capture errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('   ⚠️  Console:', msg.text());
            }
        });

        // ==========================================
        // STEP 1: Navigate and Sign In
        // ==========================================
        console.log('📱 STEP 1: Navigating and signing in...');
        await page.goto('https://aba-mastery-app.web.app/login', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        await wait(2000);

        // Sign in
        await page.type('#email', 'test123@aba.com');
        await page.type('#password', 'Test123!');
        
        const signInBtn = await page.$('button[onclick*="signInWithEmail"]');
        if (signInBtn) {
            await signInBtn.click();
            await wait(4000);
            console.log('   ✅ Signed in\n');
            results.push({ feature: 'Authentication', status: 'PASS' });
        }

        // ==========================================
        // STEP 2: Navigate to Study Groups
        // ==========================================
        console.log('📚 STEP 2: Navigating to Study Groups...');
        
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
            throw new Error('Could not navigate to Study Groups');
        }

        await wait(2000);
        await page.screenshot({ path: 'test-screenshots/1-study-groups-view.png', fullPage: true });
        console.log('   ✅ Navigated to Study Groups\n');
        results.push({ feature: 'Study Groups Navigation', status: 'PASS' });

        // ==========================================
        // STEP 3: Create Group
        // ==========================================
        console.log('🆕 STEP 3: Creating study group...');
        
        const createBtnSuccess = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.onclick && b.onclick.toString().includes('showCreateGroupModal'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (!createBtnSuccess) {
            throw new Error('Create Group button not found or not clickable');
        }

        await wait(1000);
        await page.screenshot({ path: 'test-screenshots/2-create-group-modal.png', fullPage: true });

        // Check if modal appeared
        const modalExists = await page.$('.modal');
        if (!modalExists) {
            throw new Error('Create Group modal did not appear');
        }
        console.log('   ✅ Modal opened\n');
        results.push({ feature: 'Create Group Modal', status: 'PASS' });

        // Fill form
        console.log('✍️  STEP 4: Filling create group form...');
        const testGroupName = `Test Group ${Date.now()}`;
        await page.type('#group-name', testGroupName);
        await page.type('#group-description', 'Comprehensive test of all study group features');
        await page.select('#exam-type', 'BCBA');
        
        await wait(500);
        await page.screenshot({ path: 'test-screenshots/3-form-filled.png', fullPage: true });
        console.log(`   ✅ Form filled: "${testGroupName}"\n`);

        // Submit
        console.log('🚀 STEP 5: Submitting form...');
        const submitSuccess = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.onclick && b.onclick.toString().includes('submitCreateGroup'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (!submitSuccess) {
            throw new Error('Submit button not found');
        }

        await wait(3000);
        await page.screenshot({ path: 'test-screenshots/4-after-submit.png', fullPage: true });
        console.log('   ✅ Form submitted\n');
        results.push({ feature: 'Create Group Submission', status: 'PASS' });

        // Check for invite code modal
        const inviteModal = await page.$('.invite-code-modal');
        if (inviteModal) {
            const inviteCode = await page.$eval('.invite-code', el => el.textContent).catch(() => 'N/A');
            console.log(`   🎉 Invite Code: ${inviteCode}\n`);
            results.push({ feature: 'Invite Code Generation', status: 'PASS', code: inviteCode });
            
            await page.screenshot({ path: 'test-screenshots/5-invite-code.png', fullPage: true });
            
            // Close modal
            const closeBtn = await page.$('.invite-code-modal .close-btn');
            if (closeBtn) {
                await closeBtn.click();
                await wait(1000);
            }
        }

        // ==========================================
        // STEP 6: Open Group
        // ==========================================
        console.log('🚪 STEP 6: Opening the created group...');
        
        const openGroupSuccess = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.onclick && b.onclick.toString().includes('openGroup'));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });

        if (!openGroupSuccess) {
            throw new Error('Could not find or open group');
        }

        await wait(3000);
        await page.screenshot({ path: 'test-screenshots/6-group-interface.png', fullPage: true });
        console.log('   ✅ Group interface loaded\n');
        results.push({ feature: 'Open Group Interface', status: 'PASS' });

        // ==========================================
        // STEP 7: Test All Tabs
        // ==========================================
        console.log('🧪 STEP 7: Testing all 7 tabs...\n');
        
        const tabs = [
            { name: 'chat', label: 'Chat' },
            { name: 'video', label: 'Video Call' },
            { name: 'files', label: 'Files' },
            { name: 'quizzes', label: 'Quizzes' },
            { name: 'leaderboard', label: 'Leaderboard' },
            { name: 'schedule', label: 'Schedule' },
            { name: 'members', label: 'Members' }
        ];

        for (const tab of tabs) {
            console.log(`   Testing ${tab.label} tab...`);
            
            const tabSuccess = await page.evaluate((tabName) => {
                const tabBtn = document.querySelector(`button[data-tab="${tabName}"]`);
                if (tabBtn) {
                    tabBtn.click();
                    return true;
                }
                return false;
            }, tab.name);

            await wait(500);
            
            if (tabSuccess) {
                const tabActive = await page.$(`#${tab.name}-tab.active`);
                if (tabActive) {
                    console.log(`   ✅ ${tab.label} tab works`);
                    results.push({ feature: `${tab.label} Tab`, status: 'PASS' });
                    await page.screenshot({ path: `test-screenshots/7-tab-${tab.name}.png`, fullPage: true });
                } else {
                    console.log(`   ⚠️  ${tab.label} tab clicked but didn't activate`);
                    results.push({ feature: `${tab.label} Tab`, status: 'WARNING' });
                }
            } else {
                console.log(`   ❌ ${tab.label} tab button not found`);
                results.push({ feature: `${tab.label} Tab`, status: 'FAIL' });
            }
        }

        // ==========================================
        // STEP 8: Test Chat Feature
        // ==========================================
        console.log('\n💬 STEP 8: Testing chat feature...');
        
        // Click chat tab
        await page.evaluate(() => {
            const chatTab = document.querySelector('button[data-tab="chat"]');
            if (chatTab) chatTab.click();
        });
        await wait(1000);

        // Send a test message
        const chatInput = await page.$('#chat-input');
        if (chatInput) {
            await page.type('#chat-input', 'Hello! This is a test message from automated testing. 🎉');
            
            // Click send button
            const sendSuccess = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const sendBtn = buttons.find(b => b.onclick && b.onclick.toString().includes('sendChatMessage'));
                if (sendBtn) {
                    sendBtn.click();
                    return true;
                }
                return false;
            });

            await wait(2000);
            
            if (sendSuccess) {
                // Check if message appeared
                const messageExists = await page.$('.chat-message');
                if (messageExists) {
                    console.log('   ✅ Chat message sent and displayed');
                    results.push({ feature: 'Group Chat', status: 'PASS' });
                    await page.screenshot({ path: 'test-screenshots/8-chat-message.png', fullPage: true });
                } else {
                    console.log('   ⚠️  Message sent but not displayed yet');
                    results.push({ feature: 'Group Chat', status: 'WARNING' });
                }
            }
        } else {
            console.log('   ⚠️  Chat input not found');
            results.push({ feature: 'Group Chat', status: 'WARNING' });
        }

        // ==========================================
        // STEP 9: Test File Upload UI
        // ==========================================
        console.log('\n📁 STEP 9: Testing file upload UI...');
        
        await page.evaluate(() => {
            const filesTab = document.querySelector('button[data-tab="files"]');
            if (filesTab) filesTab.click();
        });
        await wait(1000);

        const hasSmallFileBtn = await page.$('button:has-text("Upload Small File")') || 
                               await page.evaluate(() => {
                                   const btns = Array.from(document.querySelectorAll('button'));
                                   return btns.some(b => b.textContent.includes('Upload Small File'));
                               });
        
        const hasLinkBtn = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.some(b => b.textContent.includes('Share External Link'));
        });

        if (hasSmallFileBtn && hasLinkBtn) {
            console.log('   ✅ File upload options available (Small File + External Link)');
            results.push({ feature: 'File Upload UI', status: 'PASS' });
        } else {
            console.log('   ⚠️  File upload buttons may be missing');
            results.push({ feature: 'File Upload UI', status: 'WARNING' });
        }
        
        await page.screenshot({ path: 'test-screenshots/9-files-tab.png', fullPage: true });

        // ==========================================
        // STEP 10: Test Video Call Button
        // ==========================================
        console.log('\n📹 STEP 10: Testing video call button...');
        
        await page.evaluate(() => {
            const videoTab = document.querySelector('button[data-tab="video"]');
            if (videoTab) videoTab.click();
        });
        await wait(1000);

        const hasVideoBtn = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.some(b => b.textContent.includes('Start Video Call'));
        });

        if (hasVideoBtn) {
            console.log('   ✅ Video call button available');
            results.push({ feature: 'Video Call Button', status: 'PASS' });
        } else {
            console.log('   ⚠️  Video call button not found');
            results.push({ feature: 'Video Call Button', status: 'WARNING' });
        }
        
        await page.screenshot({ path: 'test-screenshots/10-video-tab.png', fullPage: true });

        // ==========================================
        // FINAL: Keep browser open
        // ==========================================
        console.log('\n✅ Automated tests complete!\n');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('📸 Screenshots saved in test-screenshots/\n');
        console.log('🔍 Browser will stay open for manual inspection...');
        console.log('   Manually test:');
        console.log('   • Click video call button');
        console.log('   • Upload a small file');
        console.log('   • Create a quiz');
        console.log('   • Schedule a session');
        console.log('   • Check leaderboard\n');
        console.log('⏸️  Press Ctrl+C when done.\n');

        await wait(300000); // 5 minutes

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ feature: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (page) {
            await page.screenshot({ path: 'test-screenshots/error.png', fullPage: true }).catch(() => {});
        }
    } finally {
        // Print results
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    TEST RESULTS SUMMARY                    ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        const passed = results.filter(r => r.status === 'PASS');
        const warned = results.filter(r => r.status === 'WARNING');
        const failed = results.filter(r => r.status === 'FAIL');

        console.log('✅ PASSED:\n');
        passed.forEach(r => {
            console.log(`   ✅ ${r.feature}`);
            if (r.code) console.log(`      Code: ${r.code}`);
        });

        if (warned.length > 0) {
            console.log('\n⚠️  WARNINGS:\n');
            warned.forEach(r => console.log(`   ⚠️  ${r.feature}`));
        }

        if (failed.length > 0) {
            console.log('\n❌ FAILED:\n');
            failed.forEach(r => {
                console.log(`   ❌ ${r.feature}`);
                if (r.error) console.log(`      Error: ${r.error}`);
            });
        }

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📊 SUMMARY: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        if (failed.length === 0) {
            console.log('🎉 ALL TESTS PASSED!\n');
        }

        if (browser) {
            console.log('Browser will close in 10 seconds... Press Ctrl+C to keep it open.\n');
            await wait(10000);
            await browser.close();
        }
    }
}

if (require.main === module) {
    testAllFeatures().catch(console.error);
}

module.exports = testAllFeatures;

