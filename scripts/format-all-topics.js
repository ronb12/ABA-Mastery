#!/usr/bin/env node
// Expand and Format All Study Topics to Professional Standards

const fs = require('fs');

console.log('📚 EXPANDING AND FORMATTING ALL STUDY TOPICS\n');

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

// Find category by id
function findCategory(id) {
    return content.categories.find(c => c.id === id);
}

// Find and update topic
function updateTopic(categoryId, topicId, newContent) {
    const category = findCategory(categoryId);
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            topic.content = newContent;
            console.log(`✅ Updated: ${topic.title}`);
            return true;
        }
    }
    return false;
}

// ============================================
// ASSESSMENT & EVALUATION
// ============================================

console.log('\n📋 Expanding Assessment & Evaluation Topics...\n');

updateTopic('assessment', 'assessment-1', `Functional Behavior Assessment (FBA) is a systematic process for identifying the environmental variables that maintain problem behavior. It's the foundation for developing effective, function-based interventions.

PURPOSE AND IMPORTANCE:
FBA identifies WHY behavior occurs, not just what the behavior looks like. Understanding function is critical because the same topography (form) of behavior can serve different functions for different individuals or in different contexts. Example: A child's screaming might function to escape demands (negative reinforcement) or to gain attention (positive reinforcement). The intervention would be completely different depending on the function.

THE FOUR MAIN FUNCTIONS:
All behavior serves one or more of four functions:

ATTENTION: Behavior maintained by social attention from others. Examples: Talking out in class to get teacher attention, tantrum when parent is on phone, inappropriate behavior that makes peers laugh. The attention can be positive (praise, conversation) or negative (reprimands, correction). Key: Any social reaction can reinforce attention-maintained behavior.

ESCAPE/AVOIDANCE: Behavior maintained by removal or avoidance of aversive stimuli. Examples: Tantrum to escape difficult tasks, aggression to avoid social interactions, problem behavior during non-preferred activities. The individual learns that behavior terminates or prevents something unpleasant. This is negative reinforcement - behavior increases because it removes something.

TANGIBLE/ACCESS: Behavior maintained by obtaining preferred items or activities. Examples: Crying to get desired toy, aggression to access food, problem behavior to gain access to preferred locations or activities. The behavior directly produces access to something the person wants.

AUTOMATIC/SENSORY: Behavior maintained by sensory consequences produced by the behavior itself, not mediated by others. Examples: Stereotypy (hand-flapping, rocking), self-injury that produces endorphins, behaviors that feel good or reduce discomfort. The reinforcement is built into the behavior - it doesn't depend on social consequences.

FBA METHODS:
FBA involves three main assessment approaches, often used in combination:

INDIRECT ASSESSMENT: Gathering information from interviews, questionnaires, and rating scales. Tools include: Functional Assessment Interview (FAI), Motivation Assessment Scale (MAS), Questions About Behavioral Function (QABF). Advantages: Quick, inexpensive, provides historical information. Limitations: Relies on informant accuracy, can be influenced by bias, doesn't directly observe behavior.

DESCRIPTIVE ASSESSMENT: Direct observation of behavior in natural contexts. Methods include: ABC (Antecedent-Behavior-Consequence) data, scatterplots showing when behavior occurs, narrative recording describing events. Advantages: Observes real contingencies, identifies patterns, contextually valid. Limitations: Time-consuming, correlation not causation, may miss low-frequency behaviors.

FUNCTIONAL ANALYSIS (EXPERIMENTAL): Systematically manipulating environmental variables to test hypothesized functions. Conditions might include: Attention (behavior produces attention), Escape (behavior terminates demands), Tangible (behavior produces preferred items), Alone (tests automatic function), Play/Control (low/no behavior expected). Advantages: Demonstrates cause-effect, identifies controlling variables, highest certainty about function. Limitations: Requires expertise, time-intensive, temporarily reinforces problem behavior, ethical considerations.

INTERPRETING FBA DATA:
Look for patterns: When does behavior occur? What happens immediately before (antecedents)? What happens immediately after (consequences)? Is behavior more likely in certain settings, with certain people, during certain activities? Convergence of evidence across multiple assessment methods increases confidence in identified function.

FUNCTION-BASED INTERVENTION:
Once function is identified, design interventions that: Teach functionally equivalent replacement behaviors, Modify antecedents to prevent problem behavior, Ensure problem behavior no longer produces reinforcement (extinction), Provide reinforcement for appropriate behavior serving the same function.

ETHICAL CONSIDERATIONS:
FBA should always precede intervention selection. Using punishment without understanding function is ethically problematic and often ineffective. Function-based interventions are more effective, efficient, and ethical than arbitrary intervention selection.`);

updateTopic('assessment', 'assessment-2', `Measurement is fundamental to behavior analysis. Selecting appropriate measurement systems allows accurate quantification of behavior for assessment and intervention evaluation.

DIMENSIONS OF MEASUREMENT:
Behavior can be measured across multiple dimensions. Selection depends on the behavior's characteristics and treatment goals.

FREQUENCY/COUNT:
DEFINITION: The number of times a behavior occurs. Simply count each instance.

WHEN TO USE: For discrete behaviors with clear beginning and end. Examples: Number of times student raises hand, instances of hitting, completed homework assignments, correct responses.

ADVANTAGES: Simple, direct, intuitive. Easy to collect and understand.

LIMITATIONS: Doesn't account for time - 5 tantrums in 1 hour vs 5 tantrums in 8 hours are very different, but frequency alone is the same. Duration and intensity not captured.

RATE:
DEFINITION: Frequency per unit of time (count/time). Usually expressed as responses per minute or per hour.

WHEN TO USE: When observation periods vary in length. Allows comparison across different time periods.

CALCULATION: Rate = Count ÷ Time. Example: 20 hand-raises in 60 minutes = 0.33 per minute or 20 per hour.

ADVANTAGES: Accounts for time, allows comparison across sessions of different lengths, sensitive to change.

LIMITATIONS: Requires tracking time, less intuitive than simple count.

DURATION:
DEFINITION: How long a behavior lasts from start to finish. Measures temporal extent.

TYPES: Total duration (cumulative time across all instances), Duration per occurrence (average length of each instance).

WHEN TO USE: For behaviors where length matters more than frequency. Examples: Time on-task, duration of tantrum, length of exercise session, time engaged in conversation.

MEASUREMENT: Requires timing device (stopwatch, timer). Start when behavior begins, stop when it ends.

ADVANTAGES: Captures temporal dimension, important for behaviors like on-task or tantrum where duration is clinically significant.

LIMITATIONS: Doesn't capture frequency - a 10-minute tantrum once is different from five 2-minute tantrums, but total duration is the same.

LATENCY:
DEFINITION: Time between an antecedent stimulus and behavior onset. How long until behavior starts.

WHEN TO USE: When speed of response matters. Examples: Time to begin task after instruction, latency to comply with request, response time to alarm.

MEASUREMENT: Start timing when antecedent occurs, stop when behavior begins.

CLINICAL RELEVANCE: Long latency to comply may indicate problem with instruction-following. Short latency to problem behavior may indicate strong motivation.

INTER-RESPONSE TIME (IRT):
DEFINITION: Time between consecutive instances of the same behavior. The gap between responses.

WHEN TO USE: Analyzing behavior patterns, evaluating fluency, understanding behavior chains.

EXAMPLE: Time between each repetitive behavior, gaps between aggressive outbursts.

RELEVANCE: Can reveal patterns - is behavior evenly distributed or clustered?

PERCENTAGE:
DEFINITION: Proportion of opportunities in which behavior occurred. (Occurrences ÷ Opportunities) × 100.

WHEN TO USE: When opportunities for behavior are discrete and countable. Examples: Percentage of trials with correct response (8/10 = 80%), percentage of days homework completed (4/5 = 80%), percentage of intervals on-task.

ADVANTAGES: Standardizes across different numbers of opportunities, intuitive interpretation, easily compared.

LIMITATIONS: Requires clear identification of opportunities, can be misleading if opportunities aren't equivalent.

TRIALS TO CRITERION:
DEFINITION: Number of practice opportunities needed to achieve mastery. Measures learning efficiency.

WHEN TO USE: Skill acquisition programs, measuring learning rate, comparing teaching methods.

EXAMPLE: Child needs 15 trials to independently perform task (criterion: 3 consecutive correct).

TOPOGRAPHY:
DEFINITION: Physical form or shape of behavior. What the behavior looks like.

MEASUREMENT: Qualitative description or rating scale for form/intensity.

EXAMPLES: Describing how aggression is performed (hitting, kicking, biting), rating intensity of tantrum (1-5 scale).

MAGNITUDE/INTENSITY:
DEFINITION: Force or strength of behavior.

MEASUREMENT: Objective (decibels for loudness, force transducers for strength) or subjective rating scales.

WHEN TO USE: When intensity matters for clinical significance. Example: Loud vs soft screaming, hard vs gentle hitting.

SELECTION CRITERIA:
Choose measurement based on: Behavior characteristics (discrete vs continuous), Treatment goals (reduce frequency vs duration), Practical constraints (staff time, tools available), Sensitivity to change (will method detect clinically important changes).

MEASUREMENT BEST PRACTICES:
Operational definitions (clear, observable, measurable), Trained observers (reliable data collection), Consistent procedures (same method throughout), Appropriate tools (timers, counters, apps), Regular reliability checks (inter-observer agreement).`);

updateTopic('assessment', 'assessment-3', `Data collection is the process of systematically observing and recording behavior. The method selected impacts accuracy, feasibility, and data interpretation.

CONTINUOUS RECORDING:
DEFINITION: Recording every instance of behavior throughout the observation period. Provides complete picture of behavior.

METHODS: Frequency recording (count each occurrence), Duration recording (time each instance), Real-time recording (notation at exact moment).

ADVANTAGES: Most accurate and complete, captures all instances, allows multiple analyses (can calculate frequency, rate, duration from same data).

LIMITATIONS: Resource-intensive, requires continuous attention, may be impractical for high-rate behaviors or busy settings.

WHEN TO USE: Low-to-moderate rate behaviors, when accuracy is critical, when resources allow, during initial assessment to characterize behavior fully.

DISCONTINUOUS RECORDING (TIME SAMPLING):
DEFINITION: Observing during sampled time periods rather than continuously. Estimates behavior occurrence.

PURPOSE: Makes data collection more practical when continuous recording isn't feasible. Balances accuracy with feasibility.

THREE MAIN TYPES:

WHOLE INTERVAL RECORDING:
Definition: Behavior marked as occurring ONLY if present throughout the entire interval.

Procedure: Divide observation into equal intervals (e.g., 10-second intervals for 5 minutes = 30 intervals). Score (+) only if behavior occurs for the whole interval. Score (-) if behavior absent or present for only part of interval.

When to use: For behaviors you want to decrease (continuous engagement in problem behavior). Examples: Continuous stereotypy, sustained off-task behavior.

Bias: UNDERESTIMATES behavior occurrence. Brief lapses in behavior result in (-) score even if behavior occurred 95% of interval.

Example: 10-second intervals watching on-task behavior. Child is on-task 9 seconds, off-task 1 second = scored as (-) for that interval.

PARTIAL INTERVAL RECORDING:
Definition: Behavior marked as occurring if present during ANY part of the interval.

Procedure: Divide observation into intervals. Score (+) if behavior occurs at all during the interval, even momentarily. Score (-) only if behavior never occurred.

When to use: For behaviors you want to increase (momentary occurrence counts). Examples: Social interactions, target behaviors you're establishing.

Bias: OVERESTIMATES behavior occurrence. Brief behavior instance scores same as continuous behavior.

Example: 15-second intervals watching aggressive behavior. One hit during interval scores (+) same as continuous aggression throughout interval.

MOMENTARY TIME SAMPLING (MTS):
Definition: Observe behavior only at the precise moment the interval ends. Snapshot sampling.

Procedure: Set intervals (e.g., every 30 seconds). At exact end of interval, observe whether behavior is occurring at that instant. Mark (+) if yes, (-) if no. Don't observe between interval points.

When to use: High-rate behaviors, when observer must do other tasks between observations, for ongoing behaviors like on-task.

Bias: Most accurate time sampling method when intervals are brief. Can miss behavior between observation points.

Example: Every 60 seconds, look up and mark if child is on-task at that exact moment.

CHOOSING AMONG TIME SAMPLING METHODS:
Whole interval: Use for behaviors occurring throughout intervals (continuous stereotypy).
Partial interval: Use for brief, discrete behaviors (hits, outbursts).
Momentary: Use for ongoing states (on-task, engagement), high-rate behaviors, when observer has other duties.

PERMANENT PRODUCT RECORDING:
DEFINITION: Measuring outcomes or results of behavior rather than behavior itself.

EXAMPLES: Completed worksheets, number of items assembled, test scores, broken objects, written work.

ADVANTAGES: Doesn't require observation during behavior, objective and verifiable, efficient, allows retrospective analysis.

LIMITATIONS: Doesn't capture process, can't determine how behavior occurred, some behaviors don't leave products.

WHEN TO USE: When behavior leaves lasting evidence, for academic work, when direct observation not possible.

REAL-TIME RECORDING:
DEFINITION: Recording exact time behavior starts and stops. Continuous time-stamped data.

METHODS: ABC data with times, duration recording with start/stop times, event recording with timestamps.

ADVANTAGES: Allows later calculation of frequency, rate, duration, IRT. Most flexible for analysis. Can identify temporal patterns.

LIMITATIONS: Most demanding, requires careful attention, needs timing device.

SELECTION CONSIDERATIONS:
Behavior characteristics: Discrete vs continuous, frequency, duration.
Resources: Staff time, observer availability, tools available.
Setting demands: Can observer devote full attention?
Accuracy needs: Is estimation acceptable or precision required?
Intervention goals: What matters most - frequency, duration, or pattern?

DATA COLLECTION BEST PRACTICES:
Operational definitions prevent scoring ambiguity.
Train observers to reliability criterion (>80-90% agreement).
Use simple, practical recording methods.
Test feasibility before full implementation.
Conduct regular inter-observer agreement checks.
Consider reactivity - data collection shouldn't disrupt environment.

INTER-OBSERVER AGREEMENT (IOA):
Calculate agreement between independent observers to ensure reliability. Methods: Total count IOA, Interval-by-interval IOA, Scored-interval IOA. Standards: >80% IOA is acceptable, >90% preferred.`);

updateTopic('assessment', 'assessment-4', `Assessing current skill levels is essential for identifying intervention targets, establishing baselines, and monitoring progress in skill acquisition programs.

PURPOSES OF SKILL ASSESSMENT:
Identify strengths and deficits, Prioritize intervention targets, Establish baseline performance, Guide instructional strategies, Monitor progress toward goals, Evaluate intervention effectiveness, Make data-based decisions.

ASSESSMENT APPROACHES:

STANDARDIZED ASSESSMENTS:
Definition: Norm-referenced or criterion-referenced tools with established administration and scoring procedures.

COMMON ABA ASSESSMENTS:

VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program):
Focus: Language and learning skills for children with autism.
Components: Milestones (170 skills across 16 areas), Barriers (24 common learning obstacles), Transition (18 areas for school readiness).
Age range: 0-48 months developmental level.
Uses: Comprehensive verbal behavior assessment, program planning, progress monitoring.
Strengths: Specifically designed for ABA programs, links assessment directly to curriculum.

ABLLS-R (Assessment of Basic Language and Learning Skills - Revised):
Focus: Language, academic, and daily living skills.
Components: 25 skill areas, 544 skills assessed.
Format: Task analysis for each skill, scored on mastery continuum.
Uses: Identifying skill deficits, developing IEP goals, tracking progress.
Strengths: Very comprehensive, applicable across wide age range.

AFLS (Assessment of Functional Living Skills):
Focus: Functional skills for daily independence.
Components: Basic living, Home, Community, School, Vocational, Independent living.
Age range: Adolescents and adults (can use with younger).
Uses: Transition planning, functional skill curriculum, vocational programs.

PEAK (Promoting the Emergence of Advanced Knowledge):
Focus: Assessing equivalence-based instruction readiness.
Components: Four modules (Direct training, Generalization, Equivalence, Transformation).
Uses: Advanced language skills, testing derived relational responding.

CRITERION-REFERENCED ASSESSMENT:
Definition: Measures performance against specific standards or criteria, not comparison to peers.

Characteristics: Identifies what skills individual has mastered, Shows skill level within specific domains, Determines if performance meets predetermined criteria.

Examples: Can the child tie shoes? Can the student solve addition problems? Does the individual follow 2-step instructions?

Advantages: Directly relevant to intervention planning, Identifies specific teaching targets, Progress measured against individual's own baseline, Not dependent on norms.

Uses in ABA: Developing skill acquisition programs, Selecting teaching targets, Measuring mastery, Creating individualized curricula.

CURRICULUM-BASED ASSESSMENT (CBA):
Definition: Assessment based on curriculum the individual will actually be learning.

Procedure: Sample items from curriculum, Assess current performance on those specific items, Identify where to start instruction.

Examples: Assessing student on actual math curriculum they'll be taught, Testing sight words from reading program to be used, Evaluating performance on actual job tasks for vocational training.

Advantages: Directly applicable to teaching, No wasted time on irrelevant content, Clear starting point for instruction, Easy to see progress.

TASK ANALYSIS ASSESSMENT:
Definition: Breaking skill into component steps, assessing which steps individual can already perform.

Procedure: Create task analysis of target skill, Test each step systematically, Identify which steps mastered vs need teaching.

Example: Handwashing task analysis - Turn on water, Wet hands, Get soap, Lather hands (front, back, between fingers), Rinse, Turn off water, Dry hands. Assess which steps child performs independently.

Uses: Chaining procedures, Identifying teaching starting point, Documenting baseline skills.

PROBE SESSIONS:
Definition: Brief assessments of skill performance without prompting or reinforcement.

Purpose: Measure independent performance, Test generalization, Establish baseline, Evaluate maintenance.

Procedure: Present stimulus/instruction, Allow time to respond, Record response (correct/incorrect/no response), No prompts or feedback during probe, Continue with teaching/reinforcement after probe.

When to use: Beginning of skill programs, Periodically during teaching, Post-mastery maintenance checks, Testing generalization.

BASELINE MEASUREMENT:
Definition: Measuring behavior before intervention begins. Establishes starting point.

Importance: Allows evaluation of intervention effects, Provides comparison for progress, Required for demonstrating experimental control.

Procedure: Measure target behavior repeatedly until stable pattern emerges, Use same measurement method throughout baseline and intervention, Continue until trend is clear or ethical concerns require starting intervention.

Stability criteria: Usually 3-5 data points with minimal variability and no increasing/decreasing trend for behaviors being increased. May start intervention sooner for serious problem behaviors.

ONGOING PROGRESS MONITORING:
Continue assessment throughout intervention: Frequent probes (daily, weekly), Criterion-based progression (advance when criteria met), Modification based on progress (or lack thereof), Maintenance checks after mastery.

ASSESSMENT BEST PRACTICES:
Use multiple assessment methods for comprehensive picture, Select assessments aligned with intervention goals, Ensure cultural and linguistic appropriateness, Involve families in identifying priorities, Conduct assessments in natural environments when possible, Regular reassessment to guide programming, Make data-based decisions about targets and strategies.`);

// Continue with more topics...
console.log('\n✅ Assessment topics expanded!');

// Save the updated content
fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));

console.log('\n📊 Progress: Assessment & Evaluation complete (4/36)');
console.log('   Remaining: 32 topics\n');
console.log('✅ File saved! Topics are now properly formatted with:');
console.log('   • Comprehensive content (300-800 words)');
console.log('   • Paragraph breaks (\\n\\n)');
console.log('   • Section headers (ALL CAPS:)');
console.log('   • Professional formatting\n');

