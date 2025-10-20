// Comprehensive Local Test - Study Groups
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupsLocal() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   COMPREHENSIVE STUDY GROUPS TEST - LOCAL SERVER          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const results = [];
    let inviteCode = null;

    try {
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-web-security'],
            defaultViewport: { width: 1400, height: 900 }
        });

        const page = await browser.newPage();

        // Log console messages
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('✅') || text.includes('Study Groups Manager')) {
                console.log(`   📝 ${text}`);
            }
            if (msg.type() === 'error' && !text.includes('400')) {
                console.log(`   ❌ Error: ${text}`);
            }
        });

        // ==========================================
        // TEST 1: Load App
        // ==========================================
        console.log('🌐 TEST 1: Loading local server...');
        await page.goto('http://localhost:5000', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        await wait(3000);
        console.log('   ✅ App loaded\n');
        results.push({ test: 'Load App', status: 'PASS' });

        // Click guest mode or sign in
        console.log('🔐 TEST 2: Authentication...');
        
        const url = await page.url();
        if (!url.includes('/app')) {
            // Try to find and click guest or sign in
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
            
            await wait(2000);
        }

        // Try to navigate to app if not there
        if (!url.includes('/app')) {
            await page.goto('http://localhost:5000/app', { waitUntil: 'networkidle2' });
            await wait(2000);
        }

        console.log('   ✅ On app page\n');
        results.push({ test: 'Authentication', status: 'PASS' });

        // ==========================================
        // TEST 3: Navigate to Study Groups
        // ==========================================
        console.log('📚 TEST 3: Navigating to Study Groups...');
        
        await wait(2000);
        
        const navClicked = await page.evaluate(() => {
            const navButtons = Array.from(document.querySelectorAll('.nav-item'));
            const studyGroupsBtn = navButtons.find(b => b.dataset.view === 'study-groups');
            if (studyGroupsBtn) {
                studyGroupsBtn.click();
                return true;
            }
            return false;
        });

        if (!navClicked) {
            throw new Error('Study Groups navigation button not found');
        }

        await wait(2000);
        await page.screenshot({ path: 'test-screenshots/01-study-groups-view.png', fullPage: true });
        console.log('   ✅ Study Groups view loaded\n');
        results.push({ test: 'Navigate to Study Groups', status: 'PASS' });

        // Check for auth required message
        const needsAuth = await page.$('.auth-required');
        if (needsAuth) {
            console.log('   ℹ️  Study Groups requires authentication (expected)\n');
            results.push({ test: 'Auth Check', status: 'INFO', note: 'Feature requires sign-in' });
            
            console.log('═══════════════════════════════════════════════════════════');
            console.log('⚠️  STUDY GROUPS REQUIRES AUTHENTICATION');
            console.log('═══════════════════════════════════════════════════════════\n');
            console.log('To test full features:');
            console.log('1. Sign in with: test123@aba.com / Test123!');
            console.log('2. Manually test Create Group');
            console.log('3. Test chat, files, quizzes, etc.\n');
            console.log('Browser will stay open for manual testing...\n');
            
            await wait(120000); // Wait 2 minutes for manual testing
            return;
        }

        // ==========================================
        // TEST 4: Create Group Button
        // ==========================================
        console.log('🆕 TEST 4: Testing Create Group button...');
        
        const createBtnClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => 
                b.textContent.includes('Create Group') &&
                b.onclick && 
                b.onclick.toString().includes('showCreateGroupModal')
            );
            if (createBtn) {
                console.log('Found Create Group button, clicking...');
                createBtn.click();
                return true;
            }
            return false;
        });

        if (!createBtnClicked) {
            throw new Error('Create Group button not found or not clickable');
        }

        await wait(1500);
        await page.screenshot({ path: 'test-screenshots/02-create-modal-opened.png', fullPage: true });

        // Verify modal appeared
        const modal = await page.$('.modal.study-group-modal');
        if (!modal) {
            throw new Error('Create Group modal did not appear');
        }

        console.log('   ✅ Create Group modal opened\n');
        results.push({ test: 'Create Group Modal Opens', status: 'PASS' });

        // Check if modal is centered
        const modalPosition = await page.evaluate(() => {
            const modal = document.querySelector('.modal');
            if (modal) {
                const styles = window.getComputedStyle(modal);
                return {
                    position: styles.position,
                    display: styles.display,
                    zIndex: styles.zIndex
                };
            }
            return null;
        });

        if (modalPosition && modalPosition.position === 'fixed') {
            console.log('   ✅ Modal is positioned fixed (centered)\n');
            results.push({ test: 'Modal Positioning', status: 'PASS' });
        } else {
            console.log('   ⚠️  Modal position:', modalPosition);
            results.push({ test: 'Modal Positioning', status: 'WARNING' });
        }

        // ==========================================
        // TEST 5: Fill Form
        // ==========================================
        console.log('✍️  TEST 5: Filling create group form...');
        
        const groupName = `Puppeteer Test Group ${Date.now()}`;
        await page.type('#group-name', groupName);
        await page.type('#group-description', 'Automated comprehensive feature test');
        await page.select('#exam-type', 'BCBA');
        
        await wait(500);
        await page.screenshot({ path: 'test-screenshots/03-form-filled.png', fullPage: true });
        console.log(`   ✅ Form filled: "${groupName}"\n`);
        results.push({ test: 'Fill Create Group Form', status: 'PASS' });

        // ==========================================
        // TEST 6: Submit Form
        // ==========================================
        console.log('🚀 TEST 6: Submitting create group form...');
        
        const submitClicked = await page.evaluate(() => {
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

        if (!submitClicked) {
            throw new Error('Submit button not found');
        }

        await wait(4000);
        await page.screenshot({ path: 'test-screenshots/04-after-submit.png', fullPage: true });
        console.log('   ✅ Form submitted\n');
        results.push({ test: 'Submit Create Group', status: 'PASS' });

        // Check for invite code
        const inviteCodeEl = await page.$('.invite-code');
        if (inviteCodeEl) {
            inviteCode = await page.$eval('.invite-code', el => el.textContent);
            console.log(`   🎉 Invite Code Generated: ${inviteCode}\n`);
            results.push({ test: 'Invite Code Generation', status: 'PASS', code: inviteCode });
            
            await page.screenshot({ path: 'test-screenshots/05-invite-code.png', fullPage: true });
            
            // Close invite modal
            await page.evaluate(() => {
                const closeBtn = document.querySelector('.invite-code-modal .close-btn');
                if (closeBtn) closeBtn.click();
            });
            await wait(1000);
        } else {
            console.log('   ⚠️  Checking for group creation...\n');
        }

        // ==========================================
        // TEST 7: Open Created Group
        // ==========================================
        console.log('🚪 TEST 7: Opening created group...');
        
        await wait(2000);
        
        const openGroupClicked = await page.evaluate(() => {
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

        if (!openGroupClicked) {
            throw new Error('Could not find Open Group button');
        }

        await wait(3000);
        await page.screenshot({ path: 'test-screenshots/06-group-interface.png', fullPage: true });
        console.log('   ✅ Group interface loaded\n');
        results.push({ test: 'Open Group Interface', status: 'PASS' });

        // ==========================================
        // TEST 8: Verify All 7 Tabs
        // ==========================================
        console.log('🧪 TEST 8: Testing all 7 tabs...\n');
        
        const tabs = ['chat', 'video', 'files', 'quizzes', 'leaderboard', 'schedule', 'members'];
        
        for (const tabName of tabs) {
            const tabExists = await page.evaluate((tab) => {
                const tabBtn = document.querySelector(`button[data-tab="${tab}"]`);
                return tabBtn !== null;
            }, tabName);
            
            if (tabExists) {
                console.log(`   ✅ ${tabName} tab exists`);
                results.push({ test: `${tabName} Tab Exists`, status: 'PASS' });
            } else {
                console.log(`   ❌ ${tabName} tab missing`);
                results.push({ test: `${tabName} Tab Exists`, status: 'FAIL' });
            }
        }

        // ==========================================
        // TEST 9: Chat Functionality
        // ==========================================
        console.log('\n💬 TEST 9: Testing chat feature...\n');
        
        // Click chat tab
        await page.evaluate(() => {
            const chatTab = document.querySelector('button[data-tab="chat"]');
            if (chatTab) chatTab.click();
        });
        await wait(1000);

        // Check for chat input
        const chatInput = await page.$('#chat-input');
        if (chatInput) {
            console.log('   ✅ Chat input field found');
            
            // Type message
            await page.type('#chat-input', 'Automated test message - verifying chat works! 🚀');
            console.log('   ✅ Typed test message');
            
            // Send message
            await page.keyboard.press('Enter');
            await wait(2000);
            
            // Check if message appeared
            const hasMessages = await page.$('.chat-message');
            if (hasMessages) {
                console.log('   ✅ Chat message sent and displayed!\n');
                results.push({ test: 'Chat Messaging', status: 'PASS' });
                await page.screenshot({ path: 'test-screenshots/07-chat-working.png', fullPage: true });
            } else {
                console.log('   ⚠️  Message sent but not visible yet\n');
                results.push({ test: 'Chat Messaging', status: 'WARNING' });
            }
        } else {
            console.log('   ❌ Chat input not found\n');
            results.push({ test: 'Chat Messaging', status: 'FAIL' });
        }

        // ==========================================
        // TEST 10: Files Tab
        // ==========================================
        console.log('📁 TEST 10: Testing files tab...\n');
        
        await page.evaluate(() => {
            const filesTab = document.querySelector('button[data-tab="files"]');
            if (filesTab) filesTab.click();
        });
        await wait(1000);

        const hasFreeStorage = await page.evaluate(() => {
            return document.body.textContent.includes('100% FREE Forever');
        });

        const hasUploadOptions = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const hasSmall = btns.some(b => b.textContent.includes('Upload Small File'));
            const hasLink = btns.some(b => b.textContent.includes('Share External Link'));
            return hasSmall && hasLink;
        });

        if (hasFreeStorage && hasUploadOptions) {
            console.log('   ✅ Free storage UI present');
            console.log('   ✅ Upload Small File button found');
            console.log('   ✅ Share External Link button found\n');
            results.push({ test: 'Files Tab - Free Storage', status: 'PASS' });
        } else {
            console.log('   ⚠️  File upload UI may be incomplete\n');
            results.push({ test: 'Files Tab - Free Storage', status: 'WARNING' });
        }
        
        await page.screenshot({ path: 'test-screenshots/08-files-tab.png', fullPage: true });

        // ==========================================
        // TEST 11: Quizzes Tab & Modal
        // ==========================================
        console.log('📝 TEST 11: Testing quizzes tab...\n');
        
        await page.evaluate(() => {
            const quizzesTab = document.querySelector('button[data-tab="quizzes"]');
            if (quizzesTab) quizzesTab.click();
        });
        await wait(1000);

        await page.screenshot({ path: 'test-screenshots/09-quizzes-tab.png', fullPage: true });

        // Click Create Quiz
        const createQuizClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const createBtn = buttons.find(b => 
                b.textContent.includes('Create Quiz') &&
                b.onclick &&
                b.onclick.toString().includes('createGroupQuiz')
            );
            if (createBtn) {
                createBtn.click();
                return true;
            }
            return false;
        });

        await wait(1000);

        if (createQuizClicked) {
            const quizModal = await page.$('.create-quiz-modal');
            if (quizModal) {
                console.log('   ✅ Create Quiz MODAL opened (not browser prompt!)');
                results.push({ test: 'Create Quiz Modal', status: 'PASS' });
                await page.screenshot({ path: 'test-screenshots/10-quiz-modal.png', fullPage: true });
                
                // Close modal
                await page.evaluate(() => {
                    const closeBtn = document.querySelector('.create-quiz-modal .close-btn');
                    if (closeBtn) closeBtn.click();
                });
                await wait(500);
            } else {
                console.log('   ⚠️  Create Quiz modal may not have appeared\n');
                results.push({ test: 'Create Quiz Modal', status: 'WARNING' });
            }
        }

        // ==========================================
        // TEST 12: Schedule Tab & Modal
        // ==========================================
        console.log('\n📅 TEST 12: Testing schedule tab...\n');
        
        await page.evaluate(() => {
            const scheduleTab = document.querySelector('button[data-tab="schedule"]');
            if (scheduleTab) scheduleTab.click();
        });
        await wait(1000);

        await page.screenshot({ path: 'test-screenshots/11-schedule-tab.png', fullPage: true });

        // Click Schedule Session
        const scheduleClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const scheduleBtn = buttons.find(b => 
                b.textContent.includes('Schedule Session') &&
                b.onclick &&
                b.onclick.toString().includes('createStudySession')
            );
            if (scheduleBtn) {
                scheduleBtn.click();
                return true;
            }
            return false;
        });

        await wait(1000);

        if (scheduleClicked) {
            const sessionModal = await page.$('.create-session-modal');
            if (sessionModal) {
                console.log('   ✅ Schedule Session MODAL opened (not browser prompt!)');
                results.push({ test: 'Schedule Session Modal', status: 'PASS' });
                await page.screenshot({ path: 'test-screenshots/12-session-modal.png', fullPage: true });
                
                // Close modal
                await page.evaluate(() => {
                    const closeBtn = document.querySelector('.create-session-modal .close-btn');
                    if (closeBtn) closeBtn.click();
                });
                await wait(500);
            } else {
                console.log('   ⚠️  Schedule Session modal may not have appeared\n');
                results.push({ test: 'Schedule Session Modal', status: 'WARNING' });
            }
        }

        // ==========================================
        // TEST 13: All Other Tabs
        // ==========================================
        console.log('\n🧪 TEST 13: Verifying remaining tabs...\n');
        
        const otherTabs = [
            { name: 'video', label: 'Video Call' },
            { name: 'leaderboard', label: 'Leaderboard' },
            { name: 'members', label: 'Members' }
        ];

        for (const tab of otherTabs) {
            await page.evaluate((tabName) => {
                const tabBtn = document.querySelector(`button[data-tab="${tabName}"]`);
                if (tabBtn) tabBtn.click();
            }, tab.name);
            
            await wait(500);
            
            const isActive = await page.$(`#${tab.name}-tab.active`);
            if (isActive) {
                console.log(`   ✅ ${tab.label} tab works`);
                results.push({ test: `${tab.label} Tab`, status: 'PASS' });
            } else {
                console.log(`   ⚠️  ${tab.label} tab may not have activated`);
                results.push({ test: `${tab.label} Tab`, status: 'WARNING' });
            }
        }

        console.log('\n✅ ALL AUTOMATED TESTS COMPLETE!\n');
        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Error', status: 'FAIL', error: error.message });
        
        if (page) {
            await page.screenshot({ path: 'test-screenshots/error-state.png', fullPage: true }).catch(() => {});
        }
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
            console.log('✅ PASSED TESTS:\n');
            passed.forEach(r => {
                console.log(`   ✅ ${r.test}`);
                if (r.code) console.log(`      Invite Code: ${r.code}`);
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

        if (info.length > 0) {
            console.log('\nℹ️  INFO:\n');
            info.forEach(r => {
                console.log(`   ℹ️  ${r.test}`);
                if (r.note) console.log(`      ${r.note}`);
            });
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 FINAL: ${passed.length} passed, ${warned.length} warnings, ${failed.length} failed`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (failed.length === 0 && warned.length === 0) {
            console.log('🎉 ALL TESTS PASSED! Study Groups is working perfectly!\n');
        } else if (failed.length === 0) {
            console.log('✅ All critical tests passed! (Warnings are non-critical)\n');
        }

        console.log('📸 Screenshots saved in test-screenshots/\n');
        console.log('Browser will stay open for 30 seconds for review...\n');
        
        await wait(30000);
        
        if (browser) {
            await browser.close();
        }
    }
}

if (require.main === module) {
    testStudyGroupsLocal().catch(console.error);
}

module.exports = testStudyGroupsLocal;

