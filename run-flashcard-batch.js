#!/usr/bin/env node
// Flashcard Batch Runner
// Run this multiple times to add 100 flashcards each time until you reach 500

const fs = require('fs');
const batches = require('./batch-add-flashcards.js');

const TARGET = 500;
let batchNum = 1;

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║       ABA MASTERY - FLASHCARD BATCH ADDER               ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Load current content
const content = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const currentCount = content.flashcards.length;

console.log(`📊 Current Status:`);
console.log(`   Flashcards: ${currentCount}/${TARGET}`);
console.log(`   Progress: ${Math.round(currentCount/TARGET*100)}%\n`);

if (currentCount >= TARGET) {
  console.log('✅ Already at or above target!\n');
  process.exit(0);
}

// Determine which batch to add based on current count
const batchData = [];
const batchMap = [
  {limit: 145, batch: batches.BATCH_1, num: 1},
  {limit: 175, batch: batches.BATCH_2, num: 2},
  {limit: 205, batch: batches.BATCH_3, num: 3},
  {limit: 240, batch: batches.BATCH_4, num: 4},
  {limit: 270, batch: batches.BATCH_5, num: 5},
  {limit: 305, batch: batches.BATCH_6, num: 6},
  {limit: 340, batch: batches.BATCH_7, num: 7},
  {limit: 375, batch: batches.BATCH_9, num: 9},
  {limit: 405, batch: batches.BATCH_10, num: 10},
  {limit: 500, batch: batches.BATCH_11, num: 11}
];

const matchedBatch = batchMap.find(b => currentCount < b.limit);

if (matchedBatch) {
  batchData.push(...matchedBatch.batch);
  batchNum = matchedBatch.num;
} else {
  console.log('⚠️  All defined batches already added. Need more batch data.\n');
  console.log(`Current: ${currentCount} flashcards`);
  console.log(`To reach ${TARGET}, add more batches (BATCH_11+) in batch-add-flashcards.js\n`);
  process.exit(0);
}

console.log(`📦 Adding Batch ${batchNum}...`);
console.log(`   Cards in this batch: ${batchData.length}\n`);

// Create backup
const backupFile = `backups/content-backup-batch${batchNum}-${Date.now()}.json`;
if (!fs.existsSync('backups')) {
  fs.mkdirSync('backups');
}
fs.writeFileSync(backupFile, JSON.stringify(content, null, 2));
console.log(`💾 Backup saved: ${backupFile}\n`);

// Convert batch data to flashcard format
const newFlashcards = batchData.map((card, index) => ({
  id: `fc${currentCount + index + 1}`,
  category: card.cat,
  question: card.q,
  answer: card.a
}));

// Add to content
content.flashcards = content.flashcards.concat(newFlashcards);
content.metadata.totalFlashcards = content.flashcards.length;
content.metadata.lastUpdated = new Date().toISOString().split('T')[0];
content.metadata.version = '6.1.0';

// Validate
try {
  JSON.parse(JSON.stringify(content));
  console.log('✅ JSON validation passed\n');
} catch (error) {
  console.error('❌ JSON validation FAILED:', error.message);
  console.log('   Restoring from backup...\n');
  fs.copyFileSync(backupFile, 'content.json');
  process.exit(1);
}

// Save
fs.writeFileSync('content.json', JSON.stringify(content, null, 2));

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║                   BATCH COMPLETE!                        ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');
console.log(`✅ Added ${newFlashcards.length} flashcards (Batch ${batchNum})`);
console.log(`📊 New total: ${content.flashcards.length}/${TARGET}`);
console.log(`📈 Progress: ${Math.round(content.flashcards.length/TARGET*100)}%`);
console.log(`📉 Remaining: ${TARGET - content.flashcards.length}\n`);

// Category breakdown
const categoryCounts = {};
content.flashcards.forEach(fc => {
  categoryCounts[fc.category] = (categoryCounts[fc.category] || 0) + 1;
});

console.log(`📋 Flashcards by category:`);
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

if (content.flashcards.length < TARGET) {
  console.log(`\n💡 Run again to add Batch ${batchNum + 1}:`);
  console.log(`   node run-flashcard-batch.js\n`);
} else {
  console.log(`\n🎉 TARGET REACHED! ${content.flashcards.length} flashcards!\n`);
  console.log(`📦 Ready to deploy:`);
  console.log(`   firebase deploy --only hosting\n`);
}

