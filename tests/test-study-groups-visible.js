// Simple Visible Study Groups Test
// Opens two browser windows that stay open for manual testing

const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testStudyGroupsVisible() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║   STUDY GROUP NOTIFICATIONS TEST - VISIBLE VERSION          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    console.log('This test will open TWO BROWSER WINDOWS that stay open.\n');
    console.log('📋 Checking prerequisites...\n');

    // Check if emulators are running
    try {
        const response = await fetch('http://localhost:4000');
        console.log('   ✅ Emulator UI is running\n');
    } catch (error) {
        console.error('❌ ERROR: Firebase Emulators are not running!\n');
        console.error('Please start them first: npm start\n');
        process.exit(1);
    }

    let browser;

    try {
        console.log('🌐 Launching browser...\n');
        
        // Launch browser in a very visible way
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 800, height: 900 },
            args: [
                '--window-size=800,900',
                '--window-position=0,0',
                '--no-sandbox',
                '--disable-web-security'
            ]
        });

        console.log('✅ Browser launched!\n');
        console.log('Opening TWO tabs for two users...\n');

        // Get the default page
        const pages = await browser.pages();
        const page1 = pages[0];
        
        // Create second page
        const page2 = await browser.newPage();

        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('🎬 LOADING APP IN BOTH TABS...\n');
        console.log('═══════════════════════════════════════════════════════════\n');

        // Navigate both to login page
        const APP_URL = 'http://localhost:5002';
        
        console.log('Tab 1: Loading login page...');
        await page1.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle2' });
        await wait(2000);
        console.log('✅ Tab 1 ready at login page\n');

        console.log('Tab 2: Loading login page...');
        await page2.goto(`${APP_URL}/login.html`, { waitUntil: 'networkidle2' });
        await wait(2000);
        console.log('✅ Tab 2 ready at login page\n');

        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('🔐 AUTO-SIGNING IN BOTH USERS...\n');
        console.log('═══════════════════════════════════════════════════════════\n');

        // Sign in User 1
        console.log('Tab 1: Signing in test123@aba.com...');
        try {
            await page1.type('#email', 'test123@aba.com', { delay: 30 });
            await page1.type('#password', 'Test123!', { delay: 30 });
            await wait(500);
            
            await page1.click('button[type="submit"], #login-btn, button[onclick*="signIn"]');
            await wait(5000);
            
            const url1 = page1.url();
            if (url1.includes('/app') || url1.includes('app.html')) {
                console.log('✅ User 1 signed in successfully!\n');
            } else {
                console.log('⚠️  User 1 may not have redirected - check browser\n');
            }
        } catch (error) {
            console.log('⚠️  Error signing in User 1:', error.message, '\n');
        }

        // Sign in User 2
        console.log('Tab 2: Signing in test456@aba.com...');
        try {
            await page2.type('#email', 'test456@aba.com', { delay: 30 });
            await page2.type('#password', 'Test456!', { delay: 30 });
            await wait(500);
            
            await page2.click('button[type="submit"], #login-btn, button[onclick*="signIn"]');
            await wait(5000);
            
            const url2 = page2.url();
            if (url2.includes('/app') || url2.includes('app.html')) {
                console.log('✅ User 2 signed in successfully!\n');
            } else {
                console.log('⚠️  User 2 may not have redirected - check browser\n');
            }
        } catch (error) {
            console.log('⚠️  Error signing in User 2:', error.message, '\n');
        }

        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('✅ BOTH USERS ARE READY!\n');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        console.log('📋 MANUAL TESTING INSTRUCTIONS:\n');
        console.log('You should see a BROWSER WINDOW with TWO TABS:\n');
        console.log('TAB 1 (test123@aba.com):');
        console.log('   1. Click "Study Groups" in navigation (👥 icon)');
        console.log('   2. Click "Create Group"');
        console.log('   3. Fill in: Name, Description, Exam Type');
        console.log('   4. Click "Create"');
        console.log('   5. Note the INVITE CODE displayed\n');
        
        console.log('TAB 2 (test456@aba.com):');
        console.log('   1. Click "Study Groups" in navigation');
        console.log('   2. Click "Join Group"');
        console.log('   3. Enter the invite code from Tab 1');
        console.log('   4. Click "Join"\n');
        
        console.log('THEN TEST NOTIFICATIONS:');
        console.log('   Tab 1: Go to "Schedule" tab');
        console.log('   Tab 1: Click "Schedule Session"');
        console.log('   Tab 1: Fill form and submit');
        console.log('   Tab 2: Watch for NOTIFICATION! 🔔');
        console.log('   Tab 2: Check if schedule updates');
        console.log('   Tab 2: Click "Join Session" button\n');
        
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('⏸️  BROWSER WILL STAY OPEN FOR TESTING\n');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('The browser window will stay open until you close it.');
        console.log('Or press Ctrl+C in this terminal to stop.\n');
        console.log('🎛️  Emulator UI: http://localhost:4000\n');

        // Keep the browser open indefinitely
        await new Promise(() => {});

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nStack:', error.stack);
        
        if (browser) {
            console.log('\n⏸️  Keeping browser open for 60 seconds to debug...\n');
            await wait(60000);
            await browser.close();
        }
        
        process.exit(1);
    }
}

// Handle Ctrl+C
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Test stopped by user\n');
    process.exit(0);
});

if (require.main === module) {
    testStudyGroupsVisible().catch(error => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = testStudyGroupsVisible;

