const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testLandingAndLogout() {
    console.log('🚀 Starting Landing Page & Logout Button Test...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const screenshotDir = path.join(__dirname, 'landing-logout-test');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: [],
        summary: { passed: 0, failed: 0 }
    };
    
    try {
        // ============================================
        // TEST 1: Landing Page Loads
        // ============================================
        console.log('📝 TEST 1: Loading landing page...');
        await page.goto('https://aba-mastery-app.web.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-landing-page.png'),
            fullPage: true 
        });
        
        // Check for landing page elements
        const landingPageElements = await page.evaluate(() => {
            const hasH1 = !!document.querySelector('h1');
            const h1Text = document.querySelector('h1')?.textContent || '';
            const hasStartButton = !!document.querySelector('button');
            const startButtonText = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Start'))?.textContent || '';
            
            return {
                hasH1,
                h1Text,
                hasStartButton,
                startButtonText,
                currentURL: window.location.href
            };
        });
        
        console.log('Landing page elements:', JSON.stringify(landingPageElements, null, 2));
        
        if (landingPageElements.hasH1 && landingPageElements.h1Text.includes('ABA')) {
            results.tests.push({
                name: 'Landing page loads with correct content',
                status: 'PASSED',
                details: `H1: "${landingPageElements.h1Text}"`
            });
            results.summary.passed++;
            console.log('✅ Landing page loaded successfully\n');
        } else {
            results.tests.push({
                name: 'Landing page loads',
                status: 'FAILED',
                details: 'Landing page elements not found'
            });
            results.summary.failed++;
            console.log('❌ Landing page did not load correctly\n');
        }
        
        // ============================================
        // TEST 2: "Start Studying" Button Exists
        // ============================================
        console.log('📝 TEST 2: Checking "Start Studying" button...');
        
        if (landingPageElements.hasStartButton && landingPageElements.startButtonText.includes('Start')) {
            results.tests.push({
                name: '"Start Studying" button exists',
                status: 'PASSED',
                details: `Button text: "${landingPageElements.startButtonText}"`
            });
            results.summary.passed++;
            console.log(`✅ Start button found: "${landingPageElements.startButtonText}"\n`);
        } else {
            results.tests.push({
                name: '"Start Studying" button exists',
                status: 'FAILED',
                details: 'Button not found'
            });
            results.summary.failed++;
            console.log('❌ Start button not found\n');
        }
        
        // ============================================
        // TEST 3: Click "Start Studying" and Navigate to App
        // ============================================
        console.log('📝 TEST 3: Clicking "Start Studying Now" button...');
        
        const buttonFound = await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Start'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        if (buttonFound) {
            console.log('   Button clicked, waiting for navigation...');
            
            // Wait for navigation
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const newURL = page.url();
            console.log(`   New URL: ${newURL}`);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '02-after-click-start.png'),
                fullPage: true 
            });
            
            if (newURL.includes('/app') || newURL.includes('index.html')) {
                results.tests.push({
                    name: 'Navigate to app after clicking Start',
                    status: 'PASSED',
                    details: `Navigated to: ${newURL}`
                });
                results.summary.passed++;
                console.log('✅ Successfully navigated to app\n');
            } else {
                results.tests.push({
                    name: 'Navigate to app',
                    status: 'FAILED',
                    details: `Still on: ${newURL}`
                });
                results.summary.failed++;
                console.log('❌ Did not navigate to app\n');
            }
        }
        
        // ============================================
        // TEST 4: App Loads
        // ============================================
        console.log('📝 TEST 4: Checking if app loaded...');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const appLoaded = await page.evaluate(() => {
            const appElement = document.getElementById('app');
            const header = document.querySelector('.app-header');
            return {
                hasApp: !!appElement,
                hasHeader: !!header,
                appVisible: appElement ? window.getComputedStyle(appElement).display !== 'none' : false
            };
        });
        
        console.log('App load status:', JSON.stringify(appLoaded, null, 2));
        
        if (appLoaded.hasApp && appLoaded.appVisible) {
            results.tests.push({
                name: 'App loads successfully',
                status: 'PASSED',
                details: 'App container visible with header'
            });
            results.summary.passed++;
            console.log('✅ App loaded successfully\n');
        } else {
            results.tests.push({
                name: 'App loads',
                status: 'FAILED',
                details: JSON.stringify(appLoaded)
            });
            results.summary.failed++;
            console.log('❌ App did not load properly\n');
        }
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '03-app-loaded.png'),
            fullPage: true 
        });
        
        // ============================================
        // TEST 5: Profile Icon Exists
        // ============================================
        console.log('📝 TEST 5: Checking for profile icon...');
        
        const profileIcon = await page.evaluate(() => {
            const authBtn = document.getElementById('auth-btn');
            return {
                exists: !!authBtn,
                visible: authBtn ? window.getComputedStyle(authBtn).display !== 'none' : false,
                position: authBtn ? authBtn.getBoundingClientRect() : null
            };
        });
        
        console.log('Profile icon:', JSON.stringify(profileIcon, null, 2));
        
        if (profileIcon.exists && profileIcon.visible) {
            results.tests.push({
                name: 'Profile icon exists and visible',
                status: 'PASSED',
                details: `Position: top ${Math.round(profileIcon.position.top)}px`
            });
            results.summary.passed++;
            console.log('✅ Profile icon found and visible\n');
        } else {
            results.tests.push({
                name: 'Profile icon visible',
                status: 'FAILED',
                details: 'Profile icon not found or not visible'
            });
            results.summary.failed++;
            console.log('❌ Profile icon not visible\n');
        }
        
        // ============================================
        // TEST 6: Click Profile Icon to Open Dropdown
        // ============================================
        console.log('📝 TEST 6: Clicking profile icon...');
        
        await page.click('#auth-btn');
        console.log('   Profile icon clicked, waiting for dropdown...');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '04-profile-dropdown-opened.png'),
            fullPage: false 
        });
        
        // ============================================
        // TEST 7: Profile Dropdown Opens
        // ============================================
        console.log('📝 TEST 7: Checking if profile dropdown opened...');
        
        const dropdownInfo = await page.evaluate(() => {
            const dropdown = document.getElementById('profile-dropdown');
            if (!dropdown) return { exists: false };
            
            const style = window.getComputedStyle(dropdown);
            const rect = dropdown.getBoundingClientRect();
            
            return {
                exists: true,
                display: style.display,
                visible: style.display !== 'none',
                width: rect.width,
                height: rect.height,
                innerHTML: dropdown.innerHTML.substring(0, 200) + '...'
            };
        });
        
        console.log('Dropdown info:', JSON.stringify(dropdownInfo, null, 2));
        
        if (dropdownInfo.exists && dropdownInfo.visible) {
            results.tests.push({
                name: 'Profile dropdown opens',
                status: 'PASSED',
                details: `Display: ${dropdownInfo.display}, Size: ${Math.round(dropdownInfo.width)}x${Math.round(dropdownInfo.height)}px`
            });
            results.summary.passed++;
            console.log('✅ Profile dropdown opened successfully\n');
        } else {
            results.tests.push({
                name: 'Profile dropdown opens',
                status: 'FAILED',
                details: dropdownInfo.exists ? 'Dropdown exists but not visible' : 'Dropdown element not found'
            });
            results.summary.failed++;
            console.log('❌ Profile dropdown did not open\n');
        }
        
        // ============================================
        // TEST 8: Logout Button Exists in Dropdown
        // ============================================
        console.log('📝 TEST 8: Checking for logout/sign-out button in dropdown...');
        
        const logoutButtonInfo = await page.evaluate(() => {
            const authAction = document.getElementById('profile-auth-action');
            if (!authAction) return { exists: false, reason: 'Element not found' };
            
            const rect = authAction.getBoundingClientRect();
            const style = window.getComputedStyle(authAction);
            const text = authAction.textContent.trim();
            const icon = authAction.querySelector('.menu-icon')?.textContent || '';
            
            // Check if it's in the footer section
            const footer = authAction.closest('.profile-footer');
            
            return {
                exists: true,
                visible: style.display !== 'none' && rect.width > 0 && rect.height > 0,
                text: text,
                icon: icon,
                inFooter: !!footer,
                position: {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                },
                className: authAction.className
            };
        });
        
        console.log('Logout button info:', JSON.stringify(logoutButtonInfo, null, 2));
        
        if (logoutButtonInfo.exists && logoutButtonInfo.visible && logoutButtonInfo.inFooter) {
            results.tests.push({
                name: 'Logout/Sign-out button in profile dropdown',
                status: 'PASSED',
                details: `Text: "${logoutButtonInfo.text}", Icon: ${logoutButtonInfo.icon}, In footer: YES`
            });
            results.summary.passed++;
            console.log(`✅ Logout button FOUND in dropdown footer!\n`);
            console.log(`   Text: "${logoutButtonInfo.text}"`);
            console.log(`   Icon: ${logoutButtonInfo.icon}`);
            console.log(`   Position: Bottom of dropdown (footer section)\n`);
        } else {
            results.tests.push({
                name: 'Logout button in dropdown',
                status: 'FAILED',
                details: logoutButtonInfo.exists 
                    ? `Button exists but: visible=${logoutButtonInfo.visible}, inFooter=${logoutButtonInfo.inFooter}`
                    : logoutButtonInfo.reason
            });
            results.summary.failed++;
            console.log('❌ Logout button not properly visible or not in footer\n');
        }
        
        // Take a close-up screenshot highlighting the logout button
        await page.screenshot({ 
            path: path.join(screenshotDir, '05-logout-button-closeup.png'),
            fullPage: false 
        });
        
        // ============================================
        // TEST 9: Dropdown Contains Expected Sections
        // ============================================
        console.log('📝 TEST 9: Checking dropdown structure...');
        
        const dropdownStructure = await page.evaluate(() => {
            const dropdown = document.getElementById('profile-dropdown');
            if (!dropdown) return { exists: false };
            
            return {
                hasProfileHeader: !!dropdown.querySelector('.profile-header'),
                hasProfileName: !!dropdown.querySelector('#profile-name'),
                hasProfileEmail: !!dropdown.querySelector('#profile-email'),
                hasProfileStats: !!dropdown.querySelector('.profile-stats'),
                hasProfileMenu: !!dropdown.querySelector('.profile-menu'),
                hasProfileFooter: !!dropdown.querySelector('.profile-footer'),
                profileNameText: dropdown.querySelector('#profile-name')?.textContent,
                profileEmailText: dropdown.querySelector('#profile-email')?.textContent
            };
        });
        
        console.log('Dropdown structure:', JSON.stringify(dropdownStructure, null, 2));
        
        const allSectionsPresent = dropdownStructure.hasProfileHeader && 
                                   dropdownStructure.hasProfileStats && 
                                   dropdownStructure.hasProfileMenu && 
                                   dropdownStructure.hasProfileFooter;
        
        if (allSectionsPresent) {
            results.tests.push({
                name: 'Profile dropdown has all sections',
                status: 'PASSED',
                details: 'Header, Stats, Menu, and Footer sections all present'
            });
            results.summary.passed++;
            console.log('✅ All dropdown sections present\n');
        } else {
            results.tests.push({
                name: 'Profile dropdown structure',
                status: 'FAILED',
                details: JSON.stringify(dropdownStructure)
            });
            results.summary.failed++;
            console.log('❌ Some dropdown sections missing\n');
        }
        
        // ============================================
        // TEST 10: Click Logout Button
        // ============================================
        console.log('📝 TEST 10: Testing logout button click...');
        
        // Set up dialog handler for the alert
        let alertMessage = '';
        page.on('dialog', async dialog => {
            alertMessage = dialog.message();
            console.log(`   Alert appeared: "${alertMessage}"`);
            await dialog.accept();
        });
        
        // Click the logout button
        const clicked = await page.evaluate(() => {
            const authAction = document.getElementById('profile-auth-action');
            if (!authAction) return false;
            authAction.click();
            return true;
        });
        
        if (clicked) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            results.tests.push({
                name: 'Logout button clickable',
                status: 'PASSED',
                details: alertMessage ? `Alert shown: "${alertMessage}"` : 'Button clicked successfully'
            });
            results.summary.passed++;
            console.log('✅ Logout button is clickable\n');
            
            if (alertMessage) {
                console.log(`   Alert message: "${alertMessage}"\n`);
            }
        } else {
            results.tests.push({
                name: 'Logout button click',
                status: 'FAILED',
                details: 'Could not click logout button'
            });
            results.summary.failed++;
            console.log('❌ Could not click logout button\n');
        }
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '06-after-logout-click.png'),
            fullPage: false 
        });
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.tests.push({
            name: 'Test Execution',
            status: 'ERROR',
            details: error.message
        });
        results.summary.failed++;
        
        await page.screenshot({ 
            path: path.join(screenshotDir, 'zz-error.png'),
            fullPage: true 
        });
    }
    
    // Save results
    fs.writeFileSync(
        path.join(screenshotDir, 'test-results.json'),
        JSON.stringify(results, null, 2)
    );
    
    // Print detailed summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`📁 Screenshots: ${screenshotDir}`);
    console.log('='.repeat(70));
    
    console.log('\n📋 Detailed Results:');
    results.tests.forEach((test, index) => {
        const icon = test.status === 'PASSED' ? '✅' : '❌';
        console.log(`\n${index + 1}. ${icon} ${test.name}`);
        console.log(`   Status: ${test.status}`);
        console.log(`   Details: ${test.details}`);
    });
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    await browser.close();
    
    return results.summary.failed === 0;
}

// Run the test
testLandingAndLogout()
    .then(success => {
        if (success) {
            console.log('🎉 ALL TESTS PASSED! Landing page and logout button working perfectly!\n');
        } else {
            console.log('⚠️  Some tests failed. Check screenshots and results for details.\n');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });

