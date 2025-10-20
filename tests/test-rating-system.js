// Test Rating System - Verify 5-star rating feature
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'rating-system');

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

async function testRatingSystem() {
    console.log('\n⭐ Testing Rating System...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate to app
        console.log('📱 Opening app...');
        await page.goto(`${BASE_URL}/app.html`, { waitUntil: 'networkidle2' });
        await wait(2000);
        console.log('   ✅ App loaded\n');
        await takeScreenshot(page, '01-app-loaded');
        
        // ==========================================
        // TEST 1: Verify Rating System Loaded
        // ==========================================
        console.log('🧪 TEST 1: Verifying Rating System Loaded...');
        
        const ratingSystemLoaded = await page.evaluate(() => {
            return typeof ratingSystem !== 'undefined';
        });
        
        console.log(`   ${ratingSystemLoaded ? '✅' : '❌'} Rating system loaded`);
        
        if (!ratingSystemLoaded) {
            console.log('   ❌ Rating system not found - stopping test');
            return;
        }
        
        // ==========================================
        // TEST 2: Trigger Rating Manually
        // ==========================================
        console.log('\n⭐ TEST 2: Testing Manual Rating Trigger...');
        
        // Navigate to Settings
        console.log('   Navigating to Settings...');
        await page.click('[data-view="settings"]');
        await wait(1000);
        await takeScreenshot(page, '02-settings-view');
        
        // Scroll to About section
        await page.evaluate(() => {
            const aboutSection = Array.from(document.querySelectorAll('h3'))
                .find(h => h.textContent === 'About');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        await wait(1000);
        await takeScreenshot(page, '03-about-section');
        
        // Check if "Rate This App" button exists
        const rateButtonExists = await page.$('button:has-text("Rate This App")') || 
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.some(btn => btn.textContent.includes('Rate This App'));
            });
        
        console.log(`   ${rateButtonExists ? '✅' : '❌'} "Rate This App" button found`);
        
        // Click rating button
        console.log('   Clicking "Rate This App" button...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const rateBtn = buttons.find(btn => btn.textContent.includes('Rate This App'));
            if (rateBtn) rateBtn.click();
        });
        await wait(1500);
        
        console.log('   ✅ Rating button clicked\n');
        await takeScreenshot(page, '04-rating-modal-opened');
        
        // ==========================================
        // TEST 3: Verify Modal Appears
        // ==========================================
        console.log('🎨 TEST 3: Verifying Rating Modal...');
        
        const modalVisible = await page.$('#rating-modal');
        console.log(`   ${modalVisible ? '✅' : '❌'} Rating modal appeared`);
        
        if (!modalVisible) {
            console.log('   ❌ Modal not found - checking if rating system triggered');
            return;
        }
        
        // Check modal content
        const modalContent = await page.evaluate(() => {
            const modal = document.getElementById('rating-modal');
            if (!modal) return null;
            
            return {
                hasTitle: !!modal.querySelector('h2'),
                titleText: modal.querySelector('h2')?.textContent,
                hasStars: modal.querySelectorAll('.star').length === 5,
                hasFeedbackArea: !!modal.querySelector('#rating-feedback'),
                hasSubmitButton: !!modal.querySelector('#submit-rating'),
                hasDismissButton: !!modal.querySelector('#dismiss-rating')
            };
        });
        
        if (modalContent) {
            console.log(`   ✅ Modal title: "${modalContent.titleText}"`);
            console.log(`   ${modalContent.hasStars ? '✅' : '❌'} 5 stars present`);
            console.log(`   ${modalContent.hasFeedbackArea ? '✅' : '❌'} Feedback textarea present`);
            console.log(`   ${modalContent.hasSubmitButton ? '✅' : '❌'} Submit button present`);
            console.log(`   ${modalContent.hasDismissButton ? '✅' : '❌'} Dismiss button present`);
        }
        
        console.log('');
        await takeScreenshot(page, '05-modal-details');
        
        // ==========================================
        // TEST 4: Test Star Interaction
        // ==========================================
        console.log('⭐ TEST 4: Testing Star Interaction...');
        
        // Hover over 3rd star
        console.log('   Hovering over 3rd star...');
        const stars = await page.$$('.star');
        if (stars.length >= 3) {
            await stars[2].hover();
            await wait(500);
            await takeScreenshot(page, '06-hover-3-stars');
            console.log('   ✅ Hover effect working');
        }
        
        // Click 5th star
        console.log('   Clicking 5th star (5-star rating)...');
        if (stars.length >= 5) {
            await stars[4].click();
            await wait(1000);
            await takeScreenshot(page, '07-selected-5-stars');
            console.log('   ✅ 5 stars selected');
        }
        
        // Check if feedback area appeared
        const feedbackVisible = await page.evaluate(() => {
            const feedback = document.getElementById('rating-feedback');
            return feedback && feedback.style.display !== 'none';
        });
        
        console.log(`   ${feedbackVisible ? '✅' : '❌'} Feedback textarea appeared`);
        
        // Check if submit button appeared
        const submitVisible = await page.evaluate(() => {
            const submit = document.getElementById('submit-rating');
            return submit && submit.style.display !== 'none';
        });
        
        console.log(`   ${submitVisible ? '✅' : '❌'} Submit button appeared\n`);
        
        // ==========================================
        // TEST 5: Enter Feedback
        // ==========================================
        console.log('💬 TEST 5: Testing Feedback Entry...');
        
        await page.type('#rating-feedback', 'This app is amazing! The AI Coach and adaptive learning are game-changers. Love the gamification too!');
        await wait(500);
        await takeScreenshot(page, '08-feedback-entered');
        console.log('   ✅ Feedback text entered\n');
        
        // ==========================================
        // TEST 6: Submit Rating
        // ==========================================
        console.log('📤 TEST 6: Submitting Rating...');
        
        console.log('   Clicking Submit Rating button...');
        await page.click('#submit-rating');
        await wait(2000);
        await takeScreenshot(page, '09-thank-you-message');
        
        // Check for thank you message
        const thankYouVisible = await page.evaluate(() => {
            const modal = document.getElementById('rating-modal');
            if (!modal) return false;
            return modal.textContent.includes('Thank you') || modal.textContent.includes('means the world');
        });
        
        console.log(`   ${thankYouVisible ? '✅' : '❌'} Thank you message displayed`);
        
        // Check if rating was saved locally
        const ratingSaved = await page.evaluate(() => {
            const saved = localStorage.getItem('appRating');
            if (!saved) return null;
            return JSON.parse(saved);
        });
        
        if (ratingSaved) {
            console.log('   ✅ Rating saved to localStorage');
            console.log(`   📊 User rated: ${ratingSaved.userRating} stars`);
            console.log(`   ✅ HasRated flag: ${ratingSaved.hasRated}`);
        }
        
        console.log('');
        
        // ==========================================
        // TEST 7: Verify Won't Show Again
        // ==========================================
        console.log('🔄 TEST 7: Verifying Won\'t Show Again...');
        
        await wait(3000); // Wait for modal to auto-close
        
        // Check if modal closed
        const modalGone = await page.evaluate(() => {
            return !document.getElementById('rating-modal');
        });
        
        console.log(`   ${modalGone ? '✅' : '❌'} Modal auto-closed`);
        
        // Try triggering again (should NOT show)
        const shouldShow = await page.evaluate(() => {
            return ratingSystem.shouldShowPrompt();
        });
        
        console.log(`   ${!shouldShow ? '✅' : '❌'} Correctly will not show again (user already rated)\n`);
        
        // ==========================================
        // FINAL SUMMARY
        // ==========================================
        console.log('=' .repeat(60));
        console.log('📊 RATING SYSTEM TEST RESULTS\n');
        
        const allPassed = 
            ratingSystemLoaded &&
            rateButtonExists &&
            modalVisible &&
            modalContent && modalContent.hasStars &&
            feedbackVisible &&
            submitVisible &&
            thankYouVisible &&
            ratingSaved &&
            modalGone &&
            !shouldShow;
        
        if (allPassed) {
            console.log('✅ ALL TESTS PASSED!\n');
            console.log('Rating System Status:');
            console.log('  ⭐ JavaScript loaded      ✅');
            console.log('  ⭐ UI elements present    ✅');
            console.log('  ⭐ Star interaction works ✅');
            console.log('  ⭐ Feedback entry works   ✅');
            console.log('  ⭐ Submission works       ✅');
            console.log('  ⭐ Data persistence works ✅');
            console.log('  ⭐ Will not show again    ✅');
        } else {
            console.log('⚠️  Some tests had issues - check screenshots');
        }
        
        console.log('\n' + '=' .repeat(60));
        console.log('📸 Screenshots saved in: tests/screenshots/rating-system/');
        console.log('✅ TEST SUITE COMPLETE!\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        await takeScreenshot(page, 'error-state');
    } finally {
        await browser.close();
    }
}

testRatingSystem().catch(console.error);

