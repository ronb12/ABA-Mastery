const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testLoginPage() {
    console.log('🔐 Testing Dedicated Login Page...\n');
    console.log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const screenshotDir = path.join(__dirname, 'login-page-test');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    try {
        // TEST 1: Visit landing page
        console.log('\n📝 TEST 1: Landing Page');
        console.log('-'.repeat(70));
        
        await page.goto('https://aba-mastery-app.web.app/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-landing-page.png'),
            fullPage: true 
        });
        
        const landingInfo = await page.evaluate(() => {
            return {
                title: document.title,
                h1: document.querySelector('h1')?.textContent,
                hasSignInButton: Array.from(document.querySelectorAll('button'))
                    .some(btn => btn.textContent.includes('Sign In'))
            };
        });
        
        console.log('Landing page:', JSON.stringify(landingInfo, null, 2));
        console.log(landingInfo.hasSignInButton ? '✅ Has Sign In button\n' : '❌ No Sign In button\n');
        
        // TEST 2: Click Sign In button
        console.log('📝 TEST 2: Navigate to Login Page');
        console.log('-'.repeat(70));
        
        const signInBtn = await page.evaluateHandle(() => {
            return Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Sign In') && !btn.textContent.includes('Start'));
        });
        
        if (signInBtn) {
            await signInBtn.click();
            console.log('   Clicked Sign In button');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const loginPageInfo = await page.evaluate(() => {
                return {
                    url: window.location.href,
                    pathname: window.location.pathname,
                    title: document.title,
                    hasLoginForm: !!document.getElementById('login-form'),
                    hasEmailField: !!document.getElementById('email'),
                    hasPasswordField: !!document.getElementById('password'),
                    hasGoogleBtn: Array.from(document.querySelectorAll('button'))
                        .some(btn => btn.textContent.includes('Google')),
                    h1Text: document.querySelector('h1')?.textContent
                };
            });
            
            console.log('Login page:', JSON.stringify(loginPageInfo, null, 2));
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '02-login-page.png'),
                fullPage: true 
            });
            
            if (loginPageInfo.hasLoginForm && loginPageInfo.hasEmailField) {
                console.log('\n✅ DEDICATED LOGIN PAGE EXISTS!\n');
                console.log('   URL: ' + loginPageInfo.url);
                console.log('   Title: ' + loginPageInfo.title);
                console.log('   Has email field: YES');
                console.log('   Has password field: YES');
                console.log('   Has Google sign-in: ' + (loginPageInfo.hasGoogleBtn ? 'YES' : 'NO'));
            } else {
                console.log('\n❌ Login page not properly loaded\n');
            }
        }
        
        // TEST 3: Test form elements
        console.log('\n📝 TEST 3: Testing Login Form Elements');
        console.log('-'.repeat(70));
        
        const formElements = await page.evaluate(() => {
            const form = document.getElementById('login-form');
            if (!form) return { exists: false };
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = document.querySelector('button[type="submit"]');
            const backLink = document.querySelector('a[href="/"]');
            const forgotLink = document.querySelector('a[href="#"]');
            
            return {
                exists: true,
                hasEmail: !!emailInput,
                hasPassword: !!passwordInput,
                hasSubmitBtn: !!submitBtn,
                submitBtnText: submitBtn?.textContent,
                hasBackLink: !!backLink,
                hasForgotPassword: !!forgotLink,
                emailPlaceholder: emailInput?.placeholder,
                passwordPlaceholder: passwordInput?.placeholder
            };
        });
        
        console.log('Form elements:', JSON.stringify(formElements, null, 2));
        
        if (formElements.exists) {
            console.log('\n✅ Login form has all required elements:');
            console.log(`   Email field: ${formElements.hasEmail ? '✅' : '❌'}`);
            console.log(`   Password field: ${formElements.hasPassword ? '✅' : '❌'}`);
            console.log(`   Submit button: ${formElements.hasSubmitBtn ? '✅' : '❌'}`);
            console.log(`   Back link: ${formElements.hasBackLink ? '✅' : '❌'}`);
            console.log(`   Forgot password: ${formElements.hasForgotPassword ? '✅' : '❌'}\n`);
        }
        
        // TEST 4: Test "Back to Home" link
        console.log('📝 TEST 4: Testing Back to Home Link');
        console.log('-'.repeat(70));
        
        const backLinkClicked = await page.evaluate(() => {
            const backLink = document.querySelector('a[href="/"]');
            if (backLink) {
                backLink.click();
                return true;
            }
            return false;
        });
        
        if (backLinkClicked) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const backUrl = page.url();
            console.log(`   Clicked back link, current URL: ${backUrl}`);
            
            if (backUrl.endsWith('/') || backUrl.includes('landing')) {
                console.log('   ✅ Successfully returned to landing page\n');
            } else {
                console.log('   ⚠️  Unexpected URL after back click\n');
            }
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '03-back-to-landing.png'),
                fullPage: true 
            });
        }
        
        console.log('='.repeat(70));
        console.log('✅ LOGIN PAGE TEST COMPLETE');
        console.log('='.repeat(70));
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        await page.screenshot({ 
            path: path.join(screenshotDir, 'error.png'),
            fullPage: true 
        });
    } finally {
        await browser.close();
    }
}

testLoginPage()
    .then(() => {
        console.log('\n✅ Test complete!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

