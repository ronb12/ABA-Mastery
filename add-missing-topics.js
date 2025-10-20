// Add 3 missing topics to reach 100% exam coverage
const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'content.json');
const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Topic 1: Preference Assessments (add to Assessment category)
const preferenceAssessment = {
  "id": "assessment-6",
  "title": "Preference and Reinforcer Assessments",
  "content": "Preference and reinforcer assessments are systematic methods for identifying stimuli that may function as reinforcers for an individual. This is critical for effective intervention planning.\n\nPURPOSE AND IMPORTANCE:\nIdentifying effective reinforcers is essential for behavior change. What functions as a reinforcer varies across individuals and contexts. Systematic assessment prevents wasting time with ineffective interventions and ensures ethical practice by respecting individual preferences.\n\nPREFERENCE vs REINFORCER ASSESSMENT:\nPREFERENCE ASSESSMENT: Identifies what a person likes or chooses when given options. Measures selection behavior.\n\nREINFORCER ASSESSMENT: Tests whether preferred items actually function as reinforcers (increase behavior). Requires functional demonstration.\n\nKey distinction: Preference doesn't guarantee reinforcing value. Some preferred items may not strengthen behavior. Some non-preferred items might still function as reinforcers in certain contexts.\n\nTYPES OF PREFERENCE ASSESSMENTS:\n\nPAIRED STIMULUS (PS): Present two items simultaneously, individual selects one, repeat with all possible pairs. Provides rank ordering. Quick (5-10 minutes). Advantages: Forces choice, easy to score. Limitations: Satiation not controlled, position bias possible.\n\nMULTIPLE STIMULUS WITHOUT REPLACEMENT (MSWO): Present array of 5-8 items, individual selects one, remove selected item, re-present remaining items. Provides clear rank ordering. Controls for satiation. Most commonly used method.\n\nFREE OPERANT: Items freely available in environment for 5-10 minutes. Measure duration or frequency of engagement. Most naturalistic. Good for items that can't be quickly consumed.\n\nSINGLE STIMULUS: Present one item at a time, measure approach/engagement. Simplest method. No choice required. Good for individuals who don't make selections.\n\nREINFORCER ASSESSMENT:\nVerify preferred items actually function as reinforcers through progressive-ratio assessment, concurrent schedules, or brief operant tests.",
  "keyPoints": [
    "Preference assessment identifies what individual selects or approaches",
    "Reinforcer assessment verifies items actually strengthen behavior",
    "Paired Stimulus (PS): Present pairs, record selections, provides ranking",
    "MSWO: Most commonly used, controls satiation, clear rank ordering",
    "Free Operant: Most naturalistic, measures duration of engagement",
    "Single Stimulus: Simplest, no choice required",
    "Preferences change over time - reassess regularly",
    "Different methods may yield different results",
    "Preference doesn't guarantee reinforcing value - functional test needed"
  ]
};

// Topic 2: Motivating Operations (add to Foundations category)
const motivatingOperations = {
  "id": "foundations-5",
  "title": "Motivating Operations",
  "content": "Motivating Operations (MOs) are environmental variables that alter both the reinforcing value of stimuli and the frequency of behavior that has been reinforced by those stimuli.\n\nDEFINITION:\nMOs have two effects: VALUE-ALTERING (change how reinforcing/punishing something is) and BEHAVIOR-ALTERING (change frequency of behavior that produced that consequence).\n\nESTABLISHING OPERATION (EO):\nINCREASES reinforcer value and INCREASES behavior frequency. Examples: Food deprivation increases value of food and increases food-seeking behavior. Difficult task increases value of escape and increases escape-maintained behavior.\n\nABOLISHING OPERATION (AO):\nDECREASES reinforcer value and DECREASES behavior frequency. Examples: Food satiation decreases value of food and decreases eating. Extended attention decreases value of attention and decreases attention-seeking.\n\nUNCONDITIONED vs CONDITIONED MOs:\n\nUNCONDITIONED MOs (UMOs): Effects occur without prior learning. Biologically based. Examples: Food deprivation/satiation, sleep deprivation, temperature extremes, pain.\n\nCONDITIONED MOs (CMOs): Effects depend on learning history. Three types:\n- CMO-S (Surrogate): Acquires MO properties through pairing\n- CMO-R (Reflexive): Stimulus-stimulus pairing makes one stimulus reinforcing\n- CMO-T (Transitive): Establishes another stimulus as reinforcing\n\nMOs vs DISCRIMINATIVE STIMULI:\nCritical distinction: SD signals reinforcement is AVAILABLE (doesn't change motivation). MO changes VALUE of reinforcer (changes motivation). Food deprivation (MO) makes you hungry. Menu (SD) tells you where food is available.\n\nCLINICAL APPLICATIONS:\nManipulate MOs as antecedent intervention. Provide noncontingent attention (AO for attention-maintained behavior). Offer choices (AO for escape). Presession access to tangibles (AO for tangible-maintained behavior). Understanding MOs helps predict when problem behavior most likely to occur.",
  "keyPoints": [
    "MOs have VALUE-ALTERING and BEHAVIOR-ALTERING effects",
    "Establishing Operations (EO) INCREASE reinforcer value and behavior",
    "Abolishing Operations (AO) DECREASE reinforcer value and behavior",
    "Unconditioned MOs (UMOs) are biological - no learning required",
    "Conditioned MOs (CMOs) depend on learning history",
    "CMO subtypes: CMO-S (Surrogate), CMO-R (Reflexive), CMO-T (Transitive)",
    "MOs change reinforcer VALUE; SDs signal reinforcer AVAILABILITY",
    "Manipulating MOs is powerful antecedent intervention",
    "Understanding MOs helps predict problem behavior occurrence"
  ]
};

// Topic 3: Personnel Supervision & BST (add to Systems category)
const personnelSupervision = {
  "id": "systems-5",
  "title": "Personnel Supervision and Behavioral Skills Training",
  "content": "Effective supervision and staff training are essential for maintaining high-quality ABA services. Behavioral Skills Training (BST) is the evidence-based method for training direct-service staff.\n\nBACD SUPERVISION REQUIREMENTS:\nBCBAs must provide ongoing supervision including direct observation, performance feedback, data review, skills assessment, and ethics guidance.\n\nRBT SUPERVISION: Minimum 5% of hours worked, at least 2 face-to-face contacts per month, direct observation required, documentation required.\n\nBEHAVIORAL SKILLS TRAINING (BST):\nGold-standard training method with 4 ESSENTIAL components - ALL must be present:\n\n1. INSTRUCTION: Verbal or written explanation of the skill. Describe what, when, and why. Clear, concise, specific. Include rationale.\n\n2. MODELING: Demonstrate the skill in action. Show exactly how to perform. Can use live demonstration or video models. Model correct performance, not errors.\n\n3. REHEARSAL: Trainee practices the skill while supervisor observes. Provides opportunity to perform in safe environment. Can use role-play, simulation, or practice with actual client.\n\n4. FEEDBACK: Specific, immediate feedback on performance. Should be specific, immediate, balanced (positive + corrective), actionable.\n\nBST CYCLE:\nInstruction → Modeling → Rehearsal → Feedback → Repeat until mastery. Continue until trainee performs independently at criterion level.\n\nEFFECTIVENESS:\nResearch shows BST more effective than instruction alone, written protocols only, or passive observation. Produces faster skill acquisition, higher treatment integrity, better maintenance, greater generalization.\n\nPERFORMANCE MONITORING:\nRegularly assess staff performance through direct observation, treatment integrity checklists, permanent product review, client outcome data. Skills drift without monitoring.\n\nCOMPETENCY-BASED TRAINING:\nCriterion-based, not time-based. Define performance criterion (e.g., 90% treatment integrity), assess baseline, provide BST until criterion met, document competency, provide booster training if needed.\n\nETHICAL SUPERVISION:\nEnsure supervisees competent before independent practice, provide adequate training, monitor regularly, address deficits immediately, document activities, model ethical behavior, create supportive environment.",
  "keyPoints": [
    "BST has 4 essential components: Instruction, Modeling, Rehearsal, Feedback",
    "All 4 BST components must be present for effective training",
    "Competency-based training uses performance criterion, not just time",
    "Ongoing performance monitoring required - skills drift without supervision",
    "BACB requires 5% supervision for RBTs, 2 face-to-face contacts monthly",
    "Performance feedback: immediate, specific, data-based, balanced",
    "Supervisors retain responsibility even when delegating",
    "Document all supervision activities",
    "Treatment integrity monitoring ensures correct implementation"
  ]
};

// Find and add topics
const assessmentCategory = data.categories.find(c => c.id === 'assessment');
const foundationsCategory = data.categories.find(c => c.id === 'foundations');
const systemsCategory = data.categories.find(c => c.id === 'systems');

if (assessmentCategory) {
  assessmentCategory.topics.push(preferenceAssessment);
  console.log('✅ Added: Preference Assessments to Assessment category');
}

if (foundationsCategory) {
  foundationsCategory.topics.push(motivatingOperations);
  console.log('✅ Added: Motivating Operations to Foundations category');
}

if (systemsCategory) {
  systemsCategory.topics.push(personnelSupervision);
  console.log('✅ Added: Personnel Supervision & BST to Systems category');
}

// Save updated content
fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ content.json updated successfully!');
console.log('Total Categories:', data.categories.length);
console.log('Total Topics:', data.categories.reduce((sum, cat) => sum + cat.topics.length, 0));

