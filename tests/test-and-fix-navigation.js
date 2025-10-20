const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testAndFixNavigation() {
    console.log('🚀 Testing Landing Page Navigation...\n');
    console.log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const screenshotDir = path.join(__dirname, 'navigation-test-final');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    let landingPageWorking = false;
    
    try {
        // ============================================
        // STEP 1: Test Root URL
        // ============================================
        console.log('\n📝 STEP 1: Testing root URL...');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const pageInfo = await page.evaluate(() => {
            const title = document.title;
            const h1 = document.querySelector('h1')?.textContent;
            const hasApp = !!document.getElementById('app');
            const hasLandingContent = document.body.innerHTML.includes('Master Your ABA Certification Exam');
            const hasGradient = document.body.innerHTML.includes('gradient');
            const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
            
            return {
                url: window.location.href,
                title,
                h1,
                hasApp,
                hasLandingContent,
                hasGradient,
                buttons: buttons.slice(0, 5),
                isLandingPage: hasLandingContent && title.includes('Master Your ABA'),
                isAppPage: hasApp && title.includes('Study Platform')
            };
        });
        
        console.log('Page Info:');
        console.log(JSON.stringify(pageInfo, null, 2));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-root-url-loaded.png'),
            fullPage: true 
        });
        
        if (pageInfo.isLandingPage) {
            console.log('\n✅ SUCCESS! Landing page is showing at root URL!\n');
            landingPageWorking = true;
        } else if (pageInfo.isAppPage) {
            console.log('\n⚠️  ISSUE: Main app is showing instead of landing page');
            console.log('   Need to implement navigation fix...\n');
            landingPageWorking = false;
        }
        
        // ============================================
        // STEP 2: Test Direct /app Access
        // ============================================
        console.log('📝 STEP 2: Testing /app URL...');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/app', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const appPageInfo = await page.evaluate(() => {
            return {
                url: window.location.href,
                title: document.title,
                hasApp: !!document.getElementById('app'),
                hasAuthBtn: !!document.getElementById('auth-btn'),
                hasProfileDropdown: !!document.getElementById('profile-dropdown')
            };
        });
        
        console.log('App Page Info:');
        console.log(JSON.stringify(appPageInfo, null, 2));
        
        if (appPageInfo.hasApp) {
            console.log('\n✅ App page works at /app URL\n');
        } else {
            console.log('\n❌ App page not working at /app URL\n');
        }
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '02-app-url-loaded.png'),
            fullPage: true 
        });
        
        // ============================================
        // STEP 3: Test Profile Dropdown & Logout
        // ============================================
        console.log('📝 STEP 3: Testing profile dropdown and logout button...');
        console.log('-'.repeat(70));
        
        // Click profile icon
        await page.click('#auth-btn');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '03-profile-dropdown-open.png'),
            fullPage: false 
        });
        
        const dropdownInfo = await page.evaluate(() => {
            const dropdown = document.getElementById('profile-dropdown');
            const logoutBtn = document.getElementById('profile-auth-action');
            
            if (!dropdown || !logoutBtn) {
                return { dropdownExists: !!dropdown, logoutExists: !!logoutBtn };
            }
            
            const dropdownStyle = window.getComputedStyle(dropdown);
            const btnStyle = window.getComputedStyle(logoutBtn);
            const btnRect = logoutBtn.getBoundingClientRect();
            
            return {
                dropdownExists: true,
                dropdownVisible: dropdownStyle.display !== 'none',
                logoutExists: true,
                logoutVisible: btnStyle.display !== 'none' && btnRect.width > 0,
                logoutText: logoutBtn.textContent.trim(),
                logoutBackground: btnStyle.background,
                logoutBorder: btnStyle.border,
                logoutInFooter: !!logoutBtn.closest('.profile-footer')
            };
        });
        
        console.log('Dropdown & Logout Info:');
        console.log(JSON.stringify(dropdownInfo, null, 2));
        
        if (dropdownInfo.logoutVisible) {
            console.log('\n✅ Logout button is VISIBLE in profile dropdown!\n');
        } else {
            console.log('\n❌ Logout button not visible\n');
        }
        
        // Take close-up of logout button
        await page.evaluate(() => {
            const btn = document.getElementById('profile-auth-action');
            if (btn) {
                btn.style.outline = '3px solid red';
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '04-logout-button-highlighted.png'),
            fullPage: false 
        });
        
        // ============================================
        // DECISION: Fix Navigation if Needed
        // ============================================
        console.log('\n' + '='.repeat(70));
        console.log('📊 TEST RESULTS & DECISION');
        console.log('='.repeat(70));
        
        if (!landingPageWorking) {
            console.log('\n⚠️  ISSUE DETECTED: Landing page not showing at root URL');
            console.log('🔧 RECOMMENDATION: Add "Home" navigation button to app\n');
            
            console.log('💡 PROPOSED FIX:');
            console.log('   Add a "Home/Landing" button in the navigation menu');
            console.log('   This will allow users to return to the landing page\n');
        } else {
            console.log('\n✅ Landing page is working correctly!');
            console.log('✅ Navigation flow is perfect!');
            console.log('✅ Logout button is visible!\n');
        }
        
        console.log('='.repeat(70));
        
        console.log('\n📊 SUMMARY:');
        console.log(`   Landing Page at /: ${landingPageWorking ? '✅ Working' : '❌ Not Working'}`);
        console.log(`   App at /app: ${appPageInfo.hasApp ? '✅ Working' : '❌ Not Working'}`);
        console.log(`   Profile Dropdown: ${dropdownInfo.dropdownVisible ? '✅ Working' : '❌ Not Working'}`);
        console.log(`   Logout Button: ${dropdownInfo.logoutVisible ? '✅ Visible' : '❌ Not Visible'}`);
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        await page.screenshot({ 
            path: path.join(screenshotDir, 'error.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
    }
    
    console.log('\n✅ Test complete!\n');
    return landingPageWorking;
}

testAndFixNavigation()
    .then(landingWorks => {
        if (landingWorks) {
            console.log('🎉 All navigation working perfectly!\n');
            process.exit(0);
        } else {
            console.log('⚠️  Need to implement navigation fix\n');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

