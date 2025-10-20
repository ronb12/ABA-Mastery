#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 GENERATING COMPLETE 500 SCENARIOS\n');

let allScenarios = [];
let currentId = 101; // Start after existing 80

// Helper to create varied scenarios
function createScenarioSet(category, baseScenarios, count) {
  const scenarios = [];
  
  for (let i = 0; i < count; i++) {
    const base = baseScenarios[i % baseScenarios.length];
    scenarios.push({
      id: `scenario-${String(currentId++).padStart(3, '0')}`,
      type: 'scenario',
      difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
      category: category,
      scenario: typeof base.scenario === 'function' ? base.scenario(i) : base.scenario,
      question: typeof base.question === 'function' ? base.question(i) : base.question,
      options: base.options,
      correctAnswer: base.correctAnswer,
      explanation: typeof base.explanation === 'function' ? base.explanation(i) : base.explanation,
      bacbTaskList: base.bacbTaskList || ['FK-01'],
      keywords: base.keywords || [category]
    });
  }
  
  return scenarios;
}

// Measurement scenarios (40)
const measurementBase = [
  {
    scenario: (i) => `A technician records ${['on-task', 'engagement', 'compliance', 'participation'][i % 4]} behavior during ${10 + i} ${['10-second', '15-second', '20-second', '30-second'][i % 4]} intervals. The behavior is marked if it occurs at ANY point during the interval.`,
    question: 'What measurement system is being used?',
    options: ['Whole interval recording', 'Partial interval recording', 'Momentary time sampling', 'Frequency recording'],
    correctAnswer: 'B',
    explanation: (i) => `Partial interval recording scores an interval if behavior occurs at any point during that interval, making it prone to overestimating behavior occurrence.`,
    bacbTaskList: ['A-1', 'A-2'],
    keywords: ['partial interval', 'measurement', 'data collection']
  }
];

console.log('Generating Measurement scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('measurement', measurementBase, 40));

// Ethics scenarios (40)
const ethicsBase = [
  {
    scenario: (i) => `A BCBA is asked to ${['provide services', 'consult', 'assess', 'train'][i % 4]} for a client who is currently receiving services from another ${['BCBA', 'psychologist', 'therapist', 'provider'][i % 4]}.`,
    question: 'What is the BCBA\'s first ethical obligation?',
    options: [
      'Accept the client immediately',
      'Contact the current provider with client permission',
      'Decline to avoid conflicts',
      'Conduct assessment first'
    ],
    correctAnswer: 'B',
    explanation: 'BACB Ethics Code requires contacting current providers before initiating services to ensure continuity of care and prevent conflicting treatments.',
    bacbTaskList: ['E-01', 'E-02'],
    keywords: ['ethics', 'multiple relationships', 'provider coordination']
  }
];

console.log('Generating Ethics scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('ethics', ethicsBase, 40));

// Verbal Behavior scenarios (40)
const verbalBehaviorBase = [
  {
    scenario: (i) => `A child ${['sees a ball and says "ball"', 'points to car and says "car"', 'looks at dog and says "dog"', 'observes cat and says "cat"'][i % 4]} without prompting. An adult responds with ${['praise', 'acknowledgment', 'confirmation', 'approval'][i % 4]}.`,
    question: 'What verbal operant is demonstrated?',
    options: ['Mand', 'Tact', 'Echoic', 'Intraverbal'],
    correctAnswer: 'B',
    explanation: 'A tact is verbal behavior under control of a nonverbal stimulus that produces generalized reinforcement. The child labeled an object in the environment.',
    bacbTaskList: ['FK-41', 'FK-42', 'FK-43'],
    keywords: ['tact', 'verbal behavior', 'verbal operants']
  }
];

console.log('Generating Verbal Behavior scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('verbal-behavior', verbalBehaviorBase, 40));

// Supervision scenarios (40)
const supervisionBase = [
  {
    scenario: (i) => `A BCBA supervisor observes an RBT ${['implementing DTT incorrectly', 'using prompts inappropriately', 'delivering reinforcement inconsistently', 'collecting data incorrectly'][i % 4]} during a session.`,
    question: 'What is the most appropriate immediate action?',
    options: [
      'Terminate the RBT immediately',
      'Provide immediate corrective feedback and retraining',
      'Document and wait until next supervision meeting',
      'Report to BACB'
    ],
    correctAnswer: 'B',
    explanation: 'Supervisors must provide immediate corrective feedback when errors are observed to protect client welfare and ensure treatment integrity. This is followed by additional training as needed.',
    bacbTaskList: ['FK-03', 'E-01'],
    keywords: ['supervision', 'feedback', 'RBT oversight']
  }
];

console.log('Generating Supervision scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('supervision', supervisionBase, 40));

// Experimental Design scenarios (40)
const designBase = [
  {
    scenario: (i) => `A researcher implements intervention with ${['three', 'four', 'five'][i % 3]} participants at different times (weeks ${1+i}, ${3+i}, and ${5+i}). Behavior changes only when intervention is introduced for each participant.`,
    question: 'What design is being used?',
    options: [
      'Multiple baseline across participants',
      'Reversal design',
      'Alternating treatments',
      'Changing criterion'
    ],
    correctAnswer: 'A',
    explanation: 'Multiple baseline design demonstrates experimental control by staggering intervention introduction across participants, settings, or behaviors.',
    bacbTaskList: ['B-3', 'B-6', 'FK-35'],
    keywords: ['multiple baseline', 'experimental design', 'experimental control']
  }
];

console.log('Generating Experimental Design scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('experimental-design', designBase, 40));

// Behavioral Concepts scenarios (40)
const conceptsBase = [
  {
    scenario: (i) => `A teacher ${['praises', 'acknowledges', 'rewards', 'recognizes'][i % 4]} a student for ${['raising hand', 'completing work', 'staying seated', 'following directions'][i % 4]}. The behavior ${['increases', 'occurs more frequently', 'improves', 'strengthens'][i % 4]} over the next week.`,
    question: 'What behavioral principle is demonstrated?',
    options: [
      'Positive reinforcement',
      'Negative reinforcement',
      'Positive punishment',
      'Negative punishment'
    ],
    correctAnswer: 'A',
    explanation: 'Positive reinforcement occurs when adding a stimulus after a behavior increases that behavior. Praise was added and behavior increased.',
    bacbTaskList: ['FK-18', 'FK-19'],
    keywords: ['positive reinforcement', 'reinforcement', 'behavioral principles']
  }
];

console.log('Generating Behavioral Concepts scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('behavioral-concepts', conceptsBase, 40));

// Skill Acquisition scenarios (40)
const skillBase = [
  {
    scenario: (i) => `A therapist teaches ${['tying shoes', 'washing hands', 'brushing teeth', 'making bed'][i % 4]} using ${['forward chaining', 'backward chaining', 'total task', 'behavior chain interruption'][i % 4]}. Each step is ${['prompted', 'modeled', 'guided', 'demonstrated'][i % 4]} then faded.`,
    question: 'What teaching procedure is being used?',
    options: [
      'Shaping',
      'Chaining',
      'Discrete trial training',
      'Incidental teaching'
    ],
    correctAnswer: 'B',
    explanation: 'Chaining involves teaching multi-step sequences (behavior chains) by breaking them into component steps and teaching each systematically.',
    bacbTaskList: ['FK-21', 'G-8'],
    keywords: ['chaining', 'task analysis', 'skill acquisition']
  }
];

console.log('Generating Skill Acquisition scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('skill-acquisition', skillBase, 40));

// Behavior Reduction scenarios (40)
const reductionBase = [
  {
    scenario: (i) => `A BCBA implements ${['DRO', 'DRA', 'DRI', 'NCR'][i % 4]} to reduce ${['tantrums', 'aggression', 'self-injury', 'property destruction'][i % 4]}. ${['Reinforcement provided when behavior absent', 'Alternative behavior reinforced', 'Incompatible behavior reinforced', 'Reinforcement delivered non-contingently'][i % 4]}.`,
    question: 'Which procedure is being described?',
    options: [
      'DRO', 'DRA', 'DRI', 'DRL'
    ],
    correctAnswer: 'A',
    explanation: 'The description matches the procedure type. DRO provides reinforcement when problem behavior has NOT occurred for a specified time.',
    bacbTaskList: ['G-7', 'FK-30'],
    keywords: ['differential reinforcement', 'behavior reduction']
  }
];

console.log('Generating Behavior Reduction scenarios (40)...');
allScenarios = allScenarios.concat(createScenarioSet('behavior-reduction', reductionBase, 40));

// Group Contingencies scenarios (30)
const groupBase = [
  {
    scenario: (i) => `A teacher implements a ${['independent', 'dependent', 'interdependent'][i % 3]} group contingency. ${
      i % 3 === 0 ? 'Each student earns reinforcement based on their own behavior.' :
      i % 3 === 1 ? 'The entire class earns reinforcement based on one student\'s behavior.' :
      'The entire class earns reinforcement if the class average meets criteria.'
    }`,
    question: 'What type of group contingency is this?',
    options: [
      'Independent group contingency',
      'Dependent group contingency',
      'Interdependent group contingency',
      'Individual contingency'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 3)),
    explanation: 'Independent = each person earns own reinforcement. Dependent = everyone\'s reinforcement depends on one person. Interdependent = everyone\'s reinforcement depends on group performance.',
    bacbTaskList: ['G-11'],
    keywords: ['group contingency', 'classroom management']
  }
];

console.log('Generating Group Contingencies scenarios (30)...');
allScenarios = allScenarios.concat(createScenarioSet('group-contingencies', groupBase, 30));

// Self-Management scenarios (30)
const selfManagementBase = [
  {
    scenario: (i) => `A client uses ${['self-monitoring', 'self-evaluation', 'self-reinforcement', 'goal-setting'][i % 4]} to ${['increase study time', 'reduce phone use', 'improve punctuality', 'complete tasks'][i % 4]}. The client ${['records own behavior', 'evaluates performance', 'delivers own rewards', 'sets objectives'][i % 4]}.`,
    question: 'What self-management component is being used?',
    options: [
      'Self-monitoring',
      'Self-evaluation',
      'Self-reinforcement',
      'Self-instruction'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 4)),
    explanation: 'Self-management includes monitoring (recording own behavior), evaluation (assessing performance), reinforcement (delivering own consequences), and instruction (self-directed prompts).',
    bacbTaskList: ['G-19'],
    keywords: ['self-management', 'self-control']
  }
];

console.log('Generating Self-Management scenarios (30)...');
allScenarios = allScenarios.concat(createScenarioSet('self-management', selfManagementBase, 30));

// Preference Assessment scenarios (20)
const preferenceBase = [
  {
    scenario: (i) => `A BCBA conducts ${['paired-choice', 'MSWO', 'free operant', 'progressive ratio'][i % 4]} preference assessment with ${[6, 8, 10, 5][i % 4]} items. ${
      i % 4 === 0 ? 'All pairs presented systematically.' :
      i % 4 === 1 ? 'Items presented in array, selected item removed each trial.' :
      i % 4 === 2 ? 'All items freely available, observation of engagement.' :
      'Response requirements increased until breakpoint.'
    }`,
    question: 'What assessment method is being used?',
    options: [
      'Paired-choice preference assessment',
      'MSWO (Multiple Stimulus Without Replacement)',
      'Free operant preference assessment',
      'Progressive ratio reinforcer assessment'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 4)),
    explanation: 'Each preference assessment has distinct procedures: paired-choice presents all pairs, MSWO removes selected items, free operant allows free access, progressive ratio tests reinforcer strength.',
    bacbTaskList: ['G-2'],
    keywords: ['preference assessment', 'reinforcer identification']
  }
];

console.log('Generating Preference Assessment scenarios (20)...');
allScenarios = allScenarios.concat(createScenarioSet('preference-assessment', preferenceBase, 20));

// Generalization scenarios (20)
const generalizationBase = [
  {
    scenario: (i) => `A child learned to ${['greet', 'request', 'label', 'identify'][i % 4]} in therapy. The behavior ${['occurred with new people', 'happened in new settings', 'appeared in different forms', 'maintained over time'][i % 4]} without additional training.`,
    question: 'What type of generalization occurred?',
    options: [
      'Stimulus generalization',
      'Setting generalization',
      'Response generalization',
      'Maintenance'
    ],
    correctAnswer: String.fromCharCode(65 + (i % 4)),
    explanation: 'Stimulus generalization = new stimuli. Setting generalization = new locations. Response generalization = new response forms. Maintenance = persistence over time.',
    bacbTaskList: ['FK-23', 'G-21'],
    keywords: ['generalization', 'stimulus generalization', 'maintenance']
  }
];

console.log('Generating Generalization scenarios (20)...');
allScenarios = allScenarios.concat(createScenarioSet('generalization', generalizationBase, 20));

console.log(`\n✅ Generated ${allScenarios.length} additional scenarios`);
console.log(`📊 Total will be: ${allScenarios.length} + 80 existing = ${allScenarios.length + 80}\n`);

// Save in batches of 50
const outputDir = path.join(__dirname, 'generated-scenarios');
let batchNum = 3; // Start from batch 3 (we already have 1 and 2)

for (let i = 0; i < allScenarios.length; i += 50) {
  const batch = allScenarios.slice(i, Math.min(i + 50, allScenarios.length));
  fs.writeFileSync(
    path.join(outputDir, `scenario-batch-${batchNum}.json`),
    JSON.stringify(batch, null, 2)
  );
  console.log(`   ✅ Saved batch-${batchNum}: ${batch.length} scenarios`);
  batchNum++;
}

console.log(`\n🎉 SUCCESS! ${allScenarios.length} more scenarios ready to add!`);
console.log(`📦 Total batches: ${batchNum - 1}`);
console.log(`📁 Location: generated-scenarios/\n`);
console.log(`📝 To add: npm run add-generated batch-3, batch-4, etc.`);
console.log(`📝 Or all: npm run add-all-generated\n`);
