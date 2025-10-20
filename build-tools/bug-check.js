// Comprehensive Bug Check Script
// A product of Bradley Virtual Solutions, LLC

const puppeteer = require('puppeteer');
const fs = require('fs');

async function checkForBugs() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║            ABA MASTERY - COMPREHENSIVE BUG CHECK             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const issues = [];
    const warnings = [];
    const successes = [];

    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Capture console errors
        const consoleErrors = [];
        const consoleWarnings = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            } else if (msg.type() === 'warning') {
                consoleWarnings.push(msg.text());
            }
        });

        // Capture page errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
        });

        // Navigate to landing page
        console.log('🔍 Testing Landing Page...');
        await page.goto('http://localhost:5000/', { waitUntil: 'networkidle2', timeout: 10000 });
        
        // Check if page loads
        const title = await page.title();
        if (title.includes('ABA Mastery')) {
            successes.push('✅ Landing page loads successfully');
        } else {
            issues.push('❌ Landing page title incorrect');
        }

        // Check for Guest Mode button
        const guestButton = await page.$('button:has-text("Continue as Guest")') || 
                           await page.$('button[onclick*="guest"]') ||
                           await page.$('.btn-secondary');
        if (guestButton) {
            successes.push('✅ Guest Mode button found');
            await guestButton.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
        } else {
            warnings.push('⚠️  Guest Mode button not found on landing page');
        }

        console.log('🔍 Testing Main App...');

        // Wait for app to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if app.js loaded
        const appLoaded = await page.evaluate(() => {
            return typeof appData !== 'undefined';
        });
        if (appLoaded) {
            successes.push('✅ app.js loaded successfully');
        } else {
            issues.push('❌ app.js failed to load or appData is undefined');
        }

        // Check if content.json loaded
        const contentLoaded = await page.evaluate(() => {
            return typeof appData !== 'undefined' && appData.content !== null;
        });
        if (contentLoaded) {
            successes.push('✅ content.json loaded successfully');
        } else {
            issues.push('❌ content.json failed to load');
        }

        // Check navigation buttons
        console.log('🔍 Testing Navigation...');
        const navButtons = await page.$$('.nav-item');
        if (navButtons.length >= 5) {
            successes.push(`✅ Navigation buttons found (${navButtons.length})`);
        } else {
            warnings.push(`⚠️  Expected 5+ nav buttons, found ${navButtons.length}`);
        }

        // Test each view
        const views = ['home', 'study', 'practice', 'flashcards', 'progress'];
        for (const view of views) {
            const viewButton = await page.$(`[data-view="${view}"]`);
            if (viewButton) {
                await viewButton.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const viewActive = await page.$(`#${view}-view.active`);
                if (viewActive) {
                    successes.push(`✅ ${view} view works`);
                } else {
                    issues.push(`❌ ${view} view failed to activate`);
                }
            }
        }

        // Check for critical elements
        console.log('🔍 Checking Critical Elements...');
        
        const criticalElements = {
            'topics-container': 'Study topics container',
            'stats-grid': 'Statistics grid',
            'practice-category': 'Practice category selector',
            'exam-mode': 'Exam mode selector',
            'flashcard': 'Flashcard element',
            'dark-mode-toggle': 'Dark mode toggle'
        };

        for (const [id, name] of Object.entries(criticalElements)) {
            const element = await page.$(`#${id}`);
            if (element) {
                successes.push(`✅ ${name} exists`);
            } else {
                warnings.push(`⚠️  ${name} not found (#${id})`);
            }
        }

        // Check localStorage functionality
        console.log('🔍 Testing LocalStorage...');
        const localStorageWorks = await page.evaluate(() => {
            try {
                localStorage.setItem('test', 'value');
                const result = localStorage.getItem('test') === 'value';
                localStorage.removeItem('test');
                return result;
            } catch (e) {
                return false;
            }
        });
        if (localStorageWorks) {
            successes.push('✅ LocalStorage working');
        } else {
            issues.push('❌ LocalStorage not working');
        }

        // Check if study topics load
        console.log('🔍 Testing Study Content...');
        const studyView = await page.$('[data-view="study"]');
        if (studyView) {
            await studyView.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const topicCards = await page.$$('.topic-card');
            if (topicCards.length > 0) {
                successes.push(`✅ Study topics loaded (${topicCards.length} topics)`);
                
                // Test clicking a topic
                await topicCards[0].click();
                await new Promise(resolve => setTimeout(resolve, 500));
                const modal = await page.$('.modal');
                if (modal) {
                    successes.push('✅ Topic modal opens correctly');
                } else {
                    issues.push('❌ Topic modal failed to open');
                }
            } else {
                issues.push('❌ No study topics loaded');
            }
        }

        // Check practice exam functionality
        console.log('🔍 Testing Practice Exam...');
        const practiceView = await page.$('[data-view="practice"]');
        if (practiceView) {
            await practiceView.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const startButton = await page.$('#start-practice');
            if (startButton) {
                successes.push('✅ Practice exam start button exists');
                
                // Try to start a quiz
                await startButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const quizContainer = await page.$('#quiz-container.active');
                if (quizContainer) {
                    successes.push('✅ Quiz starts correctly');
                } else {
                    warnings.push('⚠️  Quiz might not have started (check if questions exist)');
                }
            } else {
                issues.push('❌ Practice exam start button not found');
            }
        }

        // Check dark mode
        console.log('🔍 Testing Dark Mode...');
        const darkModeToggle = await page.$('#dark-mode-toggle');
        if (darkModeToggle) {
            await darkModeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const isDark = await page.evaluate(() => {
                return document.body.classList.contains('dark-mode');
            });
            if (isDark) {
                successes.push('✅ Dark mode toggles correctly');
            } else {
                warnings.push('⚠️  Dark mode might not be working');
            }
        }

        // Check for Firebase integration
        console.log('🔍 Testing Firebase Integration...');
        const firebaseLoaded = await page.evaluate(() => {
            return typeof firebase !== 'undefined';
        });
        if (firebaseLoaded) {
            successes.push('✅ Firebase SDK loaded');
        } else {
            warnings.push('⚠️  Firebase SDK not loaded (normal for guest mode)');
        }

        // Report console errors
        if (consoleErrors.length > 0) {
            issues.push(`❌ Console errors detected (${consoleErrors.length})`);
            consoleErrors.forEach(err => {
                console.log(`   Error: ${err}`);
            });
        } else {
            successes.push('✅ No console errors');
        }

        if (consoleWarnings.length > 0) {
            warnings.push(`⚠️  Console warnings detected (${consoleWarnings.length})`);
        } else {
            successes.push('✅ No console warnings');
        }

        if (pageErrors.length > 0) {
            issues.push(`❌ JavaScript errors detected (${pageErrors.length})`);
            pageErrors.forEach(err => {
                console.log(`   Error: ${err}`);
            });
        } else {
            successes.push('✅ No JavaScript errors');
        }

    } catch (error) {
        issues.push(`❌ Test suite error: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Print results
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                       TEST RESULTS                           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    if (successes.length > 0) {
        console.log('✅ SUCCESSES:\n');
        successes.forEach(s => console.log('   ' + s));
    }

    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:\n');
        warnings.forEach(w => console.log('   ' + w));
    }

    if (issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:\n');
        issues.forEach(i => console.log('   ' + i));
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Total Checks: ${successes.length + warnings.length + issues.length}`);
    console.log(`✅ Passed: ${successes.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`❌ Failed: ${issues.length}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (issues.length === 0) {
        console.log('🎉 NO CRITICAL BUGS FOUND! App is working well!\n');
        return 0;
    } else {
        console.log('⚠️  PLEASE REVIEW AND FIX THE ISSUES ABOVE\n');
        return 1;
    }
}

// Run if called directly
if (require.main === module) {
    checkForBugs().then(code => process.exit(code));
}

module.exports = checkForBugs;




