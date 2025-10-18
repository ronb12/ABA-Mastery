const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Quick visual verification of logout button
async function verifyLogoutButton() {
    console.log('🔍 Visual Verification: Logout Button Position\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const screenshotDir = path.join(__dirname, 'logout-button-verification');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    try {
        // Load the app
        console.log('📝 Loading app...');
        await page.goto('https://aba-mastery-app.web.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await page.waitForSelector('#app', { timeout: 10000 });
        console.log('✅ App loaded\n');
        
        // Check logout button exists
        const buttonInfo = await page.evaluate(() => {
            const logoutBtn = document.getElementById('logout-btn');
            const darkModeBtn = document.getElementById('dark-mode-toggle');
            const menuBtn = document.getElementById('menu-toggle');
            
            if (!logoutBtn) return { error: 'Logout button not found' };
            
            const logoutRect = logoutBtn.getBoundingClientRect();
            const darkModeRect = darkModeBtn ? darkModeBtn.getBoundingClientRect() : null;
            const menuRect = menuBtn ? menuBtn.getBoundingClientRect() : null;
            
            return {
                logoutButton: {
                    exists: true,
                    visible: window.getComputedStyle(logoutBtn).display !== 'none',
                    display: window.getComputedStyle(logoutBtn).display,
                    position: {
                        top: logoutRect.top,
                        left: logoutRect.left,
                        width: logoutRect.width,
                        height: logoutRect.height
                    },
                    icon: logoutBtn.querySelector('.icon')?.textContent,
                    title: logoutBtn.getAttribute('title'),
                    ariaLabel: logoutBtn.getAttribute('aria-label')
                },
                darkModeButton: darkModeRect ? {
                    position: {
                        top: darkModeRect.top,
                        left: darkModeRect.left
                    }
                } : null,
                menuButton: menuRect ? {
                    position: {
                        top: menuRect.top,
                        left: menuRect.left
                    }
                } : null
            };
        });
        
        console.log('📊 Button Layout:\n');
        console.log(JSON.stringify(buttonInfo, null, 2));
        console.log('\n');
        
        // Take screenshot of header
        await page.screenshot({ 
            path: path.join(screenshotDir, '01-full-page-guest-mode.png'),
            fullPage: true 
        });
        
        // Take close-up screenshot of header
        const headerElement = await page.$('.app-header');
        if (headerElement) {
            await headerElement.screenshot({
                path: path.join(screenshotDir, '02-header-closeup.png')
            });
        }
        
        // Add highlighting to show button positions
        await page.evaluate(() => {
            const logoutBtn = document.getElementById('logout-btn');
            const darkModeBtn = document.getElementById('dark-mode-toggle');
            const menuBtn = document.getElementById('menu-toggle');
            
            // Add red border to logout button (even if hidden)
            if (logoutBtn) {
                logoutBtn.style.border = '3px solid red';
                logoutBtn.style.outline = '3px solid red';
            }
            
            // Add blue border to dark mode button
            if (darkModeBtn) {
                darkModeBtn.style.border = '3px solid blue';
            }
            
            // Add green border to menu button
            if (menuBtn) {
                menuBtn.style.border = '3px solid green';
            }
        });
        
        await page.screenshot({ 
            path: path.join(screenshotDir, '03-header-highlighted.png'),
            fullPage: false
        });
        
        // Summary
        console.log('✅ VERIFICATION COMPLETE\n');
        console.log('📍 Logout Button Status:');
        console.log(`   - Exists: ${buttonInfo.logoutButton?.exists ? 'YES' : 'NO'}`);
        console.log(`   - Visible: ${buttonInfo.logoutButton?.visible ? 'YES (visible)' : 'NO (hidden in guest mode)'}`);
        console.log(`   - Icon: ${buttonInfo.logoutButton?.icon}`);
        console.log(`   - Title: ${buttonInfo.logoutButton?.title}`);
        console.log(`   - Position: Top ${Math.round(buttonInfo.logoutButton?.position.top)}px, Left ${Math.round(buttonInfo.logoutButton?.position.left)}px`);
        
        if (buttonInfo.darkModeButton) {
            const distance = Math.abs(buttonInfo.logoutButton.position.left - buttonInfo.darkModeButton.position.left);
            console.log(`\n📏 Distance from Dark Mode button: ~${Math.round(distance)}px`);
        }
        
        console.log(`\n📁 Screenshots saved to: ${screenshotDir}`);
        console.log('\n💡 The logout button should appear next to the dark mode button when a user signs in.\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await page.screenshot({ 
            path: path.join(screenshotDir, 'error.png'),
            fullPage: true 
        });
    }
    
    await browser.close();
}

// Run verification
verifyLogoutButton()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

