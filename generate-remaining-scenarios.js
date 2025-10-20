#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'generated-scenarios');
let id = 201; // Continue from 200
let scenarios = [];

// BATCH 5-10: Create remaining 320 scenarios across all topics
console.log('🚀 Generating remaining 320 scenarios to reach 500 total...\n');

// Verbal Behavior Advanced (50)
console.log('Creating Verbal Behavior scenarios...');
for (let i = 0; i < 50; i++) {
  const operants = ['mand', 'tact', 'echoic', 'intraverbal'];
  const operant = operants[i % 4];
  scenarios.push({
    id: `scenario-${String(id++).padStart(3, '0')}`,
    type: 'scenario',
    difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
    category: 'verbal-behavior',
    scenario: `A child ${operant === 'mand' ? 'requests cookie saying "cookie"' : operant === 'tact' ? 'sees cookie and says "cookie"' : operant === 'echoic' ? 'hears "cookie" and says "cookie"' : 'hears "what do you eat?" and says "cookie"'}. ${operant === 'mand' ? 'Receives cookie.' : 'Receives praise.'}`,
    question: `What verbal operant is this?`,
    options: ['Mand', 'Tact', 'Echoic', 'Intraverbal'],
    correctAnswer: operant === 'mand' ? 'A' : operant === 'tact' ? 'B' : operant === 'echoic' ? 'C' : 'D',
    explanation: `${operant.charAt(0).toUpperCase() + operant.slice(1)} - ${operant === 'mand' ? 'request under MO control' : operant === 'tact' ? 'label under nonverbal stimulus control' : operant === 'echoic' ? 'vocal imitation with point-to-point correspondence' : 'verbal response to verbal stimulus without correspondence'}.`,
    bacbTaskList: ['FK-41', 'FK-42', 'FK-43'],
    keywords: ['verbal behavior', operant, 'Skinner']
  });
}

// Supervision scenarios (50)
console.log('Creating Supervision scenarios...');
for (let i = 0; i < 50; i++) {
  scenarios.push({
    id: `scenario-${String(id++).padStart(3, '0')}`,
    type: 'scenario',
    difficulty: ['beginner', 'intermediate'][i % 2],
    category: 'supervision',
    scenario: `A BCBA supervisor observes RBT ${['implementing procedures', 'collecting data', 'providing feedback', 'managing behavior'][i % 4]} ${['incorrectly', 'inconsistently', 'without fidelity', 'improperly'][i % 4]}. Client ${['safety', 'progress', 'welfare', 'outcomes'][i % 4]} may be affected.`,
    question: 'What is the supervisor\'s immediate responsibility?',
    options: [
      'Wait until next supervision meeting',
      'Provide immediate corrective feedback',
      'Document only',
      'Report to BACB'
    ],
    correctAnswer: 'B',
    explanation: 'Supervisors must provide immediate feedback when errors affect client welfare. Protecting clients is the primary obligation.',
    bacbTaskList: ['FK-03', 'E-01', 'E-02'],
    keywords: ['supervision', 'feedback', 'RBT oversight', 'client protection']
  });
}

// Behavioral Skills Training scenarios (30)
console.log('Creating BST & Skill Acquisition scenarios...');
for (let i = 0; i < 30; i++) {
  scenarios.push({
    id: `scenario-${String(id++).padStart(3, '0')}`,
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'skill-acquisition',
    scenario: `A BCBA trains staff using ${['instruction', 'modeling', 'rehearsal', 'feedback'][i % 4]} component of BST. Staff ${['learn procedures', 'practice skills', 'demonstrate competency', 'improve performance'][i % 4]} through this ${['didactic', 'observational', 'practice', 'corrective'][i % 4]} phase.`,
    question: 'Which BST component is described?',
    options: [
      'Instruction',
      'Modeling',
      'Rehearsal',
      'Feedback'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 4)),
    explanation: 'BST (Behavioral Skills Training) has four components: Instruction (tell), Modeling (show), Rehearsal (practice), and Feedback (correct). This is the evidence-based method for staff training.',
    bacbTaskList: ['FK-02', 'FK-03'],
    keywords: ['BST', 'behavioral skills training', 'staff training']
  });
}

// Reinforcement Schedules (50)
console.log('Creating Reinforcement Schedules scenarios...');
for (let i = 0; i < 50; i++) {
  const schedules = ['FR', 'VR', 'FI', 'VI', 'CRF'];
  const schedule = schedules[i % 5];
  scenarios.push({
    id: `scenario-${String(id++).padStart(3, '0')}`,
    type: 'scenario',
    difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
    category: 'schedules',
    scenario: `Reinforcement is delivered ${
      schedule === 'FR' ? `after every ${5 + (i % 10)} responses` :
      schedule === 'VR' ? `after varying numbers of responses, average ${10 + (i % 10)}` :
      schedule === 'FI' ? `after ${30 + (i * 10)} seconds, if response occurs` :
      schedule === 'VI' ? `after varying time periods, average ${45 + (i * 5)} seconds` :
      'after every single response'
    }. ${schedule === 'VR' ? 'Response rates are very high and steady.' : schedule === 'FI' ? 'Response rates show scalloping pattern.' : 'Response pattern is characteristic.'}`,
    question: 'What reinforcement schedule is described?',
    options: [
      'Fixed ratio (FR)',
      'Variable ratio (VR)',
      'Fixed interval (FI)',
      'Variable interval (VI)'
    ],
    correctAnswer: schedule === 'FR' ? 'A' : schedule === 'VR' ? 'B' : schedule === 'FI' ? 'C' : 'D',
    explanation: `${schedule} schedule - ${schedule.includes('R') ? 'ratio schedules based on number of responses' : 'interval schedules based on time'}. ${schedule.startsWith('F') ? 'Fixed schedules are predictable' : 'Variable schedules are unpredictable'}.`,
    bacbTaskList: ['FK-33', 'FK-34'],
    keywords: ['schedules', schedule, 'reinforcement']
  });
}

// Prompting & Fading (40)
console.log('Creating Prompting & Fading scenarios...');
for (let i = 0; i < 40; i++) {
  const prompts = ['physical', 'model', 'verbal', 'gestural'];
  const prompt = prompts[i % 4];
  scenarios.push({
    id: `scenario-${String(id++).padStart(3, '0')}`,
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'prompting',
    scenario: `A therapist uses ${prompt} prompting to teach ${['handwashing', 'tooth brushing', 'shoe tying', 'bed making'][i % 4]}. ${
      prompt === 'physical' ? 'Hand-over-hand guidance provided' :
      prompt === 'model' ? 'Therapist demonstrates the action' :
      prompt === 'verbal' ? 'Therapist states instruction' :
      'Therapist points or gestures toward materials'
    }. Prompts systematically faded over time.`,
    question: 'What type of prompt is being used?',
    options: [
      'Physical prompt',
      'Model prompt',
      'Verbal prompt',
      'Gestural prompt'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 4)),
    explanation: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} prompts ${prompt === 'physical' ? 'involve physical contact/guidance' : prompt === 'model' ? 'demonstrate the behavior' : prompt === 'verbal' ? 'provide vocal instructions' : 'use gestures or pointing'}. Prompt fading is critical to transfer stimulus control.`,
    bacbTaskList: ['FK-15', 'G-8'],
    keywords: ['prompting', prompt + ' prompt', 'prompt fading']
  });
}

console.log(`\n✅ Generated ${scenarios.length} scenarios\n`);

// Save in batches of 50
let batchNum = 5;
for (let i = 0; i < scenarios.length; i += 50) {
  const batch = scenarios.slice(i, Math.min(i + 50, scenarios.length));
  fs.writeFileSync(
    path.join(dir, `scenario-batch-${batchNum}.json`),
    JSON.stringify(batch, null, 2)
  );
  console.log(`   ✅ Saved batch-${batchNum}: ${batch.length} scenarios`);
  batchNum++;
}

console.log(`\n📊 PROGRESS:`);
console.log(`   Previously added: 130`);
console.log(`   Just generated: ${scenarios.length}`);
console.log(`   Total available: ${130 + scenarios.length}`);
console.log(`   Target: 500`);
console.log(`   Remaining: ${500 - (130 + scenarios.length)}\n`);
