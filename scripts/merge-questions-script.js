// Script to merge new question batches into content.json

const fs = require('fs');

// Read main content file
const contentPath = './content.json';
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Read question expansion batches
const batches = [
  './question-expansion-batch-1.json',
  './question-expansion-batch-2.json'
];

let totalAdded = 0;

batches.forEach(batchFile => {
  try {
    const batch = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
    content.practiceQuestions.push(...batch.newQuestions);
    totalAdded += batch.newQuestions.length;
    console.log(`✅ Added ${batch.newQuestions.length} questions from ${batchFile}`);
  } catch (err) {
    console.log(`⚠️  Could not read ${batchFile}:`, err.message);
  }
});

// Update metadata
content.metadata.totalQuestions = content.practiceQuestions.length;
content.metadata.lastUpdated = new Date().toISOString().split('T')[0];
content.metadata.version = '2.0.0';
content.metadata.progress = Math.round((content.practiceQuestions.length / 1000) * 100) + '%';

// Write updated content
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

console.log(`\n🎉 SUCCESS!`);
console.log(`📊 Total questions added: ${totalAdded}`);
console.log(`📚 New total questions: ${content.metadata.totalQuestions}`);
console.log(`📈 Progress to 1000: ${content.metadata.progress}`);
console.log(`✅ content.json updated!`);
