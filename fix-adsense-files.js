#!/usr/bin/env node
/**
 * Fix AdSense policy: restore login/signup/billing from .bak and remove AdSense.
 * Run in your terminal: node fix-adsense-files.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = ['login', 'signup', 'billing'];

function readFileNoTimeout(filePath) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(chunks.join('')));
    stream.on('error', reject);
  });
}

function stripAdSense(html) {
  return html
    .replace(/\s*<meta name="google-adsense-account" content="ca-pub-[^"]+">\s*/gi, '\n')
    .replace(/\s*<!-- Google AdSense -->\s*/gi, '\n')
    .replace(/\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"]*"[^>]*><\/script>\s*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  let ok = 0;
  for (const f of files) {
    const bak = path.join(dir, `${f}.html.bak`);
    const out = path.join(dir, `${f}.html`);
    try {
      if (!fs.existsSync(bak)) {
        console.warn(`Skip ${f}.html: no ${f}.html.bak`);
        continue;
      }
      const content = await readFileNoTimeout(bak);
      const fixed = stripAdSense(content);
      fs.writeFileSync(out, fixed, 'utf8');
      console.log(`Fixed ${f}.html`);
      ok++;
    } catch (e) {
      console.error(`${f}.html:`, e.message);
      if (e.message && e.message.includes('ETIMEDOUT')) {
        console.error('  Tip: If project is on iCloud/Desktop, copy it locally and run again:');
        console.error('  cp -r "' + dir + '" ~/Projects/ABA-Mastery && cd ~/Projects/ABA-Mastery && node fix-adsense-files.js --deploy');
      }
    }
  }
  return ok;
}

(async () => {
  const ok = await main();
  console.log(`Done. ${ok}/${files.length} files updated.`);

  const doDeploy = process.argv.includes('--deploy');
  if (doDeploy && ok > 0) {
    console.log('Running: vercel --prod --yes');
    const { execSync } = require('child_process');
    try {
      execSync('vercel --prod --yes', { cwd: dir, stdio: 'inherit' });
    } catch (e) {
      process.exitCode = e.status || 1;
    }
  } else if (ok > 0) {
    console.log('Deploy with: node fix-adsense-files.js --deploy');
  }
})();
