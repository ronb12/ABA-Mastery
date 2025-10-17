const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    try {
        await page.goto('http://localhost:8000/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch (e) {
        console.log('Timeout (expected)');
    }
    
    await sleep(5000);
    
    const bodyHTML = await page.evaluate(() => {
        return {
            title: document.title,
            homeView: !!document.getElementById('home-view'),
            bodyClasses: document.body.className,
            headings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent).slice(0, 5)
        };
    });
    
    console.log('\n=== PAGE ANALYSIS ===');
    console.log(JSON.stringify(bodyHTML, null, 2));
    
    await page.screenshot({ path: 'quick-test.png' });
    console.log('\nScreenshot saved to quick-test.png');
    console.log('\nPress Ctrl+C to exit');
    
    // Don't close so you can see the page
    // await browser.close();
})();

