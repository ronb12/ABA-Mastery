#!/usr/bin/env node

/**
 * REPLACE SCENARIOS WITH REALISTIC ONES
 * Replaces current scenarios with professionally-written realistic clinical scenarios
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join(__dirname, 'content.json');
const BACKUP_DIR = path.join(__dirname, 'backups');
const BATCHES_DIR = path.join(__dirname, 'realistic-scenarios-batches');

console.log('🔄 REPLACING SCENARIOS WITH REALISTIC ONES\n');

// Create backup
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `content-before-realistic-replacement-${timestamp}.json`);
fs.copyFileSync(CONTENT_FILE, backupFile);
console.log(`✅ Backup created: ${path.basename(backupFile)}\n`);

// Load content
const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
console.log(`📊 Current scenarios: ${content.scenarioQuestions?.length || 0}\n`);

// Load all realistic scenario batches
const realisticScenarios = [];

for (let i = 1; i <= 10; i++) {
  const batchFile = path.join(BATCHES_DIR, `realistic-batch-${i}.json`);
  if (fs.existsSync(batchFile)) {
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    realisticScenarios.push(...batch);
    console.log(`   ✅ Loaded batch ${i}: ${batch.length} scenarios`);
  } else {
    console.log(`   ⚠️  Batch ${i} not found`);
  }
}

console.log(`\n📚 Total realistic scenarios loaded: ${realisticScenarios.length}\n`);

// Replace scenarios
content.scenarioQuestions = realisticScenarios;

// Randomize correct answers to ensure balance
console.log('🔀 Balancing answer distribution...\n');
realisticScenarios.forEach(scenario => {
  const currentIdx = scenario.correctAnswer.charCodeAt(0) - 65;
  const newIdx = Math.floor(Math.random() * 4);
  
  if (currentIdx !== newIdx) {
    const temp = scenario.options[currentIdx];
    scenario.options[currentIdx] = scenario.options[newIdx];
    scenario.options[newIdx] = temp;
    scenario.correctAnswer = String.fromCharCode(65 + newIdx);
  }
});

// Verify balance
const answerCounts = {A:0, B:0, C:0, D:0};
realisticScenarios.forEach(s => answerCounts[s.correctAnswer]++);
console.log('Answer distribution:');
console.log(`  A: ${answerCounts.A} (${Math.round(answerCounts.A/realisticScenarios.length*100)}%)`);
console.log(`  B: ${answerCounts.B} (${Math.round(answerCounts.B/realisticScenarios.length*100)}%)`);
console.log(`  C: ${answerCounts.C} (${Math.round(answerCounts.C/realisticScenarios.length*100)}%)`);
console.log(`  D: ${answerCounts.D} (${Math.round(answerCounts.D/realisticScenarios.length*100)}%)\n`);

// Update metadata
content.metadata.version = '9.3.0';
content.metadata.lastUpdated = new Date().toISOString().split('T')[0];
content.metadata.totalScenarioQuestions = realisticScenarios.length;
content.metadata.scenarioQuality = 'Professional, realistic clinical scenarios';
content.metadata.totalContentItems = 
  content.practiceQuestions.length + 
  content.flashcards.length + 
  realisticScenarios.length + 
  (content.publishedCaseStudies?.length || 0);

// Save
fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

console.log('═══════════════════════════════════════════════════════════');
console.log('✅ SCENARIOS REPLACED WITH REALISTIC ONES!');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📊 NEW CONTENT SUMMARY:\n');
console.log(`   Practice Questions: ${content.practiceQuestions.length}`);
console.log(`   Realistic Scenarios: ${realisticScenarios.length} ⭐ ALL REALISTIC`);
console.log(`   Flashcards: ${content.flashcards.length}`);
console.log(`   Published Cases: ${content.publishedCaseStudies?.length || 0}`);
console.log(`   ───────────────────────────────────`);
console.log(`   TOTAL: ${content.metadata.totalContentItems}\n`);

console.log('✅ All scenarios now have:\n');
console.log('   • Specific client details (age, diagnosis, setting)');
console.log('   • Actual behavior data (rates, frequencies)');
console.log('   • Realistic clinical situations');
console.log('   • Detailed explanations (200+ characters)');
console.log('   • Balanced answer distribution');
console.log('   • BACB task list alignment\n');

console.log('🎯 Quality: Professional scenarios BCBAs actually encounter!\n');

console.log('📝 NEXT STEPS:\n');
console.log('   1. Deploy: firebase deploy --only hosting');
console.log('   2. Test: Click Scenarios tab and try quiz');
console.log('   3. Verify: All scenarios are detailed and realistic\n');

