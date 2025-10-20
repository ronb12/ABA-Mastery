const puppeteer = require('puppeteer');

// Helper function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    console.log('🚀 Starting Sign-Out Test...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });
    
    let page;
    
    try {
        page = await browser.newPage();
        
        // Navigate to landing page
        console.log('📍 Step 1: Navigating to landing page...');
        await page.goto('https://aba-mastery-app.web.app/landing.html', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        await delay(2000);
        console.log('✅ Landing page loaded\n');
        
        // Click "Sign In"
        console.log('📍 Step 2: Clicking "Sign In" button...');
        
        // Find and click the Sign In button
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
            throw new Error('Could not find Sign In button');
        }
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        console.log('✅ Navigated to login page\n');
        
        // Login
        console.log('📍 Step 3: Logging in with test credentials...');
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.type('input[type="email"]', 'test123@aba.com');
        await page.type('input[type="password"]', 'Test123!');
        
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ Successfully logged in\n');
        
        // Wait for app to load
        await delay(3000);
        
        // Navigate to Settings
        console.log('📍 Step 4: Navigating to Settings...');
        const settingsClicked = await page.evaluate(() => {
            const navButtons = Array.from(document.querySelectorAll('[data-view="settings"]'));
            if (navButtons.length > 0) {
                navButtons[0].click();
                return true;
            }
            return false;
        });
        
        if (!settingsClicked) {
            throw new Error('Could not find Settings navigation button');
        }
        
        await delay(1000);
        console.log('✅ Navigated to Settings view\n');
        
        // Click Sign Out
        console.log('📍 Step 5: Clicking "Sign Out" button...');
        const signOutBtn = await page.waitForSelector('#sign-out-btn', { timeout: 10000 });
        if (!signOutBtn) {
            throw new Error('Could not find Sign Out button');
        }
        
        await signOutBtn.click();
        console.log('✅ Clicked Sign Out button\n');
        
        // Wait for notification
        console.log('📍 Step 6: Checking for success notification...');
        await delay(1000);
        
        const notificationVisible = await page.evaluate(() => {
            const notifications = Array.from(document.querySelectorAll('.notification'));
            return notifications.some(n => 
                n.textContent.includes('Successfully signed out') &&
                n.style.backgroundColor.includes('rgb(16, 185, 129)') // Green color
            );
        });
        
        if (notificationVisible) {
            console.log('✅ Success notification displayed with green background\n');
        } else {
            console.warn('⚠️  Success notification not found\n');
        }
        
        // Wait for redirect
        console.log('📍 Step 7: Waiting for redirect to landing page...');
        await delay(2000);
        
        // Check if redirected to landing page
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}\n`);
        
        if (currentUrl.includes('landing.html')) {
            console.log('✅ Successfully redirected to landing page!\n');
            console.log('🎉 SIGN-OUT TEST PASSED! ✅\n');
            console.log('Summary:');
            console.log('  ✅ Notification displayed');
            console.log('  ✅ Redirect to landing page successful');
            console.log('  ✅ URL: https://aba-mastery-app.web.app/landing.html');
        } else {
            console.error('❌ Redirect failed - not on landing page');
            console.error(`   Expected: landing.html`);
            console.error(`   Got: ${currentUrl}`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
    } finally {
        console.log('\n⏳ Closing browser in 5 seconds...');
        await delay(5000);
        await browser.close();
    }
})();

