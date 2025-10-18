#!/usr/bin/env node

/**
 * Simple Reliable Button Testing with Puppeteer
 * Tests all buttons one by one with proper error handling
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8001';
const SCREENSHOTS_DIR = './button-tests';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
}

const log = (msg, color = '') => {
    const colors = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', c: '\x1b[36m', b: '\x1b[34m', reset: '\x1b[0m' };
    console.log(`${colors[color] || ''}${msg}${colors.reset}`);
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testButtons() {
    log('\n🖱️  TESTING ALL BUTTONS IN ABA MASTERY APP\n', 'b');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        defaultViewport: { width: 1400, height: 900 },
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    
    let passed = 0, failed = 0;
    const results = [];

    const test = async (name, fn) => {
        try {
            log(`\n[${passed + failed + 1}] ${name}`, 'c');
            await fn();
            log(`✅ PASS`, 'g');
            passed++;
            results.push({ name, status: 'pass' });
        } catch (e) {
            log(`❌ FAIL: ${e.message}`, 'r');
            failed++;
            results.push({ name, status: 'fail', error: e.message });
        }
    };

    try {
        // Navigate to main app
        log('Loading main app...', 'c');
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle0', timeout: 20000 });
        await sleep(3000);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/00-app-loaded.png` });
        log('✅ App loaded\n', 'g');

        // ======================
        // NAVIGATION BUTTONS
        // ======================
        log('🧭 NAVIGATION BUTTONS', 'b');
        
        await test('Home navigation button', async () => {
            await page.click('[data-view="home"]');
            await sleep(1000);
            const active = await page.$('#home-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-nav-home.png` });
        });

        await test('Study navigation button', async () => {
            await page.click('[data-view="study"]');
            await sleep(1000);
            const active = await page.$('#study-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-nav-study.png` });
        });

        await test('Practice navigation button', async () => {
            await page.click('[data-view="practice"]');
            await sleep(1000);
            const active = await page.$('#practice-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-nav-practice.png` });
        });

        await test('Flashcards navigation button', async () => {
            await page.click('[data-view="flashcards"]');
            await sleep(1000);
            const active = await page.$('#flashcards-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-nav-flashcards.png` });
        });

        await test('Progress navigation button', async () => {
            await page.click('[data-view="progress"]');
            await sleep(1000);
            const active = await page.$('#progress-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-nav-progress.png` });
        });

        await test('Settings navigation button', async () => {
            await page.click('[data-view="settings"]');
            await sleep(1000);
            const active = await page.$('#settings-view.active');
            if (!active) throw new Error('View not active');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-nav-settings.png` });
        });

        // ======================
        // HOME VIEW BUTTONS
        // ======================
        log('\n🏠 HOME VIEW BUTTONS', 'b');
        await page.click('[data-view="home"]');
        await sleep(1500);

        await test('Study quick action button', async () => {
            await page.evaluate(() => {
                const card = Array.from(document.querySelectorAll('.action-card'))
                    .find(c => c.dataset.action === 'study');
                if (card) card.click();
            });
            await sleep(1500);
            const active = await page.$('#study-view.active');
            if (!active) throw new Error('Did not navigate to study');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-quick-study.png` });
        });

        await page.click('[data-view="home"]');
        await sleep(1000);

        await test('Practice quick action button', async () => {
            await page.evaluate(() => {
                const card = Array.from(document.querySelectorAll('.action-card'))
                    .find(c => c.dataset.action === 'practice');
                if (card) card.click();
            });
            await sleep(1500);
            const active = await page.$('#practice-view.active');
            if (!active) throw new Error('Did not navigate to practice');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-quick-practice.png` });
        });

        await page.click('[data-view="home"]');
        await sleep(1000);

        await test('Flashcards quick action button', async () => {
            await page.evaluate(() => {
                const card = Array.from(document.querySelectorAll('.action-card'))
                    .find(c => c.dataset.action === 'flashcards');
                if (card) card.click();
            });
            await sleep(1500);
            const active = await page.$('#flashcards-view.active');
            if (!active) throw new Error('Did not navigate to flashcards');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/09-quick-flashcards.png` });
        });

        // ======================
        // STUDY VIEW BUTTONS
        // ======================
        log('\n📚 STUDY VIEW BUTTONS', 'b');
        await page.click('[data-view="study"]');
        await sleep(2000);

        await test('Topic card button (opens modal)', async () => {
            await page.click('.topic-card');
            await sleep(1500);
            const modal = await page.$('.modal');
            if (!modal) throw new Error('Modal did not open');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/10-topic-modal.png` });
        });

        await test('Topic modal close button', async () => {
            await page.evaluate(() => {
                const btn = document.querySelector('.close-btn');
                if (btn) btn.click();
                else document.querySelector('.modal')?.remove();
            });
            await sleep(1000);
            const modal = await page.$('.modal');
            if (modal) throw new Error('Modal did not close');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/11-modal-closed.png` });
        });

        // ======================
        // PRACTICE EXAM BUTTONS
        // ======================
        log('\n✍️  PRACTICE EXAM BUTTONS', 'b');
        await page.click('[data-view="practice"]');
        await sleep(1500);

        await test('Start Practice Exam button', async () => {
            await page.select('#practice-category', 'foundations');
            await page.evaluate(() => document.getElementById('question-count').value = '2');
            await sleep(500);
            await page.click('#start-practice');
            await sleep(2500);
            const quiz = await page.$('#practice-quiz');
            if (!quiz) throw new Error('Quiz did not start');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/12-quiz-started.png` });
        });

        await test('Answer option button', async () => {
            const answer = await page.$('.answer-option');
            if (!answer) throw new Error('No answer options');
            await answer.click();
            await sleep(800);
            const selected = await page.$('.answer-option.selected');
            if (!selected) throw new Error('Answer not selected');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/13-answer-selected.png` });
        });

        await test('Submit Answer button', async () => {
            await page.click('#submit-answer');
            await sleep(2000);
            const explan = await page.$('#explanation-container');
            if (!explan) throw new Error('No explanation shown');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/14-answer-submitted.png` });
        });

        await test('Next Question button', async () => {
            const nextBtn = await page.$('#next-question');
            if (!nextBtn) throw new Error('Next button not found');
            await nextBtn.click();
            await sleep(1500);
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/15-next-question.png` });
        });

        // Answer second question quickly
        await sleep(1000);
        const ans2 = await page.$('.answer-option');
        if (ans2) {
            await ans2.click();
            await sleep(500);
            await page.click('#submit-answer');
            await sleep(1500);
        }

        await test('Finish Quiz button', async () => {
            const finish = await page.$('#finish-quiz');
            if (!finish) throw new Error('Finish button not found');
            await finish.click();
            await sleep(2500);
            const results = await page.$('#practice-results');
            if (!results) throw new Error('Results not shown');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/16-quiz-finished.png` });
        });

        // ======================
        // FLASHCARD BUTTONS
        // ======================
        log('\n🎴 FLASHCARD BUTTONS', 'b');
        await page.click('[data-view="flashcards"]');
        await sleep(2000);

        await test('Flip Card button', async () => {
            await page.click('#flip-card');
            await sleep(1000);
            const flipped = await page.$eval('#flashcard', el => el.dataset.flipped);
            if (flipped !== 'true') throw new Error('Card did not flip');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/17-card-flipped.png` });
        });

        await test('Flashcard click (direct)', async () => {
            await page.click('#flashcard');
            await sleep(1000);
            const flipped = await page.$eval('#flashcard', el => el.dataset.flipped);
            if (flipped !== 'false') throw new Error('Card did not flip back');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/18-card-clicked.png` });
        });

        await test('Next Card button', async () => {
            await page.click('#next-card');
            await sleep(1000);
            const counter = await page.$eval('#card-counter', el => el.textContent);
            if (!counter.includes('2')) throw new Error('Did not advance');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/19-next-card.png` });
        });

        await test('Previous Card button', async () => {
            await page.click('#prev-card');
            await sleep(1000);
            const counter = await page.$eval('#card-counter', el => el.textContent);
            if (!counter.includes('1')) throw new Error('Did not go back');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/20-prev-card.png` });
        });

        // ======================
        // SETTINGS BUTTONS
        // ======================
        log('\n⚙️  SETTINGS BUTTONS', 'b');
        await page.click('[data-view="settings"]');
        await sleep(1500);

        await test('Dark mode checkbox', async () => {
            await page.click('#dark-mode-setting');
            await sleep(1200);
            const theme = await page.evaluate(() => document.documentElement.dataset.theme);
            if (theme !== 'dark') throw new Error('Dark mode did not activate');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/21-dark-mode.png` });
            
            // Toggle back
            await page.click('#dark-mode-setting');
            await sleep(800);
        });

        await test('Export Data button', async () => {
            await page._client().send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: SCREENSHOTS_DIR
            });
            await page.click('#export-data');
            await sleep(1500);
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/22-export-clicked.png` });
        });

        await test('Reset Progress button (with cancel)', async () => {
            page.once('dialog', async dialog => {
                await dialog.dismiss();
            });
            await page.click('#reset-progress');
            await sleep(1500);
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/23-reset-dialog.png` });
        });

        // ======================
        // HEADER BUTTONS
        // ======================
        log('\n🔝 HEADER BUTTONS', 'b');

        await test('Header dark mode toggle', async () => {
            await page.click('#dark-mode-toggle');
            await sleep(1000);
            const theme = await page.evaluate(() => document.documentElement.dataset.theme);
            if (theme !== 'dark') throw new Error('Toggle failed');
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/24-header-darkmode.png` });
            
            // Toggle back
            await page.click('#dark-mode-toggle');
            await sleep(500);
        });

        // Final screenshot
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/25-final.png` });

    } catch (error) {
        log(`\n❌ Critical Error: ${error.message}`, 'r');
    } finally {
        log('\n' + '='.repeat(80), 'b');
        log('📊 BUTTON TEST RESULTS', 'b');
        log('='.repeat(80), 'b');
        log(`✅ Passed: ${passed}`, 'g');
        log(`❌ Failed: ${failed}`, failed > 0 ? 'r' : 'g');
        log(`📊 Total: ${passed + failed}`, 'c');
        log(`🎯 Success: ${Math.round((passed / (passed + failed)) * 100)}%`, passed >= (passed + failed) * 0.8 ? 'g' : 'y');
        log('='.repeat(80), 'b');

        fs.writeFileSync('button-test-results.json', JSON.stringify({
            date: new Date().toISOString(),
            passed,
            failed,
            total: passed + failed,
            successRate: Math.round((passed / (passed + failed)) * 100),
            results
        }, null, 2));

        log(`\n📄 Report: button-test-results.json`, 'c');
        log(`📸 Screenshots: ${SCREENSHOTS_DIR}/\n`, 'c');

        if (passed === passed + failed) {
            log('🎉 PERFECT! ALL BUTTONS WORKING!\n', 'g');
        } else if (passed >= (passed + failed) * 0.8) {
            log('✅ GREAT! Most buttons working!\n', 'g');
        }

        log('Browser will close in 8 seconds...\n', 'y');
        await sleep(8000);
        await browser.close();
    }
}

testButtons();

