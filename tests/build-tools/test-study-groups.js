// Comprehensive Study Groups Feature Test
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroups() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         TESTING STUDY GROUPS PREMIUM FEATURES             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    let browser;
    const errors = [];
    const successes = [];

    try {
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 }
        });

        const page = await browser.newPage();

        // Capture console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('Browser Error:', msg.text());
            }
        });

        page.on('pageerror', error => {
            console.log('Page Error:', error.message);
            errors.push(`Page Error: ${error.message}`);
        });

        // Navigate to app
        console.log('📱 Navigating to app...');
        await page.goto('https://aba-mastery-app.web.app', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // Wait for page to load
        await wait(2000);

        // Check if we need to login or continue as guest
        const url = await page.url();
        const isLoginPage = url.includes('login') || url.includes('landing') || !url.includes('/app');
        
        if (isLoginPage) {
            console.log('🔐 On landing/login page, continuing as guest...');
            
            // Look for guest button using evaluate
            const guestButtonFound = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, a'));
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
            
            if (guestButtonFound) {
                await wait(2000);
                console.log('✅ Clicked guest button');
            } else {
                console.log('⚠️  No guest button found, may need to sign up...');
            }
        }

        await wait(2000);

        // Navigate to Study Groups
        console.log('\n📚 Navigating to Study Groups...');
        const studyGroupsNav = await page.$('[data-view="study-groups"]');
        
        if (!studyGroupsNav) {
            errors.push('Study Groups navigation button not found');
            console.log('❌ Study Groups navigation not found');
        } else {
            await studyGroupsNav.click();
            await wait(1000);
            successes.push('Navigated to Study Groups view');
            console.log('✅ Navigated to Study Groups view');
        }

        // Check for auth requirement
        const authRequired = await page.$('.auth-required');
        if (authRequired) {
            console.log('\n⚠️  Study Groups requires authentication');
            console.log('📝 Creating test account...');
            
            // Go to signup
            await page.goto('https://aba-mastery-app.web.app/signup', { 
                waitUntil: 'networkidle2',
                timeout: 10000
            });
            await wait(2000);

            // Wait for form to be ready
            await page.waitForSelector('#full-name', { timeout: 5000 }).catch(() => {
                console.log('⚠️  Signup form not found, may already be signed in');
                return null;
            });

            // Check if form exists
            const hasForm = await page.$('#full-name');
            if (!hasForm) {
                console.log('⚠️  Already logged in or form unavailable, continuing test...');
            } else {
                // Fill signup form
                const testEmail = `test${Date.now()}@abamastery.test`;
                const testPassword = 'TestPass123!';
                
                await page.type('#full-name', 'Test User');
                await page.type('#email', testEmail);
                await page.type('#password', testPassword);
                await page.type('#confirm-password', testPassword);
                
                // Submit form
                const signupButton = await page.$('button[type="submit"]');
                if (signupButton) {
                    await signupButton.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
                    await wait(3000);
                    successes.push('Test account created successfully');
                    console.log('✅ Test account created');
                }
            }

            // Navigate back to study groups
            const studyGroupsNav2 = await page.$('[data-view="study-groups"]');
            if (studyGroupsNav2) {
                await studyGroupsNav2.click();
                await wait(1000);
            }
        }

        // Test Create Group Button
        console.log('\n🧪 Testing Create Group Modal...');
        const createGroupBtn = await page.$('button[onclick*="showCreateGroupModal"]');
        
        if (!createGroupBtn) {
            errors.push('Create Group button not found');
            console.log('❌ Create Group button not found');
        } else {
            await createGroupBtn.click();
            await wait(500);
            
            // Check if modal appeared
            const modal = await page.$('.study-group-modal');
            if (!modal) {
                errors.push('Create Group modal did not appear');
                console.log('❌ Modal did not appear');
            } else {
                successes.push('Create Group modal opened');
                console.log('✅ Create Group modal opened');
                
                // Take screenshot
                await page.screenshot({ path: 'test-screenshots/create-group-modal.png' });
                
                // Fill form
                console.log('📝 Filling group creation form...');
                await page.type('#group-name', 'Test Study Group');
                await page.type('#group-description', 'This is a test group for automated testing');
                await page.select('#exam-type', 'BCBA');
                
                // Submit form
                const submitBtn = await page.$('button[onclick*="submitCreateGroup"]');
                if (submitBtn) {
                    await submitBtn.click();
                    await wait(3000);
                    
                    // Check for invite code modal
                    const inviteModal = await page.$('.invite-code-modal');
                    if (inviteModal) {
                        successes.push('Group created successfully');
                        console.log('✅ Group created successfully');
                        
                        // Get invite code
                        const inviteCode = await page.$eval('.invite-code', el => el.textContent);
                        console.log(`📋 Invite Code: ${inviteCode}`);
                        
                        // Take screenshot
                        await page.screenshot({ path: 'test-screenshots/invite-code-modal.png' });
                        
                        // Close modal
                        const closeBtn = await page.$('.invite-code-modal .close-btn');
                        if (closeBtn) {
                            await closeBtn.click();
                            await wait(500);
                        }
                        
                        // Test opening the group
                        console.log('\n🚪 Testing Open Group...');
                        const groupCard = await page.$('.group-card');
                        if (groupCard) {
                            const openGroupBtn = await groupCard.$('button[onclick*="openGroup"]');
                            if (openGroupBtn) {
                                await openGroupBtn.click();
                                await wait(2000);
                                
                                // Check if group interface loaded
                                const groupInterface = await page.$('.group-interface');
                                if (groupInterface) {
                                    successes.push('Group interface loaded');
                                    console.log('✅ Group interface loaded');
                                    
                                    // Take screenshot
                                    await page.screenshot({ path: 'test-screenshots/group-interface.png' });
                                    
                                    // Test all tabs
                                    console.log('\n🧪 Testing Group Tabs...');
                                    
                                    const tabs = ['chat', 'video', 'files', 'quizzes', 'leaderboard', 'schedule', 'members'];
                                    for (const tab of tabs) {
                                        console.log(`  Testing ${tab} tab...`);
                                        const tabButton = await page.$(`button[data-tab="${tab}"]`);
                                        if (tabButton) {
                                            await tabButton.click();
                                            await wait(500);
                                            
                                            const tabPane = await page.$(`#${tab}-tab.active`);
                                            if (tabPane) {
                                                successes.push(`${tab} tab works`);
                                                console.log(`  ✅ ${tab} tab loaded`);
                                                
                                                // Take screenshot
                                                await page.screenshot({ path: `test-screenshots/${tab}-tab.png` });
                                            } else {
                                                errors.push(`${tab} tab did not activate`);
                                                console.log(`  ❌ ${tab} tab did not activate`);
                                            }
                                        }
                                    }
                                    
                                    // Test chat message
                                    console.log('\n💬 Testing Chat...');
                                    const chatTab = await page.$('button[data-tab="chat"]');
                                    if (chatTab) {
                                        await chatTab.click();
                                        await wait(500);
                                        
                                        const chatInput = await page.$('#chat-input');
                                        if (chatInput) {
                                            await chatInput.type('Hello! This is a test message.');
                                            
                                            const sendBtn = await page.$('button[onclick*="sendChatMessage"]');
                                            if (sendBtn) {
                                                await sendBtn.click();
                                                await wait(2000);
                                                
                                                // Check if message appeared
                                                const message = await page.$('.chat-message');
                                                if (message) {
                                                    successes.push('Chat message sent successfully');
                                                    console.log('✅ Chat message sent');
                                                    await page.screenshot({ path: 'test-screenshots/chat-message.png' });
                                                } else {
                                                    errors.push('Chat message did not appear');
                                                    console.log('❌ Chat message did not appear');
                                                }
                                            }
                                        }
                                    }
                                    
                                } else {
                                    errors.push('Group interface did not load');
                                    console.log('❌ Group interface did not load');
                                }
                            }
                        }
                    } else {
                        errors.push('Invite code modal did not appear after group creation');
                        console.log('❌ Invite code modal did not appear');
                    }
                }
            }
        }

        // Test Join Group Button
        console.log('\n🧪 Testing Join Group Modal...');
        
        // Go back to groups list
        await page.goto('https://aba-mastery-app.web.app/app', { waitUntil: 'networkidle2' });
        await wait(1000);
        
        const studyGroupsNav3 = await page.$('[data-view="study-groups"]');
        if (studyGroupsNav3) {
            await studyGroupsNav3.click();
            await wait(1000);
        }
        
        const joinGroupBtn = await page.$('button[onclick*="showJoinGroupModal"]');
        if (!joinGroupBtn) {
            errors.push('Join Group button not found');
            console.log('❌ Join Group button not found');
        } else {
            await joinGroupBtn.click();
            await wait(500);
            
            const joinModal = await page.$('.study-group-modal');
            if (joinModal) {
                successes.push('Join Group modal opened');
                console.log('✅ Join Group modal opened');
                await page.screenshot({ path: 'test-screenshots/join-group-modal.png' });
                
                // Close modal
                const closeBtn = await joinModal.$('.close-btn');
                if (closeBtn) {
                    await closeBtn.click();
                }
            } else {
                errors.push('Join Group modal did not appear');
                console.log('❌ Join Group modal did not appear');
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
        errors.push(`Test Error: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Print results
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      TEST RESULTS                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`✅ Successes: ${successes.length}`);
    successes.forEach(s => console.log(`   • ${s}`));

    if (errors.length > 0) {
        console.log(`\n❌ Errors: ${errors.length}`);
        errors.forEach(e => console.log(`   • ${e}`));
        console.log('\n⚠️  TESTS FAILED - Review errors above\n');
        return 1;
    } else {
        console.log('\n🎉 ALL TESTS PASSED!\n');
        return 0;
    }
}

// Run tests
if (require.main === module) {
    testStudyGroups().then(code => process.exit(code));
}

module.exports = testStudyGroups;

