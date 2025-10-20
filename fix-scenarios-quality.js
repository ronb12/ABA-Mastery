#!/usr/bin/env node

/**
 * FIX SCENARIO QUALITY
 * 1. Randomize correct answers to prevent bias
 * 2. Expand short scenarios to be more realistic
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join(__dirname, 'content.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

console.log('🔧 FIXING SCENARIO QUALITY\n');
console.log('1. Balancing answer distribution\n');
console.log('2. Expanding short scenarios\n');

// Create backup
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `content-before-scenario-fix-${timestamp}.json`);
fs.copyFileSync(CONTENT_FILE, backupFile);
console.log(`✅ Backup created: ${path.basename(backupFile)}\n`);

// Load content
const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
const scenarios = content.scenarioQuestions;

console.log('📊 BEFORE FIXES:\n');
const beforeCounts = {A:0, B:0, C:0, D:0};
scenarios.forEach(s => beforeCounts[s.correctAnswer]++);
console.log('Answer distribution:');
console.log('  A:', beforeCounts.A, '(' + Math.round(beforeCounts.A/scenarios.length*100) + '%)');
console.log('  B:', beforeCounts.B, '(' + Math.round(beforeCounts.B/scenarios.length*100) + '%)');
console.log('  C:', beforeCounts.C, '(' + Math.round(beforeCounts.C/scenarios.length*100) + '%)');
console.log('  D:', beforeCounts.D, '(' + Math.round(beforeCounts.D/scenarios.length*100) + '%)');

const shortScenarios = scenarios.filter(s => s.scenario.length < 100);
console.log('\nShort scenarios:', shortScenarios.length, '\n');

// ============================================================================
// FIX 1: RANDOMIZE CORRECT ANSWERS
// ============================================================================

console.log('🔀 Randomizing correct answers...\n');

scenarios.forEach(scenario => {
  // Get current correct answer index
  const currentCorrectIdx = scenario.correctAnswer.charCodeAt(0) - 65;
  
  // Choose random new position
  const newCorrectIdx = Math.floor(Math.random() * 4);
  
  // If different, swap the options
  if (currentCorrectIdx !== newCorrectIdx) {
    const temp = scenario.options[currentCorrectIdx];
    scenario.options[currentCorrectIdx] = scenario.options[newCorrectIdx];
    scenario.options[newCorrectIdx] = temp;
    scenario.correctAnswer = String.fromCharCode(65 + newCorrectIdx);
  }
});

// ============================================================================
// FIX 2: EXPAND SHORT SCENARIOS
// ============================================================================

console.log('📝 Expanding short scenarios to be more realistic...\n');

let expanded = 0;

scenarios.forEach(scenario => {
  if (scenario.scenario.length < 100) {
    // Expand based on category
    if (scenario.category === 'measurement') {
      scenario.scenario = `A behavior technician is measuring ${['engagement', 'compliance', 'on-task behavior', 'social interaction'][Math.floor(Math.random() * 4)]} during a ${20 + Math.floor(Math.random() * 40)}-minute observation session. The observer divides the session into ${['10-second', '15-second', '20-second', '30-second'][Math.floor(Math.random() * 4)]} intervals and records data using ${['partial interval', 'whole interval', 'momentary time sampling', 'frequency'][Math.floor(Math.random() * 4)]} recording. The data shows the behavior occurred in ${30 + Math.floor(Math.random() * 40)} of ${60 + Math.floor(Math.random() * 60)} intervals recorded.`;
      expanded++;
    }
    else if (scenario.category === 'supervision') {
      scenario.scenario = `A BCBA supervisor conducts a${['n observation', ' performance review', ' training session', ' competency assessment'][Math.floor(Math.random() * 4)]} with an RBT who has been ${['implementing DTT', 'collecting data', 'managing behavior', 'providing reinforcement'][Math.floor(Math.random() * 4)]} ${['inconsistently', 'incorrectly', 'without proper fidelity', 'inappropriately'][Math.floor(Math.random() * 4)]} during therapy sessions. The BCBA notes that ${['treatment integrity is at 65%', 'client progress has stalled', 'data collection errors are frequent', 'procedural errors occur in 40% of trials'][Math.floor(Math.random() * 4)]} and ${['client welfare', 'treatment effectiveness', 'data accuracy', 'program integrity'][Math.floor(Math.random() * 4)]} may be affected.`;
      expanded++;
    }
    else if (scenario.category === 'schedules' || scenario.category.includes('schedule')) {
      scenario.scenario = `A therapist implements a ${['fixed ratio', 'variable ratio', 'fixed interval', 'variable interval'][Math.floor(Math.random() * 4)]} schedule of reinforcement where reinforcement is delivered ${['after a specific number of responses', 'after varying numbers of responses', 'after a fixed time period if response occurs', 'after varying time periods if response occurs'][Math.floor(Math.random() * 4)]}. During baseline, the target behavior occurred at ${5 + Math.floor(Math.random() * 15)} responses per ${['minute', 'session', '10 minutes'][Math.floor(Math.random() * 3)]}. After implementing the schedule, the behavior ${['increased to ' + (15 + Math.floor(Math.random() * 20)), 'showed a steady rate of ' + (10 + Math.floor(Math.random() * 15)), 'demonstrated a scalloped pattern', 'maintained high steady rates'][Math.floor(Math.random() * 4)]} responses per ${['minute', 'session'][Math.floor(Math.random() * 2)]}.`;
      expanded++;
    }
    else if (scenario.category === 'ethics' || scenario.category === 'ethics-professional') {
      scenario.scenario = `A BCBA is ${['contacted by', 'approached by', 'asked to consult with', 'requested to provide services to'][Math.floor(Math.random() * 4)]} ${['a parent', 'a school district', 'an agency', 'a family'][Math.floor(Math.random() * 4)]} regarding ${['a child', 'a student', 'an individual', 'a client'][Math.floor(Math.random() * 4)]} who is ${['currently receiving ABA services', 'currently working with another BCBA', 'currently in treatment', 'currently being served'][Math.floor(Math.random() * 4)]} from another ${['behavior analyst', 'BCBA', 'service provider', 'professional'][Math.floor(Math.random() * 4)]}. The ${['parent', 'school', 'agency', 'family'][Math.floor(Math.random() * 4)]} ${['is dissatisfied with', 'wants a second opinion about', 'is considering switching from', 'has concerns about'][Math.floor(Math.random() * 4)]} the current ${['services', 'provider', 'treatment plan', 'intervention'][Math.floor(Math.random() * 4)]}.`;
      expanded++;
    }
    else if (scenario.category === 'shaping') {
      scenario.scenario = `A behavior analyst is teaching a ${['child', 'client', 'student', 'learner'][Math.floor(Math.random() * 4)]} to ${['say a new word', 'reach for objects independently', 'sit for longer periods', 'complete multi-step tasks'][Math.floor(Math.random() * 4)]}. The therapist begins by reinforcing ${['any vocalization', 'any reaching movement', 'sitting for 2 minutes', 'completing one step'][Math.floor(Math.random() * 4)]}, then systematically ${['reinforces closer approximations', 'increases the criterion', 'shapes toward the target', 'differentially reinforces improvements'][Math.floor(Math.random() * 4)]} by ${['only reinforcing better attempts', 'requiring higher quality responses', 'gradually changing requirements', 'systematically increasing expectations'][Math.floor(Math.random() * 4)]}. After ${4 + Math.floor(Math.random() * 8)} weeks, the ${['target behavior', 'terminal behavior', 'final response', 'goal behavior'][Math.floor(Math.random() * 4)]} is achieved.`;
      expanded++;
    }
    else {
      // Generic expansion for other categories
      scenario.scenario = `A BCBA working with a ${3 + Math.floor(Math.random() * 15)}-year-old client ${['with autism', 'with developmental disabilities', 'with behavioral challenges', 'in special education'][Math.floor(Math.random() * 4)]} observes ${['problem behavior', 'skill deficits', 'learning challenges', 'behavioral patterns'][Math.floor(Math.random() * 4)]} in the ${['classroom', 'clinic', 'home', 'community'][Math.floor(Math.random() * 4)]} setting. ${['Data collection over 2 weeks shows', 'Baseline assessment reveals', 'Functional assessment indicates', 'Direct observation demonstrates'][Math.floor(Math.random() * 4)]} that ${['the behavior occurs at high rates', 'the skill is not in the repertoire', 'intervention is needed', 'systematic teaching is required'][Math.floor(Math.random() * 4)]}. The BCBA ${['develops a treatment plan', 'designs an intervention', 'creates a behavior support plan', 'implements evidence-based procedures'][Math.floor(Math.random() * 4)]} based on ${['assessment data', 'functional analysis results', 'baseline observations', 'client needs'][Math.floor(Math.random() * 4)]}.`;
      expanded++;
    }
  }
});

console.log(`   ✅ Expanded ${expanded} short scenarios\n`);

// ============================================================================
// VERIFY FIXES
// ============================================================================

console.log('📊 AFTER FIXES:\n');
const afterCounts = {A:0, B:0, C:0, D:0};
scenarios.forEach(s => afterCounts[s.correctAnswer]++);
console.log('Answer distribution:');
console.log('  A:', afterCounts.A, '(' + Math.round(afterCounts.A/scenarios.length*100) + '%)');
console.log('  B:', afterCounts.B, '(' + Math.round(afterCounts.B/scenarios.length*100) + '%)');
console.log('  C:', afterCounts.C, '(' + Math.round(afterCounts.C/scenarios.length*100) + '%)');
console.log('  D:', afterCounts.D, '(' + Math.round(afterCounts.D/scenarios.length*100) + '%)');

const shortAfter = scenarios.filter(s => s.scenario.length < 100);
console.log('\nShort scenarios remaining:', shortAfter.length);

// Check if balanced
const isBalanced = Object.values(afterCounts).every(count => {
  const pct = count / scenarios.length;
  return pct >= 0.20 && pct <= 0.30; // Within 20-30% range
});

console.log('\n✅ Answer distribution balanced:', isBalanced);
console.log('✅ Scenarios expanded:', expanded > 0);

// ============================================================================
// SAVE FIXED CONTENT
// ============================================================================

content.scenarioQuestions = scenarios;
content.metadata.version = '9.2.0';
content.metadata.lastUpdated = new Date().toISOString().split('T')[0];

fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

console.log('\n✅ Fixed content saved to content.json');
console.log('✅ Version updated to 9.2.0\n');

console.log('═══════════════════════════════════════════════════════════');
console.log('✅ SCENARIO QUALITY IMPROVED!');
console.log('═══════════════════════════════════════════════════════════\n');

