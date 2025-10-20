#!/usr/bin/env node
// Auto-increment version numbers for cache busting

const fs = require('fs');
const path = require('path');

// Read current version
const versionPath = path.join(__dirname, 'version.json');
const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

// Increment build number
version.buildNumber++;
version.lastUpdated = new Date().toISOString();

console.log(`📦 Bumping version to ${version.version} (build ${version.buildNumber})`);

// Save updated version
fs.writeFileSync(versionPath, JSON.stringify(version, null, 2));

console.log('✅ Version updated!');
console.log('💡 Run deployment to push changes to production');
console.log('\nNext steps:');
console.log('  1. git add .');
console.log('  2. git commit -m "Version bump"');
console.log('  3. firebase deploy --only hosting');
console.log('  4. git push origin main');

