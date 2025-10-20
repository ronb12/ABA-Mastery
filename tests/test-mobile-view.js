/**
 * Mobile View Test for ABA Mastery App
 * Tests navigation and functionality on mobile devices
 */

const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://aba-mastery-app.web.app';

// Mobile device configurations to test
const DEVICES = [
    {
        name: 'iPhone 12 Pro',
        viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'iPhone SE',
        viewport: { width: 375, height: 667, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'Samsung Galaxy S21',
        viewport: { width: 360, height: 800, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
    },
    {
        name: 'iPad Pro',
        viewport: { width: 1024, height: 1366, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    }
];

// Color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(70));
    log(title, 'cyan');
    console.log('='.repeat(70));
}

function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${status}: ${name}`, color);
    if (details) {
        log(`   ${details}`, 'yellow');
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMobileDevice(browser, device) {
    logSection(`TESTING: ${device.name}`);
    log(`📱 Viewport: ${device.viewport.width}x${device.viewport.height}`, 'blue');
    
    const page = await browser.newPage();
    const results = {
        device: device.name,
        passed: [],
        failed: []
    };
    
    try {
        // Set viewport and user agent
        await page.setViewport(device.viewport);
        await page.setUserAgent(device.userAgent);
        
        // Navigate to landing page
        log('→ Loading landing page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        await delay(2000);
        
        // Check if page loaded
        const title = await page.title();
        logTest('Landing page loads', title.includes('ABA Mastery'));
        if (title.includes('ABA Mastery')) results.passed.push('Landing page');
        else results.failed.push('Landing page');
        
        // Take screenshot of landing page
        await page.screenshot({ 
            path: `tests/screenshots/mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}-landing.png`,
            fullPage: false 
        });
        log('   📸 Landing page screenshot saved', 'blue');
        
        // Click guest mode
        log('→ Starting guest mode...');
        const guestClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => btn.textContent.includes('Guest'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        logTest('Guest button clickable', guestClicked);
        if (guestClicked) results.passed.push('Guest button');
        else results.failed.push('Guest button');
        
        if (guestClicked) {
            await delay(3000);
            
            const url = page.url();
            const onAppPage = url.includes('app.html');
            logTest('Navigated to app', onAppPage);
            if (onAppPage) results.passed.push('App navigation');
            else results.failed.push('App navigation');
            
            if (onAppPage) {
                // Take screenshot of app page
                await page.screenshot({ 
                    path: `tests/screenshots/mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}-app.png`,
                    fullPage: false 
                });
                log('   📸 App page screenshot saved', 'blue');
                
                // Check for mobile navigation
                log('→ Testing mobile navigation...');
                
                // Check if bottom nav exists (mobile pattern)
                const hasBottomNav = await page.evaluate(() => {
                    const nav = document.querySelector('.bottom-nav, .mobile-nav, nav');
                    return !!nav;
                });
                
                logTest('Mobile navigation exists', hasBottomNav);
                if (hasBottomNav) results.passed.push('Mobile nav exists');
                else results.failed.push('Mobile nav exists');
                
                // Check if navigation buttons are visible and accessible
                const navButtons = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button, .nav-item, .tab-item'));
                    return buttons.filter(btn => {
                        const style = window.getComputedStyle(btn);
                        const rect = btn.getBoundingClientRect();
                        return style.display !== 'none' && 
                               style.visibility !== 'hidden' && 
                               rect.width > 0 && 
                               rect.height > 0;
                    }).map(btn => ({
                        text: btn.textContent.trim(),
                        width: btn.getBoundingClientRect().width,
                        height: btn.getBoundingClientRect().height
                    }));
                });
                
                log(`   Found ${navButtons.length} visible navigation elements`, 'blue');
                logTest('Navigation buttons visible', navButtons.length > 0);
                if (navButtons.length > 0) results.passed.push(`${navButtons.length} nav buttons`);
                else results.failed.push('No nav buttons visible');
                
                // Test each main navigation item
                const navItems = ['Study', 'Practice', 'Flashcards', 'Scenarios', 'Progress'];
                
                for (const navItem of navItems) {
                    log(`→ Testing "${navItem}" tab...`);
                    
                    // Try to find and tap the navigation item
                    const tapped = await page.evaluate((item) => {
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const button = buttons.find(btn => {
                            const text = btn.textContent;
                            return text.includes(item);
                        });
                        if (button) {
                            button.click();
                            return true;
                        }
                        return false;
                    }, navItem);
                    
                    if (tapped) {
                        await delay(1500);
                        
                        // Check if content is visible
                        const contentVisible = await page.evaluate((item) => {
                            // Check if view is displayed
                            const views = Array.from(document.querySelectorAll('[id*="view"], section.view'));
                            const activeView = views.find(view => {
                                const style = window.getComputedStyle(view);
                                return style.display !== 'none';
                            });
                            
                            if (!activeView) return false;
                            
                            // Check if content loads
                            const text = activeView.textContent;
                            return text.length > 50; // Has substantial content
                        }, navItem);
                        
                        logTest(`${navItem} tab accessible`, contentVisible);
                        if (contentVisible) results.passed.push(`${navItem} tab`);
                        else results.failed.push(`${navItem} tab not accessible`);
                        
                        // Take screenshot of this view
                        await page.screenshot({ 
                            path: `tests/screenshots/mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}-${navItem.toLowerCase()}.png`,
                            fullPage: false 
                        });
                        log(`   📸 ${navItem} view screenshot saved`, 'blue');
                    } else {
                        logTest(`${navItem} tab accessible`, false, 'Button not found');
                        results.failed.push(`${navItem} button not found`);
                    }
                }
                
                // Test touch interactions
                log('→ Testing touch interactions...');
                
                // Try to tap a card or interactive element
                const canTapCards = await page.evaluate(() => {
                    const cards = Array.from(document.querySelectorAll('.card, .stat-card, .category-card, button'));
                    if (cards.length > 0) {
                        const card = cards[0];
                        const rect = card.getBoundingClientRect();
                        return rect.width >= 44 && rect.height >= 44; // Minimum touch target size
                    }
                    return false;
                });
                
                logTest('Touch targets adequate size', canTapCards, canTapCards ? '≥ 44x44px' : '< 44x44px');
                if (canTapCards) results.passed.push('Touch targets');
                else results.failed.push('Touch targets too small');
                
                // Check for horizontal scrolling issues
                const hasHorizontalScroll = await page.evaluate(() => {
                    return document.body.scrollWidth > window.innerWidth;
                });
                
                logTest('No horizontal scroll', !hasHorizontalScroll);
                if (!hasHorizontalScroll) results.passed.push('No horizontal scroll');
                else results.failed.push('Horizontal scroll detected');
                
                // Check viewport meta tag
                const hasViewportMeta = await page.evaluate(() => {
                    const meta = document.querySelector('meta[name="viewport"]');
                    return !!meta;
                });
                
                logTest('Viewport meta tag present', hasViewportMeta);
                if (hasViewportMeta) results.passed.push('Viewport meta');
                else results.failed.push('Viewport meta missing');
                
                // Test responsive images
                const imagesResponsive = await page.evaluate(() => {
                    const images = Array.from(document.querySelectorAll('img'));
                    if (images.length === 0) return true; // No images to check
                    
                    return images.every(img => {
                        const style = window.getComputedStyle(img);
                        return style.maxWidth === '100%' || img.width <= window.innerWidth;
                    });
                });
                
                logTest('Images responsive', imagesResponsive);
                if (imagesResponsive) results.passed.push('Responsive images');
                else results.failed.push('Images not responsive');
            }
        }
        
    } catch (error) {
        logTest(`${device.name} test`, false, error.message);
        results.failed.push(`Error: ${error.message}`);
    } finally {
        await page.close();
    }
    
    return results;
}

async function runAllTests() {
    console.log('\n' + '█'.repeat(70));
    log('ABA MASTERY - MOBILE VIEW TEST', 'cyan');
    log('Testing navigation and responsiveness on mobile devices', 'blue');
    console.log('█'.repeat(70) + '\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const allResults = [];
    const summary = {
        totalPassed: 0,
        totalFailed: 0
    };
    
    try {
        // Test each device
        for (const device of DEVICES) {
            const results = await testMobileDevice(browser, device);
            allResults.push(results);
            
            summary.totalPassed += results.passed.length;
            summary.totalFailed += results.failed.length;
            
            // Device summary
            log(`\n📊 ${device.name} Summary:`, 'magenta');
            log(`   ✅ Passed: ${results.passed.length}`, 'green');
            log(`   ❌ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
        }
        
    } catch (error) {
        log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
        summary.totalFailed++;
    } finally {
        await browser.close();
    }
    
    // Final summary
    logSection('FINAL SUMMARY - ALL DEVICES');
    
    log(`\n📱 Devices Tested: ${DEVICES.length}`, 'blue');
    log(`✅ Total Passed: ${summary.totalPassed}`, 'green');
    log(`❌ Total Failed: ${summary.totalFailed}`, 'red');
    log(`📊 Total Tests: ${summary.totalPassed + summary.totalFailed}`, 'blue');
    
    const successRate = ((summary.totalPassed / (summary.totalPassed + summary.totalFailed)) * 100).toFixed(1);
    log(`📈 Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
    
    // Per-device breakdown
    log('\n📊 Per-Device Results:', 'cyan');
    allResults.forEach(result => {
        const deviceSuccess = result.passed.length;
        const deviceTotal = result.passed.length + result.failed.length;
        const deviceRate = deviceTotal > 0 ? ((deviceSuccess / deviceTotal) * 100).toFixed(1) : 0;
        
        log(`\n${result.device}:`, 'blue');
        log(`   ✅ ${result.passed.length}/${deviceTotal} passed (${deviceRate}%)`, deviceRate >= 80 ? 'green' : 'yellow');
        
        if (result.failed.length > 0) {
            log(`   ❌ Failed tests:`, 'red');
            result.failed.forEach(fail => {
                log(`      • ${fail}`, 'yellow');
            });
        }
    });
    
    console.log('\n' + '█'.repeat(70));
    log(summary.totalFailed === 0 ? '✅ ALL MOBILE TESTS PASSED!' : `⚠️  ${summary.totalFailed} TEST(S) FAILED`, 
        summary.totalFailed === 0 ? 'green' : 'yellow');
    console.log('█'.repeat(70) + '\n');
    
    log('📸 Screenshots saved in tests/screenshots/', 'blue');
    log('   View them to see how the app looks on each device', 'blue');
    
    process.exit(summary.totalFailed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
    log(`\n❌ TEST RUNNER ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});

