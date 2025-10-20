// Test Personalization System - Puppeteer Test
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://aba-mastery-app.web.app';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'personalization');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name) {
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   📸 Screenshot: ${name}.png`);
}

async function testPersonalization() {
    console.log('\n👤 Testing Personalization System...\n');
    console.log('=' .repeat(60));
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });
    
    const page = await browser.newPage();
    
    try {
        // ==========================================
        // TEST 1: Load Test Page
        // ==========================================
        console.log('\n📱 TEST 1: Loading Personalization Test Page...');
        
        await page.goto(`${BASE_URL}/test-personalization.html`, { 
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        await wait(2000);
        
        console.log('   ✅ Test page loaded');
        await takeScreenshot(page, '01-test-page-loaded');
        
        // ==========================================
        // TEST 2: Login as Test User
        // ==========================================
        console.log('\n🔐 TEST 2: Logging in as Test User...');
        
        // Click login button
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const loginBtn = buttons.find(btn => btn.textContent.includes('Login as test123@aba.com'));
            if (loginBtn) loginBtn.click();
        });
        console.log('   🔄 Login button clicked');
        await wait(3000);
        
        // Check if logged in
        const loginStatus = await page.evaluate(() => {
            const statusDiv = document.getElementById('login-status');
            return statusDiv ? statusDiv.textContent : '';
        });
        
        console.log(`   ${loginStatus.includes('Successfully logged in') ? '✅' : '❌'} Login status: ${loginStatus.substring(0, 50)}...`);
        await takeScreenshot(page, '02-logged-in');
        
        // ==========================================
        // TEST 3: Check Current Name
        // ==========================================
        console.log('\n👤 TEST 3: Checking Current Name...');
        
        await wait(1000);
        
        const nameStatus = await page.evaluate(() => {
            const statusDiv = document.getElementById('name-status');
            return statusDiv ? statusDiv.textContent : '';
        });
        
        console.log(`   📝 Name status: ${nameStatus.substring(0, 100)}...`);
        
        const hasName = nameStatus.includes('Current Name:');
        console.log(`   ${hasName ? '✅' : '⚠️'} User ${hasName ? 'has' : 'does not have'} a name set`);
        
        await takeScreenshot(page, '03-name-check');
        
        // ==========================================
        // TEST 4: Update Name
        // ==========================================
        console.log('\n✏️ TEST 4: Updating User Name...');
        
        const testName = 'Sarah Johnson';
        console.log(`   Setting name to: "${testName}"`);
        
        // Enter name
        await page.type('#new-name', testName);
        console.log('   ✅ Name typed');
        await wait(500);
        
        // Click update button
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const updateBtn = buttons.find(btn => btn.textContent.includes('Update My Name'));
            if (updateBtn) updateBtn.click();
        });
        console.log('   🔄 Update button clicked');
        await wait(3000);
        
        // Check update status
        const updateStatus = await page.evaluate(() => {
            const statusDiv = document.getElementById('update-status');
            return statusDiv ? statusDiv.textContent : '';
        });
        
        console.log(`   ${updateStatus.includes('Name updated') ? '✅' : '❌'} Update status: ${updateStatus.substring(0, 80)}...`);
        await takeScreenshot(page, '04-name-updated');
        
        // ==========================================
        // TEST 5: Test Time-Based Greeting
        // ==========================================
        console.log('\n👋 TEST 5: Testing Time-Based Greeting...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Time-Based Greeting'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const greetingMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Greeting: "${greetingMessage}"`);
        console.log(`   ${greetingMessage.includes('Sarah') ? '✅' : '❌'} Greeting includes name`);
        await takeScreenshot(page, '05-greeting-test');
        
        // ==========================================
        // TEST 6: Test Quiz Message
        // ==========================================
        console.log('\n📝 TEST 6: Testing Quiz Message...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Quiz Message'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const quizMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Quiz message: "${quizMessage}"`);
        console.log(`   ${quizMessage.includes('Sarah') ? '✅' : '❌'} Quiz message includes name`);
        await takeScreenshot(page, '06-quiz-message');
        
        // ==========================================
        // TEST 7: Test Exam Pass Message
        // ==========================================
        console.log('\n🎓 TEST 7: Testing Exam Pass Message...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Exam Message (Pass)'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const examPassMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Exam pass message: "${examPassMessage}"`);
        console.log(`   ${examPassMessage.includes('Sarah') ? '✅' : '❌'} Exam pass includes name`);
        await takeScreenshot(page, '07-exam-pass');
        
        // ==========================================
        // TEST 8: Test Achievement Message
        // ==========================================
        console.log('\n🏅 TEST 8: Testing Achievement Message...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Achievement'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const achievementMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Achievement: "${achievementMessage}"`);
        console.log(`   ${achievementMessage.includes('Sarah') ? '✅' : '❌'} Achievement includes name`);
        await takeScreenshot(page, '08-achievement');
        
        // ==========================================
        // TEST 9: Test Streak Message
        // ==========================================
        console.log('\n🔥 TEST 9: Testing Streak Message...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Streak'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const streakMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Streak: "${streakMessage}"`);
        console.log(`   ${streakMessage.includes('Sarah') ? '✅' : '❌'} Streak includes name`);
        await takeScreenshot(page, '09-streak');
        
        // ==========================================
        // TEST 10: Test Encouragement Message
        // ==========================================
        console.log('\n💪 TEST 10: Testing Encouragement Message...');
        
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Test Encouragement'));
            if (btn) btn.click();
        });
        await wait(1000);
        
        const encouragementMessage = await page.evaluate(() => {
            const display = document.getElementById('message-display');
            return display ? display.textContent : '';
        });
        
        console.log(`   📝 Encouragement: "${encouragementMessage}"`);
        console.log(`   ${encouragementMessage.includes('Sarah') ? '✅' : '❌'} Encouragement includes name`);
        await takeScreenshot(page, '10-encouragement');
        
        // ==========================================
        // TEST 11: Verify Personalization Object
        // ==========================================
        console.log('\n🔍 TEST 11: Verifying Personalization Object...');
        
        const personalizationData = await page.evaluate(() => {
            if (typeof personalization === 'undefined') {
                return { error: 'Personalization object not found' };
            }
            
            return {
                hasName: personalization.hasName(),
                firstName: personalization.getFirstName(),
                fullName: personalization.getFullName(),
                email: personalization.userEmail
            };
        });
        
        console.log('   📊 Personalization Data:');
        console.log(`      Has Name: ${personalizationData.hasName ? '✅' : '❌'}`);
        console.log(`      First Name: "${personalizationData.firstName}"`);
        console.log(`      Full Name: "${personalizationData.fullName}"`);
        console.log(`      Email: "${personalizationData.email}"`);
        
        // ==========================================
        // TEST 12: Verify in Main App
        // ==========================================
        console.log('\n🏠 TEST 12: Verifying in Main App...');
        
        await page.goto(`${BASE_URL}/app`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        await wait(3000);
        
        console.log('   ✅ Main app loaded');
        await takeScreenshot(page, '11-main-app');
        
        // Check home greeting
        const homeGreeting = await page.evaluate(() => {
            const greeting = document.getElementById('home-greeting');
            return greeting ? greeting.textContent : '';
        });
        
        console.log(`   📝 Home greeting: "${homeGreeting}"`);
        console.log(`   ${homeGreeting.includes('Sarah') ? '✅' : '❌'} Home greeting includes name`);
        
        await takeScreenshot(page, '12-home-greeting');
        
        // ==========================================
        // FINAL SUMMARY
        // ==========================================
        console.log('\n' + '=' .repeat(60));
        console.log('📊 PERSONALIZATION TEST RESULTS\n');
        
        const allTests = {
            'Test page loads': true,
            'User can login': loginStatus.includes('Successfully logged in'),
            'Name check works': nameStatus.length > 0,
            'Name can be updated': updateStatus.includes('Name updated'),
            'Greeting personalized': greetingMessage.includes('Sarah'),
            'Quiz message personalized': quizMessage.includes('Sarah'),
            'Exam message personalized': examPassMessage.includes('Sarah'),
            'Achievement personalized': achievementMessage.includes('Sarah'),
            'Streak personalized': streakMessage.includes('Sarah'),
            'Encouragement personalized': encouragementMessage.includes('Sarah'),
            'Personalization object works': personalizationData.hasName,
            'Main app greeting personalized': homeGreeting.includes('Sarah')
        };
        
        const passedTests = Object.values(allTests).filter(v => v).length;
        const totalTests = Object.keys(allTests).length;
        
        console.log('Test Results:');
        Object.entries(allTests).forEach(([test, passed]) => {
            console.log(`  ${passed ? '✅' : '❌'} ${test}`);
        });
        
        console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
        
        if (passedTests === totalTests) {
            console.log('\n🎉 ALL TESTS PASSED! Personalization system is working perfectly!\n');
        } else {
            console.log(`\n⚠️  ${totalTests - passedTests} test(s) failed - check screenshots for details\n`);
        }
        
        console.log('=' .repeat(60));
        console.log('📸 Screenshots saved in: tests/screenshots/personalization/');
        console.log('✅ TEST SUITE COMPLETE!\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        console.error(error.stack);
        await takeScreenshot(page, 'error-state');
    } finally {
        await browser.close();
    }
}

testPersonalization().catch(console.error);

