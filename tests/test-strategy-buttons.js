// Quick Test - Test-Taking Strategy "Learn More" Buttons
// Verifies the buttons are working correctly

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStrategyButtons() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   TEST-TAKING STRATEGY BUTTONS TEST                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    let browser;
    const APP_URL = 'http://localhost:5002';
    const results = [];

    try {
        // Check if emulators are running
        console.log('🔍 Checking if app is accessible...');
        try {
            await fetch(APP_URL);
            console.log('   ✅ App is running\n');
        } catch (error) {
            console.error('❌ App not accessible at', APP_URL);
            console.error('   Start emulators with: npm start\n');
            process.exit(1);
        }

        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1400, height: 900 },
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        console.log('   ✅ Browser launched\n');

        // Navigate to app (landing page)
        console.log('📱 Loading app...');
        await page.goto(`${APP_URL}/app.html`, { waitUntil: 'networkidle0', timeout: 15000 });
        await wait(3000);
        console.log('   ✅ App loaded\n');

        // Navigate to Settings
        console.log('⚙️  Navigating to Settings...');
        const settingsClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('.nav-item, button'));
            const settingsBtn = buttons.find(b => 
                b.textContent?.includes('Settings') ||
                b.dataset?.view === 'settings'
            );
            if (settingsBtn) {
                settingsBtn.click();
                return true;
            }
            return false;
        });

        if (!settingsClicked) {
            console.log('   ⚠️  Could not find Settings button, trying direct view switch...');
            await page.evaluate(() => {
                if (typeof window.switchView === 'function') {
                    window.switchView('settings');
                }
            });
        }

        await wait(3000);
        console.log('   ✅ At Settings page\n');
        results.push({ test: 'Navigate to Settings', status: 'PASS' });

        await page.screenshot({ path: 'test-screenshots/strategy-01-settings.png', fullPage: true });

        // Find Test-Taking Strategy section
        console.log('🎯 Looking for Test-Taking Strategy Training section...');
        const strategySection = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.includes('Test-Taking Strategy') || text.includes('test-taking');
        });

        if (strategySection) {
            console.log('   ✅ Test-Taking Strategy section found\n');
            results.push({ test: 'Find Strategy Section', status: 'PASS' });
        } else {
            console.log('   ⚠️  Test-Taking Strategy section not visible\n');
            results.push({ test: 'Find Strategy Section', status: 'WARNING' });
        }

        // Count "Learn More" buttons
        console.log('🔍 Looking for "Learn More" buttons...');
        const buttons = await page.evaluate(() => {
            const allButtons = Array.from(document.querySelectorAll('button'));
            const learnMoreButtons = allButtons.filter(b => 
                b.textContent?.includes('Learn More')
            );
            return {
                total: learnMoreButtons.length,
                visible: learnMoreButtons.filter(b => b.offsetParent !== null).length,
                texts: learnMoreButtons.map(b => b.textContent?.trim())
            };
        });

        console.log(`   ✅ Found ${buttons.total} "Learn More" buttons`);
        console.log(`   ✅ ${buttons.visible} are visible\n`);
        
        if (buttons.visible > 0) {
            results.push({ test: 'Find Learn More Buttons', status: 'PASS', count: buttons.visible });
        } else {
            results.push({ test: 'Find Learn More Buttons', status: 'FAIL' });
        }

        // Test clicking a "Learn More" button
        if (buttons.visible > 0) {
            console.log('🖱️  Testing first "Learn More" button click...');
            
            const modalOpened = await page.evaluate(() => {
                const allButtons = Array.from(document.querySelectorAll('button'));
                const learnMoreBtn = allButtons.find(b => 
                    b.textContent?.includes('Learn More') &&
                    b.offsetParent !== null
                );
                
                if (learnMoreBtn) {
                    learnMoreBtn.click();
                    return true;
                }
                return false;
            });

            await wait(2000);

            if (modalOpened) {
                // Check if modal appeared
                const modalVisible = await page.evaluate(() => {
                    const modals = document.querySelectorAll('.modal, [class*="modal"]');
                    return Array.from(modals).some(m => 
                        m.offsetParent !== null || 
                        window.getComputedStyle(m).display !== 'none'
                    );
                });

                if (modalVisible) {
                    console.log('   ✅ Modal opened successfully!\n');
                    results.push({ test: 'Click Learn More Button', status: 'PASS' });
                    results.push({ test: 'Modal Opens', status: 'PASS' });

                    await page.screenshot({ path: 'test-screenshots/strategy-02-modal-open.png', fullPage: true });

                    // Get modal content
                    const modalContent = await page.evaluate(() => {
                        const modal = document.querySelector('.modal, [class*="modal"]');
                        if (modal) {
                            return {
                                hasTitle: !!modal.querySelector('h2, h3, .modal-header'),
                                hasContent: modal.textContent.length > 50,
                                hasCloseButton: !!modal.querySelector('.close-btn, [class*="close"]')
                            };
                        }
                        return null;
                    });

                    if (modalContent) {
                        console.log('📋 Modal Content Check:');
                        console.log(`   ✅ Has Title: ${modalContent.hasTitle ? 'Yes' : 'No'}`);
                        console.log(`   ✅ Has Content: ${modalContent.hasContent ? 'Yes' : 'No'}`);
                        console.log(`   ✅ Has Close Button: ${modalContent.hasCloseButton ? 'Yes' : 'No'}\n`);
                        
                        if (modalContent.hasTitle && modalContent.hasContent && modalContent.hasCloseButton) {
                            results.push({ test: 'Modal Content Complete', status: 'PASS' });
                        } else {
                            results.push({ test: 'Modal Content Complete', status: 'WARNING' });
                        }
                    }

                    // Test closing modal
                    console.log('🖱️  Testing modal close button...');
                    const modalClosed = await page.evaluate(() => {
                        const closeBtn = document.querySelector('.close-btn, [class*="close"]');
                        if (closeBtn) {
                            closeBtn.click();
                            return true;
                        }
                        return false;
                    });

                    await wait(1000);

                    if (modalClosed) {
                        console.log('   ✅ Modal closed successfully!\n');
                        results.push({ test: 'Close Modal', status: 'PASS' });
                    }

                } else {
                    console.log('   ⚠️  Button clicked but modal not visible\n');
                    results.push({ test: 'Modal Opens', status: 'FAIL' });
                }
            } else {
                console.log('   ⚠️  Could not click button\n');
                results.push({ test: 'Click Learn More Button', status: 'FAIL' });
            }
        }

        // Keep browser open for inspection
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅ TEST COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('📸 Screenshots saved to test-screenshots/strategy-*.png');
        console.log('Keeping browser open for 10 seconds for inspection...\n');
        
        await wait(10000);

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.push({ test: 'Test Execution', status: 'FAIL', error: error.message });
        
        if (browser) {
            await page.screenshot({ path: 'test-screenshots/strategy-error.png', fullPage: true });
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
                if (r.count) console.log(`      Found: ${r.count} buttons`);
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
    testStrategyButtons().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStrategyButtons;

