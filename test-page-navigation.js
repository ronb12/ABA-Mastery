const puppeteer = require('puppeteer');

async function testPageNavigation() {
    console.log('🔍 Testing Page Navigation...\n');
    console.log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        // TEST 1: Visit root URL
        console.log('\n📝 TEST 1: Visiting root URL (/)');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const rootInfo = await page.evaluate(() => {
            return {
                url: window.location.href,
                pathname: window.location.pathname,
                title: document.title,
                hasH1: !!document.querySelector('h1'),
                h1Text: document.querySelector('h1')?.textContent,
                bodyText: document.body.textContent.substring(0, 200),
                hasApp: !!document.getElementById('app'),
                hasLandingContent: document.body.innerHTML.includes('Master Your ABA'),
                hasStartButton: Array.from(document.querySelectorAll('button'))
                    .some(btn => btn.textContent.includes('Start')),
                allButtons: Array.from(document.querySelectorAll('button'))
                    .map(btn => btn.textContent.trim()).slice(0, 5)
            };
        });
        
        console.log('Root URL Info:');
        console.log(JSON.stringify(rootInfo, null, 2));
        
        if (rootInfo.hasLandingContent) {
            console.log('\n✅ Landing page is showing!');
        } else if (rootInfo.hasApp) {
            console.log('\n⚠️  App is showing instead of landing page!');
            console.log('   This means Firebase routing might not be working correctly.');
        } else {
            console.log('\n❌ Unknown page is showing!');
        }
        
        await page.screenshot({ path: 'root-url-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved: root-url-screenshot.png');
        
        // TEST 2: Visit /app directly
        console.log('\n📝 TEST 2: Visiting /app URL');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/app', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const appInfo = await page.evaluate(() => {
            return {
                url: window.location.href,
                pathname: window.location.pathname,
                title: document.title,
                hasApp: !!document.getElementById('app'),
                hasHeader: !!document.querySelector('.app-header'),
                hasAuthBtn: !!document.getElementById('auth-btn')
            };
        });
        
        console.log('App URL Info:');
        console.log(JSON.stringify(appInfo, null, 2));
        
        if (appInfo.hasApp) {
            console.log('\n✅ App page is working!');
        } else {
            console.log('\n❌ App page not loading correctly!');
        }
        
        await page.screenshot({ path: 'app-url-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved: app-url-screenshot.png');
        
        // TEST 3: Check landing.html directly
        console.log('\n📝 TEST 3: Visiting /landing.html directly');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/landing.html', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const landingDirectInfo = await page.evaluate(() => {
            return {
                url: window.location.href,
                title: document.title,
                hasLandingContent: document.body.innerHTML.includes('Master Your ABA'),
                h1Text: document.querySelector('h1')?.textContent
            };
        });
        
        console.log('Landing.html Direct Access:');
        console.log(JSON.stringify(landingDirectInfo, null, 2));
        
        if (landingDirectInfo.hasLandingContent) {
            console.log('\n✅ Landing.html exists and loads correctly!');
        } else {
            console.log('\n❌ Landing.html has issues!');
        }
        
        await page.screenshot({ path: 'landing-direct-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved: landing-direct-screenshot.png');
        
        // SUMMARY
        console.log('\n' + '='.repeat(70));
        console.log('📊 NAVIGATION TEST SUMMARY');
        console.log('='.repeat(70));
        
        console.log('\n1. Root URL (/)');
        if (rootInfo.hasLandingContent) {
            console.log('   ✅ Shows landing page (CORRECT)');
        } else if (rootInfo.hasApp) {
            console.log('   ⚠️  Shows app instead (ROUTING ISSUE)');
        } else {
            console.log('   ❌ Unknown content');
        }
        
        console.log('\n2. /app URL');
        console.log(`   ${appInfo.hasApp ? '✅' : '❌'} Shows app (${appInfo.hasApp ? 'CORRECT' : 'ISSUE'})`);
        
        console.log('\n3. /landing.html Direct');
        console.log(`   ${landingDirectInfo.hasLandingContent ? '✅' : '❌'} Landing page loads (${landingDirectInfo.hasLandingContent ? 'CORRECT' : 'ISSUE'})`);
        
        console.log('\n' + '='.repeat(70));
        
        if (!rootInfo.hasLandingContent) {
            console.log('\n🔧 RECOMMENDED FIX:');
            console.log('The root URL is not showing the landing page.');
            console.log('This is likely a Firebase routing configuration issue.');
            console.log('The firebase.json rewrites might not be working correctly.');
        } else {
            console.log('\n✅ Everything is working correctly!');
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testPageNavigation()
    .then(() => {
        console.log('\n✅ Navigation test complete!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

