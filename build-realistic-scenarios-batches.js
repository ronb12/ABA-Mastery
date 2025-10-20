#!/usr/bin/env node

/**
 * BUILD REALISTIC SCENARIOS IN BATCHES
 * Creates 500 professional clinical scenarios in batches of 50
 * Each batch is saved separately for progressive addition
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'realistic-scenarios-batches');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

console.log('🔄 BUILDING 500 REALISTIC SCENARIOS IN BATCHES\n');

// ============================================================================
// REUSABLE DATA FOR REALISTIC SCENARIOS
// ============================================================================

const clientAges = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 22, 25, 30];
const diagnoses = [
  'autism spectrum disorder',
  'developmental disabilities',
  'intellectual disability',
  'ADHD',
  'oppositional defiant disorder',
  'Down syndrome',
  'cerebral palsy',
  'learning disabilities'
];
const settings = [
  'special education classroom',
  'general education classroom',
  'ABA clinic',
  'home',
  'community setting',
  'residential facility',
  'after-school program',
  'inclusive preschool'
];

// ============================================================================
// BATCH 1: FUNCTIONAL ASSESSMENT - ESCAPE FUNCTION (50)
// ============================================================================

function generateBatch1_EscapeScenarios() {
  const scenarios = [];
  
  for (let i = 0; i < 50; i++) {
    const age = clientAges[Math.floor(Math.random() * clientAges.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const setting = settings[Math.floor(Math.random() * settings.length)];
    const behaviors = ['hitting', 'screaming', 'throwing materials', 'leaving area', 'flopping to ground', 'pushing away materials'];
    const behavior = behaviors[i % behaviors.length];
    const tasks = ['math problems', 'reading assignments', 'writing tasks', 'homework', 'cleaning up', 'transitioning'];
    const task = tasks[i % tasks.length];
    const highRate = 12 + Math.floor(Math.random() * 20);
    const lowRate = Math.floor(Math.random() * 3);
    const weeks = 1 + Math.floor(i / 10);
    
    scenarios.push({
      id: `scenario-${String(i + 1).padStart(3, '0')}`,
      type: 'scenario',
      difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
      category: 'functional-assessment',
      scenario: `A BCBA is consulting with a ${age}-year-old client with ${diagnosis} in a ${setting}. The client engages in ${behavior} behavior that is disrupting ${['learning', 'therapy sessions', 'classroom instruction', 'daily activities'][i % 4]}. ABC data collected over ${weeks} ${weeks === 1 ? 'week' : 'weeks'} (${5 + i} observation sessions) shows ${behavior} occurs an average of ${highRate} times per ${['30-minute session', 'hour', '45-minute period'][i % 3]} during ${task}. When ${['the task is removed', 'a break is provided', 'task difficulty is reduced', 'the activity is terminated', 'demands are paused'][i % 5]}, the ${behavior} behavior immediately ${['stops', 'decreases to near-zero', 'terminates within 10 seconds', 'ceases'][i % 4]}. During ${['preferred activities like art class', 'free play with toys', 'choice time', 'leisure activities', 'preferred subjects'][i % 5]}, ${behavior} occurs only ${lowRate} ${lowRate <= 1 ? 'time' : 'times'} per session. The ${['teacher', 'parent', 'therapist', 'staff'][i % 4]} reports the behavior is ${['significantly worse', 'most problematic', 'highest', 'most frequent'][i % 4]} during ${['difficult', 'non-preferred', 'challenging', 'new'][i % 4]} ${task}.`,
      question: `Based on this ABC data pattern and the antecedent-behavior-consequence relationships observed, what function is the ${behavior} behavior most likely serving?`,
      options: [
        'Access to preferred tangible items or activities',
        'Escape or avoidance of aversive tasks or demands',
        'Access to social attention from adults or peers',
        'Automatic or sensory reinforcement'
      ],
      correctAnswer: 'B',
      explanation: `The data strongly indicates an escape function maintained by negative reinforcement. Multiple converging evidence points support this conclusion: (1) The behavior occurs at elevated rates (${highRate} per session) specifically and consistently during non-preferred or difficult academic tasks (${task}), showing clear antecedent control, (2) The behavior reliably terminates or produces removal of the aversive task, demonstrating the maintaining consequence (negative reinforcement), (3) The behavior rate is near-zero (${lowRate} instances) during preferred activities when escape is not relevant, (4) The pattern is consistent across ${weeks} ${weeks === 1 ? 'week' : 'weeks'} of systematic observation. This is a textbook example of escape-maintained behavior. Alternative hypotheses are not supported: Automatic reinforcement would show similar rates across all conditions regardless of task demands. Attention function would show increases when attention is provided contingent on behavior. Tangible function would correlate with presence/absence of specific items, not task demands. The functional relationship between demands and behavior termination clearly indicates escape as the maintaining variable.`,
      bacbTaskList: ['FK-31', 'G-1', 'G-2', 'FK-19'],
      keywords: ['escape function', 'negative reinforcement', 'ABC data analysis', 'functional assessment', 'demand avoidance']
    });
  }
  
  return scenarios;
}

// ============================================================================
// BATCH 2: FUNCTIONAL ASSESSMENT - ATTENTION FUNCTION (50)
// ============================================================================

function generateBatch2_AttentionScenarios() {
  const scenarios = [];
  
  for (let i = 0; i < 50; i++) {
    const age = clientAges[Math.floor(Math.random() * clientAges.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const setting = settings[Math.floor(Math.random() * settings.length)];
    const behaviors = ['calling out', 'making noises', 'inappropriate comments', 'interrupting', 'silly behavior', 'dropping materials'];
    const behavior = behaviors[i % behaviors.length];
    const highRate = 15 + Math.floor(Math.random() * 25);
    const lowRate = 1 + Math.floor(Math.random() * 3);
    
    scenarios.push({
      id: `scenario-${String(51 + i).padStart(3, '0')}`,
      type: 'scenario',
      difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
      category: 'functional-assessment',
      scenario: `A ${age}-year-old ${['student', 'client', 'child'][i % 3]} with ${diagnosis} in a ${setting} engages in ${behavior} that ${['disrupts', 'interferes with', 'interrupts'][i % 3]} ${['instruction', 'therapy', 'classroom activities'][i % 3]}. Systematic ABC data collection across ${10 + i} sessions reveals ${behavior} occurs ${highRate} times per ${['hour', '30-minute session', '45-minute period'][i % 3]} when ${['the teacher is working with other students', 'staff attention is directed to others', 'the therapist is taking data', 'parents are busy with siblings', 'adults are engaged in other activities'][i % 5]}. When ${behavior} occurs, ${['the teacher provides a verbal redirect', 'staff look at and speak to the client', 'parents tell them to stop', 'the therapist provides corrective feedback', 'adults approach and interact with the client'][i % 5]} ${['immediately', 'within 5-10 seconds', 'consistently'][i % 3]}. During ${['one-on-one instruction', 'individual therapy sessions', 'dyadic interactions', 'times when adult attention is continuously available'][i % 4]}, ${behavior} occurs only ${lowRate} ${lowRate === 1 ? 'time' : 'times'} per session. The ${['teacher', 'therapist', 'parent', 'staff member'][i % 4]} reports that ${behavior} ${['almost always results in', 'typically produces', 'reliably leads to', 'consistently generates'][i % 4]} ${['adult interaction', 'staff response', 'social contact'][i % 3]}.`,
      question: `What is the most likely maintaining variable (function) for this ${behavior} behavior?`,
      options: [
        'Escape or avoidance of task demands',
        'Access to preferred tangible items',
        'Access to social attention from adults or peers',
        'Automatic reinforcement (sensory stimulation)'
      ],
      correctAnswer: 'C',
      explanation: `The data pattern clearly indicates an attention function maintained by positive reinforcement (access to social attention). Converging evidence includes: (1) Temporal pattern: Behavior occurs at high rates (${highRate} per session) specifically when adult attention is diverted to others or unavailable, demonstrating antecedent control by attention deprivation, (2) Consequence: The behavior reliably produces social attention (redirects, reprimands, corrections - all are forms of attention), even though the attention may be intended as "negative," it functions as reinforcement if behavior persists, (3) Absence pattern: Low rates (${lowRate} instances) during one-on-one activities when attention is already continuously available, (4) Consistency: Pattern observed across multiple sessions and settings. This is not escape (would correlate with task demands), not tangible (would correlate with specific items), and not automatic (would occur similarly with and without social consequences). The functional relationship between low attention (antecedent) → problem behavior → attention provided (consequence) demonstrates a clear attention function.`,
      bacbTaskList: ['FK-31', 'G-1', 'G-2', 'FK-18'],
      keywords: ['attention function', 'positive reinforcement', 'social attention', 'ABC analysis', 'attention-maintained behavior']
    });
  }
  
  return scenarios;
}

// ============================================================================
// BATCH 3: INTERVENTION DESIGN - FCT (50)
// ============================================================================

function generateBatch3_FCTScenarios() {
  const scenarios = [];
  
  for (let i = 0; i < 50; i++) {
    const age = clientAges[Math.floor(Math.random() * clientAges.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const behavior = ['aggression', 'tantrums', 'self-injury', 'property destruction', 'screaming'][i % 5];
    const function_type = ['escape', 'attention', 'tangible'][i % 3];
    const baseline = 15 + Math.floor(Math.random() * 20);
    const mands = {
      escape: ['break please', 'help please', 'all done', 'I need a break'],
      attention: ['come here please', 'look at me', 'help me', 'I need help'],
      tangible: ['can I have it please', 'I want [item]', 'may I use that', 'can I play with that']
    };
    
    scenarios.push({
      id: `scenario-${String(101 + i).padStart(3, '0')}`,
      type: 'scenario',
      difficulty: ['intermediate', 'advanced'][i % 2],
      category: 'intervention-design',
      scenario: `A comprehensive functional assessment has been completed for a ${age}-year-old client with ${diagnosis} who engages in ${behavior} at a rate of ${baseline} instances per ${['hour', 'session', 'day'][i % 3]} in ${['school', 'clinic', 'home'][i % 3]} settings. The functional analysis results clearly demonstrate that the behavior is maintained by ${function_type === 'escape' ? 'negative reinforcement (escape from aversive academic or task demands)' : function_type === 'attention' ? 'positive reinforcement (access to social attention from staff, teachers, or parents)' : 'positive reinforcement (access to preferred tangible items or activities)'}. Treatment integrity data from baseline shows ${behavior} ${['successfully produces', 'reliably results in', 'consistently leads to'][i % 3]} ${function_type === 'escape' ? 'task removal or break provision' : function_type === 'attention' ? 'adult attention and interaction' : 'access to desired items'} in ${60 + Math.floor(Math.random() * 25)}% of occurrences. The client currently has ${['minimal expressive language', 'limited communication skills', 'emerging verbal repertoire', 'functional communication deficits'][i % 4]} and ${['does not appropriately', 'cannot functionally', 'has not learned to'][i % 3]} ${['request', 'mand for', 'communicate need for'][i % 3]} ${function_type === 'escape' ? 'breaks or assistance' : function_type === 'attention' ? 'attention or help' : 'preferred items'}. The ${['treatment team', 'IEP team', 'behavior support team', 'interdisciplinary team'][i % 4]} wants to implement an evidence-based, function-matched intervention.`,
      question: `Which intervention approach would be MOST appropriate as the primary component of a function-based treatment plan for this ${function_type}-maintained ${behavior}?`,
      options: [
        'Response cost: Systematic removal of tokens or privileges contingent on each instance of problem behavior',
        'Time-out from positive reinforcement: 5-minute exclusion contingent on problem behavior',
        `Functional Communication Training (FCT): Systematically teach and reinforce appropriate manding for ${function_type === 'escape' ? 'breaks ("${mands.escape[i % 4]}")' : function_type === 'attention' ? 'attention ("${mands.attention[i % 4]}")' : 'items ("${mands.tangible[i % 4]}")'} combined with extinction for problem behavior`,
        'Noncontingent reinforcement (NCR): Deliver reinforcement on fixed-time schedule independent of behavior'
      ],
      correctAnswer: 'C',
      explanation: `Functional Communication Training (FCT) is the evidence-based, first-line intervention for ${function_type}-maintained problem behavior, as established by Carr and Durand's landmark 1985 JABA study and extensive subsequent research. FCT is appropriate here because: (1) It directly addresses the behavioral function by teaching a functionally equivalent communication response (mand) that produces the same reinforcer (${function_type === 'escape' ? 'breaks/assistance' : function_type === 'attention' ? 'attention/help' : 'access to items'}) as the problem behavior, (2) It teaches a socially appropriate skill that benefits the client long-term, replacing problem behavior with functional communication, (3) Research shows FCT highly effective when combined with extinction for the problem behavior (median 90%+ reduction), (4) It matches the client's skill level by teaching communication at an appropriate modality. The other options are problematic: Response cost and time-out are punishment-based procedures that don't teach alternative skills, may worsen ${function_type === 'escape' ? 'escape-maintained behavior' : function_type + '-maintained behavior'} (adding aversives when function is ${function_type === 'escape' ? 'escape' : 'not escape-related'}), and don't address the skill deficit. NCR may reduce motivation temporarily but doesn't teach functional communication and may not be as effective as FCT. Current best practice guidelines prioritize skill-teaching interventions like FCT over punishment procedures.`,
      bacbTaskList: ['G-4', 'G-7', 'FK-24', 'FK-42', 'E-01'],
      keywords: ['FCT', 'functional communication training', function_type + ' function', 'mand training', 'function-based intervention', 'replacement behavior']
    });
  }
  
  return scenarios;
}

// ============================================================================
// BATCH 2: INTERVENTION DESIGN - DRA/DRI/DRO (50)
// ============================================================================

function generateBatch2_DifferentialReinforcementScenarios() {
  const scenarios = [];
  
  for (let i = 0; i < 50; i++) {
    const procedure = ['DRA', 'DRI', 'DRO', 'DRL'][i % 4];
    const age = clientAges[Math.floor(Math.random() * clientAges.length)];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const behavior = ['hand-biting', 'screaming', 'hitting', 'leaving seat', 'talking out'][i % 5];
    const baseline = 20 + Math.floor(Math.random() * 25);
    
    scenarios.push({
      id: `scenario-${String(51 + i).padStart(3, '0')}`,
      type: 'scenario',
      difficulty: 'intermediate',
      category: 'intervention-design',
      scenario: `A behavior intervention plan is being developed for a ${age}-year-old client with ${diagnosis} who engages in ${behavior} at a baseline rate of ${baseline} instances per ${['hour', 'session', 'day'][i % 3]} in ${['classroom', 'clinic', 'home'][i % 3]} settings. Functional assessment data indicates the behavior is maintained by ${['attention', 'escape', 'tangible'][i % 3]} function. The BCBA recommends implementing ${procedure} (Differential Reinforcement of ${procedure === 'DRA' ? 'Alternative' : procedure === 'DRI' ? 'Incompatible' : procedure === 'DRO' ? 'Other' : 'Low rates'} behavior). ${
        procedure === 'DRA' ? `The plan specifies teaching and reinforcing ${['raising hand appropriately', 'using a communication card', 'verbally requesting assistance', 'asking for help politely'][i % 4]} to access the same functional reinforcer, while implementing extinction (no reinforcement) for ${behavior}.` :
        procedure === 'DRI' ? `The plan specifies reinforcing ${['keeping hands folded on desk', 'sitting with hands in lap', 'holding a fidget toy', 'manipulating appropriate materials'][i % 4]}, which is physically incompatible with ${behavior}, while withholding reinforcement for the problem behavior.` :
        procedure === 'DRO' ? `The plan specifies delivering reinforcement every ${[2, 3, 5, 8][i % 4]} minutes IF ${behavior} has NOT occurred during that interval. If ${behavior} occurs, the timer resets to zero and no reinforcement is delivered for that interval.` :
        `The plan specifies providing reinforcement when ${behavior} occurs at rates lower than ${baseline} per hour. Initially, criterion set at fewer than ${baseline - 5} instances per hour, with gradual reduction of criterion over time.`
      } Data collection procedures include ${['frequency recording', 'interval recording', 'duration recording'][i % 3]} of both ${['problem and appropriate behavior', 'target and replacement responses'][i % 2]}.`,
      question: `Which statement best describes the correct implementation of this ${procedure} procedure?`,
      options: [
        procedure === 'DRA' ? 'Provide reinforcement for alternative behavior that serves same function; withhold reinforcement (extinction) for problem behavior' : 'Implement the procedure exactly as described in the plan',
        procedure === 'DRI' ? 'Provide reinforcement for behavior physically incompatible with problem behavior; withhold reinforcement for problem behavior' : 'Monitor data and adjust as needed',
        procedure === 'DRO' ? 'Provide reinforcement for absence of problem behavior during specified intervals; reset interval if problem behavior occurs' : 'Ensure treatment integrity above 80%',
        procedure === 'DRL' ? 'Provide reinforcement when behavior occurs below criterion rate; gradually lower criterion over time' : 'Use punishment if differential reinforcement insufficient'
      ],
      correctAnswer: 'A',
      explanation: `${
        procedure === 'DRA' ? `DRA (Differential Reinforcement of Alternative behavior) is most effective when: (1) The alternative behavior is functionally equivalent (produces the same reinforcer as problem behavior), (2) Reinforcement is provided consistently for alternative behavior, (3) Extinction is implemented for problem behavior (critical component often omitted), (4) The alternative is easier/more efficient than problem behavior. The differential between reinforced alternative and extinguished problem behavior drives behavior change. Common error: Reinforcing alternative without extinction often results in both behaviors occurring. DRA is considered gold standard for function-based treatment because it teaches appropriate skills while reducing problem behavior.` :
        procedure === 'DRI' ? `DRI (Differential Reinforcement of Incompatible behavior) works by reinforcing a behavior that cannot physically occur at the same time as the problem behavior. Examples: Hands folded is incompatible with hitting; sitting is incompatible with running. The incompatibility ensures problem behavior decreases as the reinforced behavior increases. However, DRI doesn't teach a functionally equivalent communication response, so it may be less effective than DRA for behaviors with social functions. Best used when teaching a specific incompatible behavior is clinically appropriate.` :
        procedure === 'DRO' ? `DRO (Differential Reinforcement of Other behavior) provides reinforcement based solely on the absence of problem behavior during specified time intervals, regardless of what other behaviors occur. Implementation requires: (1) Setting initial interval based on baseline (often shorter than average inter-response time), (2) Using timer visible to implementer, (3) Resetting timer if problem behavior occurs (critical), (4) Systematically thinning interval as behavior improves (e.g., 2 min → 3 min → 5 min → 10 min). DRO is effective but doesn't teach specific replacement skills. Often combined with other procedures.` :
        `DRL (Differential Reinforcement of Low rates) is used when the goal is reduction (not elimination) of behavior. Criterion is set below baseline but above zero. For example, if baseline is ${baseline} per hour, initial criterion might be ${baseline - 5}, then ${baseline - 10}, gradually approaching acceptable level. DRL is appropriate when behavior serves important function but occurs excessively (e.g., question-asking, social initiations).`
      } Punishment should not be first-line treatment when differential reinforcement approaches are available and appropriate. The BACB Ethics Code requires using least restrictive effective interventions.`,
      bacbTaskList: ['G-7', 'FK-30', 'FK-31', 'E-01'],
      keywords: [procedure, 'differential reinforcement', 'behavior reduction', 'positive behavior support']
    });
  }
  
  return scenarios;
}

// ============================================================================
// BATCH GENERATION ORCHESTRATOR
// ============================================================================

function generateBatch(batchNumber) {
  console.log(`📝 Generating Batch ${batchNumber}...\n`);
  
  let scenarios = [];
  
  switch(batchNumber) {
    case 1:
      scenarios = generateBatch1_EscapeScenarios();
      console.log(`   ✅ Created 50 escape function scenarios (FA)\n`);
      break;
    case 2:
      scenarios = generateBatch2_AttentionScenarios();
      console.log(`   ✅ Created 50 attention function scenarios (FA)\n`);
      break;
    case 3:
      scenarios = generateBatch3_FCTScenarios();
      console.log(`   ✅ Created 50 FCT scenarios\n`);
      break;
    case 4:
      scenarios = generateBatch2_DifferentialReinforcementScenarios();
      console.log(`   ✅ Created 50 differential reinforcement scenarios\n`);
      break;
    default:
      console.log(`   ⚠️  Batch ${batchNumber} not yet implemented\n`);
      console.log(`   📝 Need to create generators for batches 5-10\n`);
      return null;
  }
  
  // Save batch
  const filename = path.join(OUTPUT_DIR, `realistic-batch-${batchNumber}.json`);
  fs.writeFileSync(filename, JSON.stringify(scenarios, null, 2));
  console.log(`   💾 Saved to: realistic-batch-${batchNumber}.json\n`);
  
  return scenarios;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'all') {
    console.log('🚀 GENERATING ALL AVAILABLE BATCHES (1-4 = 200 scenarios)\n');
    let totalScenarios = 0;
    
    for (let i = 1; i <= 4; i++) {
      const batch = generateBatch(i);
      if (batch) totalScenarios += batch.length;
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ SUCCESS! Generated ${totalScenarios} realistic scenarios`);
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📁 Saved to: realistic-scenarios-batches/\n`);
    return;
  }
  
  const batchNum = parseInt(command) || 0;
  
  if (!batchNum || batchNum === 0) {
    console.log('📚 REALISTIC SCENARIO BATCH GENERATOR\n');
    console.log('Usage: node build-realistic-scenarios-batches.js [batch-number]\n');
    console.log('Available batches:\n');
    console.log('  1: Escape function scenarios (50)');
    console.log('  2: Attention function scenarios (50)');
    console.log('  3: FCT intervention scenarios (50)');
    console.log('  4: DRA/DRI/DRO scenarios (50)');
    console.log('  5-10: Additional batches (to be implemented)\n');
    console.log('Or use: all  (generates batches 1-4 = 200 scenarios)\n');
    console.log('Examples:\n');
    console.log('  node build-realistic-scenarios-batches.js 1');
    console.log('  node build-realistic-scenarios-batches.js all\n');
    return;
  }
  
  if (args[0] === 'all') {
    console.log('🚀 GENERATING ALL AVAILABLE BATCHES (1-4 = 200 scenarios)\n');
    let totalScenarios = 0;
    
    for (let i = 1; i <= 4; i++) {
      const batch = generateBatch(i);
      if (batch) totalScenarios += batch.length;
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ SUCCESS! Generated ${totalScenarios} realistic scenarios`);
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📁 Saved to: realistic-scenarios-batches/\n`);
    console.log(`📝 To add to app: Use the batch addition script\n`);
    return;
  }
  
  // Generate single batch
  const scenarios = generateBatch(batchNum);
  
  if (scenarios) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ SUCCESS! Generated batch ${batchNum}`);
    console.log(`✅ ${scenarios.length} realistic scenarios created`);
    console.log('═══════════════════════════════════════════════════════════\n');
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateBatch };

