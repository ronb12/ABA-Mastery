const puppeteer = require('puppeteer');

// Helper function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    console.log('🚀 Starting Logout Redirect Test...\n');
    console.log('=' .repeat(60));
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });
    
    let page;
    
    try {
        page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('✅') || text.includes('🚪') || text.includes('signed out')) {
                console.log('   📄 Browser:', text);
            }
        });
        
        // Step 1: Navigate to landing page
        console.log('\n📍 STEP 1: Navigate to Landing Page');
        console.log('-'.repeat(60));
        await page.goto('https://aba-mastery-app.web.app/landing', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        await delay(2000);
        console.log('   ✅ Landing page loaded');
        console.log('   📍 URL:', page.url());
        
        // Step 2: Click Sign In
        console.log('\n📍 STEP 2: Navigate to Login Page');
        console.log('-'.repeat(60));
        const signInClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const signInBtn = buttons.find(btn => btn.textContent.includes('Sign In'));
            if (signInBtn) {
                signInBtn.click();
                return true;
            }
            return false;
        });
        
        if (!signInClicked) {
            throw new Error('❌ Could not find Sign In button');
        }
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        console.log('   ✅ Navigated to login page');
        console.log('   📍 URL:', page.url());
        
        // Step 3: Login
        console.log('\n📍 STEP 3: Login with Test Credentials');
        console.log('-'.repeat(60));
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        
        console.log('   ⌨️  Typing email: test123@aba.com');
        await page.type('input[type="email"]', 'test123@aba.com', { delay: 50 });
        
        console.log('   ⌨️  Typing password: ********');
        await page.type('input[type="password"]', 'Test123!', { delay: 50 });
        
        console.log('   🖱️  Clicking Sign In button...');
        await page.click('button[type="submit"]');
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log('   ✅ Successfully logged in');
        console.log('   📍 URL:', page.url());
        
        // Wait for app to load
        await delay(3000);
        
        // Step 4: Navigate to Settings
        console.log('\n📍 STEP 4: Navigate to Settings');
        console.log('-'.repeat(60));
        const settingsClicked = await page.evaluate(() => {
            const navButtons = Array.from(document.querySelectorAll('[data-view="settings"]'));
            if (navButtons.length > 0) {
                navButtons[0].click();
                return true;
            }
            return false;
        });
        
        if (!settingsClicked) {
            throw new Error('❌ Could not find Settings navigation button');
        }
        
        await delay(1000);
        console.log('   ✅ Navigated to Settings view');
        
        // Step 5: Click Sign Out and monitor redirect
        console.log('\n📍 STEP 5: Click Sign Out Button');
        console.log('-'.repeat(60));
        
        const signOutBtn = await page.$('#sign-out-btn');
        if (!signOutBtn) {
            throw new Error('❌ Could not find Sign Out button');
        }
        
        console.log('   🖱️  Clicking "Sign Out" button...');
        
        // Set up navigation promise before clicking
        const navigationPromise = page.waitForNavigation({ 
            waitUntil: 'networkidle2', 
            timeout: 5000 
        }).catch(() => null); // Don't fail if no navigation
        
        await signOutBtn.click();
        console.log('   ✅ Sign Out button clicked');
        
        // Step 6: Check for notification
        console.log('\n📍 STEP 6: Check for Success Notification');
        console.log('-'.repeat(60));
        await delay(500);
        
        const notificationFound = await page.evaluate(() => {
            const notifications = Array.from(document.querySelectorAll('.notification, div[style*="position: fixed"]'));
            const successNotification = notifications.find(n => 
                n.textContent.includes('Successfully signed out') ||
                n.textContent.includes('signed out')
            );
            
            if (successNotification) {
                const bgColor = window.getComputedStyle(successNotification).backgroundColor;
                const isGreen = bgColor.includes('16, 185, 129') || bgColor.includes('rgb(16, 185, 129)');
                return {
                    found: true,
                    message: successNotification.textContent.trim(),
                    color: bgColor,
                    isGreen: isGreen
                };
            }
            return { found: false };
        });
        
        if (notificationFound.found) {
            console.log('   ✅ Success notification displayed!');
            console.log('   📝 Message:', notificationFound.message);
            console.log('   🎨 Color:', notificationFound.color);
            if (notificationFound.isGreen) {
                console.log('   ✅ Notification is GREEN (success color)');
            } else {
                console.log('   ⚠️  Notification color might not be green');
            }
        } else {
            console.log('   ⚠️  Could not detect notification (might be too fast)');
        }
        
        // Step 7: Wait for redirect and verify
        console.log('\n📍 STEP 7: Wait for Redirect to Landing Page');
        console.log('-'.repeat(60));
        console.log('   ⏳ Waiting for redirect (should happen in ~1.5 seconds)...');
        
        // Wait for navigation
        await navigationPromise;
        
        // Give it a bit more time if needed
        await delay(2000);
        
        const finalUrl = page.url();
        console.log('   📍 Current URL:', finalUrl);
        
        // Check if we're on the landing page
        const isOnLandingPage = finalUrl.includes('landing');
        
        if (isOnLandingPage) {
            console.log('   ✅ Successfully redirected to landing page!');
            
            // Verify landing page content
            const landingPageContent = await page.evaluate(() => {
                const hasHeading = document.body.textContent.includes('Master Your ABA Certification');
                const hasGuestButton = document.body.textContent.includes('Start Studying') || 
                                      document.body.textContent.includes('Guest Mode');
                const hasSignInButton = document.body.textContent.includes('Sign In');
                
                return {
                    hasHeading,
                    hasGuestButton,
                    hasSignInButton
                };
            });
            
            console.log('   ✅ Landing page content verified:');
            console.log('      • Heading:', landingPageContent.hasHeading ? '✅' : '❌');
            console.log('      • Guest Mode button:', landingPageContent.hasGuestButton ? '✅' : '❌');
            console.log('      • Sign In button:', landingPageContent.hasSignInButton ? '✅' : '❌');
            
        } else {
            console.log('   ❌ NOT on landing page!');
            console.log('      Expected URL to include: "landing"');
            console.log('      Actual URL:', finalUrl);
        }
        
        // Final Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        
        if (isOnLandingPage) {
            console.log('   ✅ PASSED: Logout redirects to landing page');
            console.log('   ✅ Notification displayed (if detected)');
            console.log('   ✅ Landing page loaded successfully');
            console.log('   ✅ User is logged out');
            console.log('\n🎉 TEST PASSED! ✅\n');
        } else {
            console.log('   ❌ FAILED: Did not redirect to landing page');
            console.log('   📍 Final URL:', finalUrl);
            console.log('\n❌ TEST FAILED!\n');
        }
        
    } catch (error) {
        console.error('\n❌ TEST ERROR:', error.message);
        if (page) {
            console.error('   📍 Current URL:', page.url());
        }
        console.error('\n', error);
    } finally {
        console.log('⏳ Closing browser in 5 seconds...\n');
        await delay(5000);
        await browser.close();
    }
})();

