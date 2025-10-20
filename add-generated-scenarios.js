#!/usr/bin/env node

/**
 * ADD GENERATED SCENARIOS IN BATCHES
 * Adds generated scenarios from generated-scenarios/ folder progressively
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join(__dirname, 'content.json');
const BACKUP_DIR = path.join(__dirname, 'backups');
const GENERATED_DIR = path.join(__dirname, 'generated-scenarios');

console.log('📦 BATCH SCENARIO ADDITION SYSTEM\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Create backup
function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `content-before-batch-${timestamp}.json`);
  fs.copyFileSync(CONTENT_FILE, backupFile);
  console.log(`✅ Backup created: ${path.basename(backupFile)}\n`);
  return backupFile;
}

// Load content
function loadContent() {
  const data = fs.readFileSync(CONTENT_FILE, 'utf8');
  return JSON.parse(data);
}

// Save content
function saveContent(content) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

// Get available batch files
function getAvailableBatches() {
  if (!fs.existsSync(GENERATED_DIR)) {
    return [];
  }
  
  const files = fs.readdirSync(GENERATED_DIR)
    .filter(f => f.startsWith('scenario-batch-') && f.endsWith('.json'))
    .sort();
  
  return files.map(f => {
    const batchNum = parseInt(f.match(/scenario-batch-(\d+)\.json/)[1]);
    const scenarios = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, f), 'utf8'));
    return {
      filename: f,
      number: batchNum,
      count: scenarios.length,
      scenarios: scenarios
    };
  });
}

// Add a batch of scenarios
function addBatch(content, batch) {
  console.log(`📦 Adding Batch ${batch.number}`);
  console.log(`   File: ${batch.filename}`);
  console.log(`   Count: ${batch.count} scenarios\n`);
  
  // Initialize scenarioQuestions array if needed
  if (!content.scenarioQuestions) {
    content.scenarioQuestions = [];
  }
  
  // Check for duplicates
  const existingIds = new Set(content.scenarioQuestions.map(s => s.id));
  const newScenarios = batch.scenarios.filter(s => !existingIds.has(s.id));
  
  if (newScenarios.length === 0) {
    console.log('   ⚠️  All scenarios from this batch already exist!\n');
    return 0;
  }
  
  // Add new scenarios
  content.scenarioQuestions.push(...newScenarios);
  
  console.log(`   ✅ Added ${newScenarios.length} scenarios`);
  if (newScenarios.length < batch.count) {
    console.log(`   ℹ️  Skipped ${batch.count - newScenarios.length} duplicates`);
  }
  console.log(`   📊 Total scenarios now: ${content.scenarioQuestions.length}\n`);
  
  return newScenarios.length;
}

// Update metadata
function updateMetadata(content) {
  if (!content.metadata) {
    content.metadata = {};
  }
  
  const scenarioCount = content.scenarioQuestions?.length || 0;
  
  content.metadata.version = '8.0.0';
  content.metadata.lastUpdated = new Date().toISOString().split('T')[0];
  content.metadata.totalScenarioQuestions = scenarioCount;
  content.metadata.totalPracticeQuestions = content.practiceQuestions.length;
  content.metadata.totalFlashcards = content.flashcards.length;
  content.metadata.totalPublishedCases = content.publishedCaseStudies?.length || 0;
  content.metadata.totalContentItems = 
    content.practiceQuestions.length + 
    content.flashcards.length + 
    scenarioCount + 
    (content.publishedCaseStudies?.length || 0);
  
  // Update pass rate based on scenario count
  if (scenarioCount >= 100) {
    content.metadata.passRateEstimate = '97-99% (app alone)';
  } else if (scenarioCount >= 50) {
    content.metadata.passRateEstimate = '96-98% (app alone)';
  }
}

// Show progress
function showProgress(content) {
  const scenarioCount = content.scenarioQuestions?.length || 0;
  const caseCount = content.publishedCaseStudies?.length || 0;
  const batches = getAvailableBatches();
  
  console.log('📊 CURRENT CONTENT SUMMARY:\n');
  console.log(`   Scenario Questions: ${scenarioCount}`);
  console.log(`   Practice Questions: ${content.practiceQuestions.length}`);
  console.log(`   Flashcards: ${content.flashcards.length}`);
  console.log(`   Published Cases: ${caseCount}`);
  console.log(`   ─────────────────────────────────────`);
  console.log(`   TOTAL CONTENT: ${content.practiceQuestions.length + content.flashcards.length + scenarioCount + caseCount}\n`);
  
  if (batches.length > 0) {
    console.log('📦 AVAILABLE BATCHES TO ADD:\n');
    
    // Check which are already added
    const existingIds = new Set(content.scenarioQuestions?.map(s => s.id) || []);
    
    batches.forEach(batch => {
      const alreadyAdded = batch.scenarios.every(s => existingIds.has(s.id));
      const partiallyAdded = batch.scenarios.some(s => existingIds.has(s.id)) && !alreadyAdded;
      
      console.log(`   ${alreadyAdded ? '✅' : partiallyAdded ? '⚠️ ' : '⬜'} batch-${batch.number}: ${batch.count} scenarios ${alreadyAdded ? '(added)' : partiallyAdded ? '(partially added)' : ''}`);
    });
    console.log('');
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help') {
    console.log('📦 ADD GENERATED SCENARIOS IN BATCHES\n');
    console.log('Usage: npm run add-generated [command]\n');
    console.log('Commands:\n');
    console.log('  batch-1, batch-2, etc.  Add specific batch');
    console.log('  all                     Add all available batches');
    console.log('  progress                Show current progress');
    console.log('  list                    List available batches\n');
    console.log('Examples:\n');
    console.log('  npm run add-generated batch-1');
    console.log('  npm run add-generated all');
    console.log('  npm run add-generated progress\n');
    process.exit(0);
  }
  
  try {
    const content = loadContent();
    const batches = getAvailableBatches();
    
    if (batches.length === 0) {
      console.log('❌ No generated scenario batches found!');
      console.log('   Run: node generate-500-scenarios.js first\n');
      process.exit(1);
    }
    
    // Progress command
    if (command === 'progress' || command === 'list') {
      showProgress(content);
      return;
    }
    
    // Add all batches
    if (command === 'all') {
      console.log('🚀 Adding ALL available scenario batches...\n');
      createBackup();
      
      let totalAdded = 0;
      for (const batch of batches) {
        totalAdded += addBatch(content, batch);
      }
      
      updateMetadata(content);
      saveContent(content);
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`✅ SUCCESS! Added ${totalAdded} scenarios\n`);
      showProgress(content);
      return;
    }
    
    // Add specific batch
    const batchMatch = command.match(/batch-(\d+)/);
    if (batchMatch) {
      const batchNum = parseInt(batchMatch[1]);
      const batch = batches.find(b => b.number === batchNum);
      
      if (!batch) {
        console.log(`❌ Batch ${batchNum} not found!`);
        console.log('\nAvailable batches:');
        batches.forEach(b => console.log(`  - batch-${b.number} (${b.count} scenarios)`));
        console.log('');
        process.exit(1);
      }
      
      createBackup();
      const added = addBatch(content, batch);
      updateMetadata(content);
      saveContent(content);
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`✅ BATCH ADDED SUCCESSFULLY!\n`);
      showProgress(content);
      
      console.log('📝 NEXT STEPS:');
      console.log('   1. Test locally: npm run serve');
      console.log('   2. Deploy: firebase deploy --only hosting');
      console.log('   3. Add next batch when ready\n');
      
      console.log('═══════════════════════════════════════════════════════════\n');
      return;
    }
    
    console.log('❌ Unknown command:', command);
    console.log('   Run: npm run add-generated help\n');
    process.exit(1);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { addBatch, getAvailableBatches };

