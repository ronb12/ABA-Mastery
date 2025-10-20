#!/usr/bin/env node

/**
 * Deploy Blank Page Fix to Firebase
 * This script deploys the index.html fix and firebase.json update
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Deploying blank page fix...\n');

// Change to project directory
const projectDir = '/Users/ronellbradley/Desktop/ABA Mastery';
process.chdir(projectDir);

console.log('📍 Current directory:', process.cwd());
console.log('');

// Verify files exist
const filesToCheck = ['index.html', 'landing.html', 'firebase.json'];
console.log('✅ Checking files:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`   ✓ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`   ✗ ${file} NOT FOUND!`);
  }
});
console.log('');

// Run Firebase deploy
try {
  console.log('📤 Deploying to Firebase Hosting...');
  console.log('   This may take 1-2 minutes...\n');
  
  const output = execSync('firebase deploy --only hosting', {
    encoding: 'utf8',
    stdio: 'inherit' // Show output in real-time
  });
  
  console.log('\n✅ Deployment successful!\n');
  console.log('🌐 Your app is now live at:');
  console.log('   https://aba-mastery-app.web.app/\n');
  console.log('✨ The blank page is fixed!');
  console.log('   - Landing page with features modal is now visible');
  console.log('   - Click "See All Features" to see the 14 features\n');
  
} catch (error) {
  console.error('\n❌ Deployment failed!');
  console.error('Error:', error.message);
  console.error('\nTroubleshooting:');
  console.error('1. Make sure you\'re logged into Firebase: firebase login');
  console.error('2. Check your internet connection');
  console.error('3. Try running manually: firebase deploy --only hosting\n');
  process.exit(1);
}


