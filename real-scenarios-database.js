#!/usr/bin/env node

/**
 * REAL-WORLD CLINICAL SCENARIOS DATABASE
 * Professional exam-style scenario questions based on actual ABA practice
 * Organized in batches for progressive addition
 */

// ============================================================================
// BATCH 1: FUNCTIONAL ASSESSMENT SCENARIOS (25)
// ============================================================================

const BATCH_1_FUNCTIONAL_ASSESSMENT = [
  {
    id: 'scenario-001',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'functional-assessment',
    scenario: 'A BCBA observes that a 7-year-old client with autism engages in hand-flapping at high rates during academic tasks. ABC data collected over 2 weeks shows hand-flapping occurs primarily when difficult math problems are presented (18-22 instances per session). When the BCBA removes the worksheet, hand-flapping immediately stops. During preferred activities like playing with blocks, hand-flapping occurs 0-2 times per session.',
    question: 'Based on this data, what function is the hand-flapping most likely serving?',
    options: [
      'Automatic reinforcement (sensory stimulation)',
      'Escape from aversive academic demands',
      'Access to attention from teacher',
      'Access to tangible items (preferred toys)'
    ],
    correctAnswer: 'B',
    explanation: 'The data indicates a clear escape function. Key indicators: (1) Behavior occurs at high rates during demands (18-22 per session), (2) Behavior stops immediately when demands are removed, (3) Behavior is low during preferred activities (0-2 per session). This pattern is characteristic of behavior maintained by negative reinforcement (escape from aversive stimuli). Automatic reinforcement would occur at similar rates across all conditions. Attention function would show increase when attention is provided. Tangible function would show increase when items are present but unavailable.',
    bacbTaskList: ['FK-31', 'G-1', 'G-2'],
    keywords: ['functional assessment', 'escape function', 'negative reinforcement', 'ABC data']
  },

  {
    id: 'scenario-002',
    type: 'scenario',
    difficulty: 'advanced',
    category: 'functional-assessment',
    scenario: 'During a functional analysis, a 5-year-old client\'s hitting behavior shows the following rates: Attention condition = 12 hits/10 min, Escape condition = 2 hits/10 min, Tangible condition = 1 hit/10 min, Alone condition = 0 hits/10 min, Play condition = 1 hit/10 min. A second functional analysis 2 weeks later produces nearly identical results.',
    question: 'What is the most appropriate conclusion based on these functional analysis results?',
    options: [
      'The hitting is maintained by automatic reinforcement',
      'The hitting is maintained by access to attention',
      'The hitting serves multiple functions requiring combined intervention',
      'The results are inconclusive and require a third functional analysis'
    ],
    correctAnswer: 'B',
    explanation: 'The data clearly demonstrates an attention function. Hitting occurs at substantially higher rates in the attention condition (12 hits/10 min) compared to all other conditions (0-2 hits/10 min). The replication of results strengthens this conclusion, demonstrating experimental control and reliability. Automatic reinforcement is ruled out by zero occurrences in alone condition. Multiple functions would show elevated rates in multiple conditions. The results are clear and replicated, making them conclusive.',
    bacbTaskList: ['G-3', 'G-4', 'FK-31'],
    keywords: ['functional analysis', 'attention function', 'experimental control', 'replication']
  },

  {
    id: 'scenario-003',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'functional-assessment',
    scenario: 'A teacher reports that a student screams during transitions. The BCBA observes: Transition to preferred activity (recess) = 0 screams, Transition from preferred to non-preferred activity (recess to math) = 8 screams average, Transition between neutral activities (science to reading) = 2 screams average. Screaming typically results in a 2-3 minute delay in the transition.',
    question: 'What is the most likely function of the screaming behavior?',
    options: [
      'Access to preferred activities (positive reinforcement)',
      'Escape or avoidance of non-preferred activities (negative reinforcement)',
      'Sensory stimulation (automatic reinforcement)',
      'Access to peer attention during transitions'
    ],
    correctAnswer: 'B',
    explanation: 'The pattern strongly suggests escape/avoidance function. Evidence: (1) Screaming is highest when transitioning FROM preferred TO non-preferred (8 screams), (2) No screaming when going TO preferred activities, (3) Moderate screaming during neutral transitions, (4) Screaming produces functional outcome - delay in transition. This is classic negative reinforcement where behavior postpones or avoids an aversive event. Access to preferred activities would show increase when activities are available. Automatic reinforcement would show constant rates across conditions. Peer attention lacks supporting evidence.',
    bacbTaskList: ['FK-31', 'G-1', 'G-2'],
    keywords: ['escape function', 'negative reinforcement', 'avoidance', 'transitions']
  },

  {
    id: 'scenario-004',
    type: 'scenario',
    difficulty: 'beginner',
    category: 'functional-assessment',
    scenario: 'A BCBA conducts indirect assessments (interviews, questionnaires) and descriptive assessments (ABC data) before conducting a functional analysis. The indirect assessment suggests attention function. ABC data shows mixed results with no clear pattern.',
    question: 'What is the primary purpose of conducting the functional analysis after these preliminary assessments?',
    options: [
      'To confirm the findings from indirect and descriptive assessments',
      'To demonstrate experimental control and establish a functional relationship',
      'To collect additional baseline data for intervention planning',
      'To satisfy insurance requirements for behavior intervention'
    ],
    correctAnswer: 'B',
    explanation: 'Functional analysis is the gold standard because it demonstrates experimental control by systematically manipulating antecedents and consequences to establish a functional relationship between environmental variables and behavior. While indirect and descriptive assessments generate hypotheses, only experimental manipulation (functional analysis) can definitively demonstrate cause-and-effect relationships. This experimental control is essential for confident treatment selection. Confirming findings is too weak - FA provides higher-quality evidence. Baseline data is better collected through direct observation. Insurance requirements vary and are not the primary clinical purpose.',
    bacbTaskList: ['G-3', 'B-2', 'FK-35'],
    keywords: ['functional analysis', 'experimental control', 'functional relationship', 'assessment hierarchy']
  },

  {
    id: 'scenario-005',
    type: 'scenario',
    difficulty: 'advanced',
    category: 'functional-assessment',
    scenario: 'A functional analysis of self-injurious behavior shows moderate rates across ALL conditions (attention, escape, tangible, alone, play), with no clear differentiation between conditions. Rates range from 4-7 instances per 10-minute session across all conditions.',
    question: 'What is the most likely interpretation of these undifferentiated functional analysis results?',
    options: [
      'The behavior serves multiple functions and occurs for different reasons',
      'The behavior is maintained by automatic reinforcement',
      'The functional analysis was conducted incorrectly',
      'The behavior has no behavioral function and is purely biological'
    ],
    correctAnswer: 'B',
    explanation: 'Undifferentiated functional analysis results (similar rates across all conditions, including alone) typically indicate automatic reinforcement. When behavior occurs at comparable rates regardless of social consequences, it suggests the behavior itself produces reinforcing consequences (sensory stimulation, pain attenuation, etc.). Option A (multiple functions) would show elevated rates in SPECIFIC conditions, not equal rates across all. Option C assumes error without evidence. Option D is incorrect - all behavior has function, though automatic reinforcement involves biological processes. This pattern is commonly seen with self-injury, stereotypy, and pica.',
    bacbTaskList: ['G-3', 'FK-26', 'FK-31'],
    keywords: ['automatic reinforcement', 'undifferentiated FA', 'sensory function', 'self-injury']
  }

  // Add 20 more functional assessment scenarios...
];

// ============================================================================
// BATCH 2: INTERVENTION DESIGN SCENARIOS (25)
// ============================================================================

const BATCH_2_INTERVENTION_DESIGN = [
  {
    id: 'scenario-026',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'intervention-design',
    scenario: 'A functional assessment reveals that a client\'s aggressive behavior (hitting, kicking) is maintained by escape from academic tasks. The behavior occurs 15-20 times per hour during demanding activities. The BCBA wants to implement a function-based intervention.',
    question: 'Which intervention would be most appropriate as the PRIMARY component of a function-based treatment?',
    options: [
      'Response cost: Remove tokens for each instance of aggression',
      'Time-out: Remove client from classroom for 5 minutes after aggression',
      'Functional Communication Training: Teach client to request breaks appropriately',
      'Differential reinforcement: Provide edibles for periods without aggression'
    ],
    correctAnswer: 'C',
    explanation: 'FCT (Functional Communication Training) is the most appropriate primary intervention for escape-maintained behavior. It directly addresses the function by teaching an appropriate alternative behavior (requesting breaks) that serves the same function as the problem behavior. This is the gold standard for function-based treatment per Carr & Durand (1985). Response cost and time-out are punishment procedures that don\'t teach alternative skills and may worsen escape-maintained behavior. DRO with edibles doesn\'t match the behavioral function - if behavior is escape-maintained, providing edibles won\'t be as effective as providing the actual functional reinforcer (breaks).',
    bacbTaskList: ['G-4', 'G-7', 'FK-24'],
    keywords: ['FCT', 'function-based treatment', 'escape function', 'mand training']
  },

  {
    id: 'scenario-027',
    type: 'scenario',
    difficulty: 'advanced',
    category: 'intervention-design',
    scenario: 'A client successfully completed FCT training and now appropriately requests breaks instead of engaging in problem behavior. However, the client is requesting breaks 20-30 times per hour, interfering with learning. Initial FCT was on continuous reinforcement (every request honored).',
    question: 'What is the most appropriate next step in the FCT intervention?',
    options: [
      'Discontinue FCT and return to baseline because it is not working effectively',
      'Implement extinction for break requests to reduce frequency',
      'Gradually thin the reinforcement schedule using increasing fixed ratio requirements',
      'Add punishment for excessive break requests'
    ],
    correctAnswer: 'C',
    explanation: 'Schedule thinning is the standard next step in FCT protocols. After establishing the communication response on CRF, the schedule must be systematically thinned to practical levels. This is done gradually (FR-1 → FR-2 → FR-3 → FR-5, etc.) to maintain the communicative response while reducing frequency to acceptable levels. Discontinuing FCT is inappropriate - the intervention is working (problem behavior reduced), it just needs refinement. Extinction of the mand would eliminate the newly learned skill. Punishment of the replacement behavior is contraindicated and could cause resurgence of problem behavior. Schedule thinning is an essential component of comprehensive FCT.',
    bacbTaskList: ['G-14', 'FK-33', 'FK-24'],
    keywords: ['schedule thinning', 'FCT', 'fixed ratio', 'reinforcement schedules']
  },

  {
    id: 'scenario-028',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'intervention-design',
    scenario: 'A behavior intervention plan includes differential reinforcement of alternative behavior (DRA). The target is to decrease screaming (current: 25/hour) and increase hand-raising (current: 2/hour). The function of screaming is to access teacher attention.',
    question: 'How should the BCBA implement the DRA procedure?',
    options: [
      'Provide attention for hand-raising only, withhold attention for screaming',
      'Provide attention for screaming to build rapport, then gradually shift to hand-raising',
      'Provide attention when screaming does NOT occur (DRO procedure)',
      'Provide attention for both behaviors initially, then fade attention for screaming'
    ],
    correctAnswer: 'A',
    explanation: 'DRA requires providing reinforcement for the alternative behavior while withholding reinforcement (extinction) for the problem behavior. Since both behaviors serve the same function (accessing attention), attention should be provided contingent on hand-raising and withheld for screaming. This creates a differential that favors the appropriate behavior. Reinforcing problem behavior (option B) is contraindicated in DRA. Option C describes DRO, not DRA. Option D would initially strengthen both behaviors, making problem behavior more resistant to extinction. The key to DRA effectiveness is the clear differential: alternative behavior produces reinforcement, problem behavior does not.',
    bacbTaskList: ['G-7', 'FK-30', 'FK-31'],
    keywords: ['DRA', 'differential reinforcement', 'extinction', 'functional equivalence']
  },

  {
    id: 'scenario-029',
    type: 'scenario',
    difficulty: 'beginner',
    category: 'intervention-design',
    scenario: 'A BCBA is selecting an intervention for attention-maintained tantrums. The client is 4 years old with limited communication skills. The behavior occurs 8-12 times per day.',
    question: 'Which combination of procedures would be most appropriate for attention-maintained behavior?',
    options: [
      'Time-out + response cost',
      'FCT + extinction',
      'Positive practice overcorrection + verbal reprimand',
      'DRO + negative punishment'
    ],
    correctAnswer: 'B',
    explanation: 'FCT (teaching appropriate attention-seeking) combined with extinction (withholding attention for tantrums) is the evidence-based standard for attention-maintained behavior. This combination addresses the function by teaching alternative communication while making problem behavior ineffective. Time-out and response cost are punishment procedures that don\'t teach skills. Overcorrection and reprimands are more intrusive. DRO doesn\'t teach specific alternative behaviors. The FCT+extinction combination is well-researched, effective, and teaches functional communication skills that benefit the client long-term.',
    bacbTaskList: ['G-4', 'G-7', 'FK-24'],
    keywords: ['FCT', 'extinction', 'attention function', 'function-based intervention']
  },

  {
    id: 'scenario-030',
    type: 'scenario',
    difficulty: 'advanced',
    category: 'intervention-design',
    scenario: 'A client\'s problem behavior is maintained by access to tangibles. The BCBA implements FCT teaching the client to request items. However, some items cannot always be provided immediately (e.g., iPad during instructional time). The client becomes aggressive when requests are denied.',
    question: 'What additional component should be added to the FCT intervention?',
    options: [
      'Always honor requests to prevent aggression',
      'Teach tolerance for denial through graduated exposure',
      'Implement punishment for aggression after denied requests',
      'Discontinue FCT because it is creating problems'
    ],
    correctAnswer: 'B',
    explanation: 'Teaching tolerance for denial (or delay to reinforcement) is a critical component of comprehensive FCT for tangible-maintained behavior. This involves gradually increasing the delay between request and reinforcement, teaching waiting skills, and providing differential reinforcement for appropriate behavior during denial/delay. Simply honoring all requests is unrealistic and doesn\'t teach necessary skills. Punishment doesn\'t address the skill deficit. Discontinuing FCT abandons a working intervention. This tolerance training is standard in FCT protocols when immediate reinforcement isn\'t always possible.',
    bacbTaskList: ['G-7', 'G-14', 'FK-24'],
    keywords: ['FCT', 'tolerance training', 'delay to reinforcement', 'tangible function']
  }

  // Add 20 more intervention design scenarios...
];

// ============================================================================
// BATCH 3: ETHICS & PROFESSIONAL CONDUCT SCENARIOS (25)  
// ============================================================================

const BATCH_3_ETHICS = [
  {
    id: 'scenario-051',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'ethics-professional',
    scenario: 'A BCBA is contacted by a parent who wants services for their child. During the initial interview, the BCBA learns the family is currently receiving ABA services from another BCBA. The parent is unhappy with the current provider and wants to switch.',
    question: 'What is the BCBA\'s FIRST ethical obligation according to the BACB Ethics Code?',
    options: [
      'Accept the client immediately since the parent is dissatisfied',
      'Contact the current BCBA to discuss the client before accepting',
      'Decline services to avoid competing with another BCBA',
      'Conduct the assessment and let the parent decide'
    ],
    correctAnswer: 'B',
    explanation: 'BACB Ethics Code Section 2.05 requires BCBAs to contact current service providers before providing services to clients. This ensures continuity of care, prevents conflicting treatments, and allows for professional coordination. The BCBA should obtain parent permission to contact the current provider, discuss the case, and ensure appropriate transition if services are transferred. Simply accepting the client (option A) violates ethics. Declining outright (option C) may harm the client. Conducting assessment without coordination (option D) risks duplication and conflict. Professional communication protects client welfare.',
    bacbTaskList: ['E-01', 'E-02'],
    keywords: ['ethics', 'multiple relationships', 'service providers', 'coordination']
  },

  {
    id: 'scenario-052',
    type: 'scenario',
    difficulty: 'advanced',
    category: 'ethics-professional',
    scenario: 'A BCBA discovers that a Registered Behavior Technician (RBT) working under their supervision has been implementing punishment procedures without authorization and without documentation in the behavior plan. The BCBA was not aware this was occurring.',
    question: 'What is the BCBA\'s primary ethical responsibility in this situation?',
    options: [
      'Terminate the RBT immediately for violating the treatment plan',
      'Document the incident and implement additional oversight and training',
      'Report the RBT to the BACB for ethics violations',
      'Revise the behavior plan to include the punishment procedures'
    ],
    correctAnswer: 'B',
    explanation: 'As a supervisor, the BCBA is ethically responsible for supervisee behavior. The primary obligation is to take corrective action: document the incident, provide additional training, increase oversight, and ensure future compliance. This protects client welfare while addressing the supervisee\'s skill deficit. Immediate termination (option A) may be premature without training. BACB reporting (option C) is required only for serious violations; this may be addressed through supervision. Retroactively authorizing unauthorized procedures (option D) is unethical. Supervision Section 5.02 requires BCBAs to provide adequate supervision and training.',
    bacbTaskList: ['E-01', 'E-02', 'FK-03'],
    keywords: ['supervision', 'ethics', 'unauthorized procedures', 'oversight']
  },

  {
    id: 'scenario-053',
    type: 'scenario',
    difficulty: 'intermediate',
    category: 'ethics-professional',
    scenario: 'A BCBA is asked by a school administrator to provide an informal opinion about a student the BCBA has never assessed or worked with, based solely on review of school records.',
    question: 'How should the BCBA respond according to ethical guidelines?',
    options: [
      'Provide the opinion since it is based on written records',
      'Decline to provide an opinion without direct assessment of the student',
      'Provide the opinion but include a disclaimer about limitations',
      'Request permission from parents before providing the opinion'
    ],
    correctAnswer: 'B',
    explanation: 'BACB Ethics Code Section 3.02 prohibits providing professional opinions about individuals without conducting an appropriate assessment. BCBAs must base recommendations on adequate assessment and data. Providing opinions without direct assessment (even with disclaimers) violates this standard and could harm the client through inappropriate recommendations. Parental permission doesn\'t override the need for proper assessment. The BCBA should explain the need for direct assessment or decline to provide professional opinions.',
    bacbTaskList: ['E-02', 'G-1'],
    keywords: ['ethics', 'assessment requirements', 'professional opinions', 'documentation review']
  }

  // Add 22 more ethics scenarios...
];

// Export all batches
module.exports = {
  BATCH_1_FUNCTIONAL_ASSESSMENT,
  BATCH_2_INTERVENTION_DESIGN,
  BATCH_3_ETHICS
};

