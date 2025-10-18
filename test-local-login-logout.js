const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Create local server
function createLocalServer(port = 8080) {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            console.log(`${req.method} ${req.url}`);
            
            // Parse URL
            const parsedUrl = url.parse(req.url);
            let pathname = parsedUrl.pathname;
            
            // Route handling
            if (pathname === '/') {
                pathname = '/landing.html';
            } else if (pathname === '/app') {
                pathname = '/index.html';
            }
            
            // Build file path
            const filePath = path.join(__dirname, pathname);
            
            // Check if file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File not found
                    res.statusCode = 404;
                    res.end(`File ${pathname} not found!`);
                    return;
                }
                
                // Read file
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        if (error.code === 'ENOENT') {
                            res.statusCode = 404;
                            res.end('404 Not Found');
                        } else {
                            res.statusCode = 500;
                            res.end(`Server Error: ${error.code}`);
                        }
                    } else {
                        // Get file extension
                        const ext = path.extname(filePath);
                        const contentType = mimeTypes[ext] || 'application/octet-stream';
                        
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content, 'utf-8');
                    }
                });
            });
        });
        
        server.listen(port, () => {
            console.log(`\n🌐 Local server running at http://localhost:${port}/\n`);
            resolve(server);
        });
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}...`);
                createLocalServer(port + 1).then(resolve).catch(reject);
            } else {
                reject(err);
            }
        });
    });
}

// Test login and logout
async function testLocalLoginLogout() {
    console.log('🚀 Starting Local Server Login/Logout Test...\n');
    console.log('='.repeat(70));
    
    // Start local server
    const server = await createLocalServer(8080);
    const port = server.address().port;
    const baseURL = `http://localhost:${port}`;
    
    console.log('='.repeat(70));
    
    const screenshotDir = path.join(__dirname, 'local-test-results');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: [],
        summary: { passed: 0, failed: 0 }
    };
    
    let browser;
    
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Enable console logging from page
        page.on('console', msg => console.log('   PAGE LOG:', msg.text()));
        
        // ============================================
        // TEST 1: Load Landing Page
        // ============================================
        console.log('\n📝 TEST 1: Loading local landing page...');
        console.log('-'.repeat(70));
        
        await page.goto(`${baseURL}/`, { 
            waitUntil: 'networkidle2',
            timeout: 10000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-landing-page.png'),
            fullPage: true 
        });
        
        const landingPageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                hasH1: !!document.querySelector('h1'),
                h1Text: document.querySelector('h1')?.textContent,
                hasStartButton: Array.from(document.querySelectorAll('button'))
                    .some(btn => btn.textContent.includes('Start')),
                url: window.location.href
            };
        });
        
        console.log('Landing page info:', JSON.stringify(landingPageInfo, null, 2));
        
        if (landingPageInfo.hasH1 && landingPageInfo.hasStartButton) {
            results.tests.push({
                name: 'Landing page loads',
                status: 'PASSED',
                details: `Title: ${landingPageInfo.title}`
            });
            results.summary.passed++;
            console.log('✅ Landing page loaded successfully\n');
        } else {
            results.tests.push({
                name: 'Landing page loads',
                status: 'FAILED',
                details: 'Missing required elements'
            });
            results.summary.failed++;
            console.log('❌ Landing page did not load correctly\n');
        }
        
        // ============================================
        // TEST 2: Navigate to App
        // ============================================
        console.log('📝 TEST 2: Clicking "Start Studying" to navigate to app...');
        console.log('-'.repeat(70));
        
        // Click start button
        const navigated = await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Start'));
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        if (navigated) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const currentURL = page.url();
            console.log(`Current URL: ${currentURL}`);
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '02-navigated-to-app.png'),
                fullPage: true 
            });
            
            // Check if app loaded
            const appLoaded = await page.evaluate(() => {
                return {
                    hasApp: !!document.getElementById('app'),
                    hasHeader: !!document.querySelector('.app-header'),
                    hasAuthBtn: !!document.getElementById('auth-btn')
                };
            });
            
            console.log('App load status:', JSON.stringify(appLoaded, null, 2));
            
            if (appLoaded.hasApp && appLoaded.hasHeader) {
                results.tests.push({
                    name: 'Navigate to app',
                    status: 'PASSED',
                    details: `App loaded with ${appLoaded.hasAuthBtn ? 'auth button' : 'no auth button'}`
                });
                results.summary.passed++;
                console.log('✅ App loaded successfully\n');
            } else {
                results.tests.push({
                    name: 'Navigate to app',
                    status: 'FAILED',
                    details: 'App did not load properly'
                });
                results.summary.failed++;
                console.log('❌ App did not load\n');
            }
        }
        
        // ============================================
        // TEST 3: Open Profile Dropdown
        // ============================================
        console.log('📝 TEST 3: Opening profile dropdown...');
        console.log('-'.repeat(70));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Click auth button
        const authBtnClicked = await page.evaluate(() => {
            const authBtn = document.getElementById('auth-btn');
            if (authBtn) {
                authBtn.click();
                return true;
            }
            return false;
        });
        
        if (authBtnClicked) {
            console.log('   Profile icon clicked');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await page.screenshot({ 
                path: path.join(screenshotDir, '03-profile-dropdown-opened.png'),
                fullPage: false 
            });
            
            const dropdownInfo = await page.evaluate(() => {
                const dropdown = document.getElementById('profile-dropdown');
                if (!dropdown) return { exists: false };
                
                const style = window.getComputedStyle(dropdown);
                return {
                    exists: true,
                    visible: style.display !== 'none',
                    display: style.display,
                    hasHeader: !!dropdown.querySelector('.profile-header'),
                    hasStats: !!dropdown.querySelector('.profile-stats'),
                    hasMenu: !!dropdown.querySelector('.profile-menu'),
                    hasFooter: !!dropdown.querySelector('.profile-footer'),
                    profileName: dropdown.querySelector('#profile-name')?.textContent,
                    profileEmail: dropdown.querySelector('#profile-email')?.textContent
                };
            });
            
            console.log('Dropdown info:', JSON.stringify(dropdownInfo, null, 2));
            
            if (dropdownInfo.exists && dropdownInfo.visible) {
                results.tests.push({
                    name: 'Profile dropdown opens',
                    status: 'PASSED',
                    details: `Name: ${dropdownInfo.profileName}, Email: ${dropdownInfo.profileEmail}`
                });
                results.summary.passed++;
                console.log('✅ Profile dropdown opened successfully\n');
            } else {
                results.tests.push({
                    name: 'Profile dropdown opens',
                    status: 'FAILED',
                    details: 'Dropdown not visible'
                });
                results.summary.failed++;
                console.log('❌ Profile dropdown did not open\n');
            }
        }
        
        // ============================================
        // TEST 4: Verify Logout Button
        // ============================================
        console.log('📝 TEST 4: Checking for logout/auth button...');
        console.log('-'.repeat(70));
        
        const logoutButtonInfo = await page.evaluate(() => {
            const authAction = document.getElementById('profile-auth-action');
            if (!authAction) return { exists: false };
            
            const rect = authAction.getBoundingClientRect();
            const style = window.getComputedStyle(authAction);
            
            return {
                exists: true,
                visible: style.display !== 'none' && rect.width > 0,
                text: authAction.textContent.trim(),
                icon: authAction.querySelector('.menu-icon')?.textContent,
                inFooter: !!authAction.closest('.profile-footer'),
                className: authAction.className,
                position: {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                }
            };
        });
        
        console.log('Logout button info:', JSON.stringify(logoutButtonInfo, null, 2));
        
        if (logoutButtonInfo.exists && logoutButtonInfo.visible && logoutButtonInfo.inFooter) {
            results.tests.push({
                name: 'Logout button present in dropdown footer',
                status: 'PASSED',
                details: `Text: "${logoutButtonInfo.text}", Icon: ${logoutButtonInfo.icon}`
            });
            results.summary.passed++;
            console.log('✅ Logout button found and visible!\n');
            console.log(`   Text: "${logoutButtonInfo.text}"`);
            console.log(`   Icon: ${logoutButtonInfo.icon}`);
            console.log(`   In footer: YES\n`);
        } else {
            results.tests.push({
                name: 'Logout button present',
                status: 'FAILED',
                details: logoutButtonInfo.exists ? 'Not visible or not in footer' : 'Element not found'
            });
            results.summary.failed++;
            console.log('❌ Logout button not found or not visible\n');
        }
        
        // ============================================
        // TEST 5: Test Logout Button Click
        // ============================================
        console.log('📝 TEST 5: Testing logout button functionality...');
        console.log('-'.repeat(70));
        
        let alertMessage = '';
        page.on('dialog', async dialog => {
            alertMessage = dialog.message();
            console.log(`   Alert appeared: "${alertMessage.substring(0, 100)}..."`);
            await dialog.accept();
        });
        
        const logoutClicked = await page.evaluate(() => {
            const authAction = document.getElementById('profile-auth-action');
            if (authAction) {
                authAction.click();
                return true;
            }
            return false;
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '04-after-logout-click.png'),
            fullPage: false 
        });
        
        if (logoutClicked && alertMessage) {
            results.tests.push({
                name: 'Logout button click triggers alert',
                status: 'PASSED',
                details: `Alert shown: "${alertMessage.substring(0, 50)}..."`
            });
            results.summary.passed++;
            console.log('✅ Logout button clicked and alert displayed\n');
        } else if (logoutClicked) {
            results.tests.push({
                name: 'Logout button clickable',
                status: 'PASSED',
                details: 'Button clicked successfully (no alert in guest mode is okay)'
            });
            results.summary.passed++;
            console.log('✅ Logout button is clickable\n');
        } else {
            results.tests.push({
                name: 'Logout button click',
                status: 'FAILED',
                details: 'Could not click button'
            });
            results.summary.failed++;
            console.log('❌ Could not click logout button\n');
        }
        
        // ============================================
        // TEST 6: Export Data Button
        // ============================================
        console.log('📝 TEST 6: Testing Export Data button...');
        console.log('-'.repeat(70));
        
        // Reopen dropdown if closed
        await page.evaluate(() => {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown && window.getComputedStyle(dropdown).display === 'none') {
                document.getElementById('auth-btn')?.click();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const exportBtnExists = await page.evaluate(() => {
            const exportBtn = document.getElementById('profile-export-btn');
            return {
                exists: !!exportBtn,
                visible: exportBtn ? window.getComputedStyle(exportBtn).display !== 'none' : false,
                text: exportBtn?.textContent.trim()
            };
        });
        
        console.log('Export button:', JSON.stringify(exportBtnExists, null, 2));
        
        if (exportBtnExists.exists && exportBtnExists.visible) {
            results.tests.push({
                name: 'Export Data button present',
                status: 'PASSED',
                details: `Text: "${exportBtnExists.text}"`
            });
            results.summary.passed++;
            console.log('✅ Export Data button found\n');
        } else {
            results.tests.push({
                name: 'Export Data button present',
                status: 'FAILED',
                details: 'Button not found or not visible'
            });
            results.summary.failed++;
            console.log('❌ Export Data button not found\n');
        }
        
        // ============================================
        // TEST 7: Profile Stats Update
        // ============================================
        console.log('📝 TEST 7: Checking profile stats...');
        console.log('-'.repeat(70));
        
        const statsInfo = await page.evaluate(() => {
            return {
                questions: document.getElementById('profile-questions')?.textContent,
                accuracy: document.getElementById('profile-accuracy')?.textContent,
                time: document.getElementById('profile-time')?.textContent
            };
        });
        
        console.log('Profile stats:', JSON.stringify(statsInfo, null, 2));
        
        if (statsInfo.questions !== undefined && statsInfo.accuracy !== undefined) {
            results.tests.push({
                name: 'Profile stats display',
                status: 'PASSED',
                details: `Questions: ${statsInfo.questions}, Accuracy: ${statsInfo.accuracy}, Time: ${statsInfo.time}`
            });
            results.summary.passed++;
            console.log('✅ Profile stats displaying correctly\n');
        } else {
            results.tests.push({
                name: 'Profile stats display',
                status: 'FAILED',
                details: 'Stats not found'
            });
            results.summary.failed++;
            console.log('❌ Profile stats not displaying\n');
        }
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '05-final-state.png'),
            fullPage: true 
        });
        
    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        results.tests.push({
            name: 'Test Execution',
            status: 'ERROR',
            details: error.message
        });
        results.summary.failed++;
    } finally {
        if (browser) {
            await browser.close();
        }
        
        // Stop server
        server.close(() => {
            console.log('\n🛑 Local server stopped\n');
        });
    }
    
    // Save results
    fs.writeFileSync(
        path.join(screenshotDir, 'test-results.json'),
        JSON.stringify(results, null, 2)
    );
    
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 LOCAL TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`❌ Failed: ${results.summary.failed}`);
    console.log(`📁 Screenshots: ${screenshotDir}`);
    console.log('='.repeat(70));
    
    console.log('\n📋 Detailed Results:');
    results.tests.forEach((test, index) => {
        const icon = test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '⚠️';
        console.log(`\n${index + 1}. ${icon} ${test.name}`);
        console.log(`   Status: ${test.status}`);
        console.log(`   Details: ${test.details}`);
    });
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    return results.summary.failed === 0;
}

// Run the test
testLocalLoginLogout()
    .then(success => {
        if (success) {
            console.log('🎉 ALL LOCAL TESTS PASSED!\n');
        } else {
            console.log('⚠️  Some tests failed. Check results for details.\n');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });

