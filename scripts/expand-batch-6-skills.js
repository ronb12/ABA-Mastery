#!/usr/bin/env node
// BATCH 6: Skill Acquisition (5 topics)

const fs = require('fs');
console.log('\n📚 BATCH 6: Skill Acquisition (5 topics)\n');

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

function updateTopic(categoryId, topicId, newContent) {
    const category = content.categories.find(c => c.id === categoryId);
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            topic.content = newContent;
            console.log(`✅ ${topic.title} (${newContent.split(/\s+/).length} words)`);
            return true;
        }
    }
    return false;
}

updateTopic('skill-acquisition', 'skill-1', `Task analysis breaks complex skills into teachable component steps. It's fundamental for teaching multi-step skills through chaining procedures.

DEFINITION:
Task analysis is breaking down a complex skill or activity sequence into smaller, teachable steps. Each step is observable, measurable, and achievable.

PURPOSE:
Allows teaching complex skills systematically, Identifies specific teaching targets, Enables progress monitoring on each step, Guides prompting and reinforcement, Makes overwhelming tasks manageable.

METHODS FOR CONDUCTING TASK ANALYSIS:

OBSERVE COMPETENT PERFORMER:
Watch someone skilled perform the task. Document each step they complete. Note sequence and critical components.

Advantages: Shows actual performance, Realistic step sequences, Identifies subtle steps you might miss.

Process: Observe multiple times, Note variations, Select most efficient sequence, Confirm all necessary steps included.

PERFORM TASK YOURSELF:
Complete the task while documenting each step you do.

Advantages: First-hand understanding, Identify challenging steps, Feel natural sequence.

Process: Go slowly and deliberately, Note every action, Don't skip "obvious" steps, Consider learner's perspective (what seems obvious to you may need teaching).

CONSULT EXPERTS:
Ask skilled individuals to describe steps. Use established task analyses from literature.

Advantages: Expertise informs analysis, Research-based sequences, Validated effective approaches.

COMBINATION APPROACH:
Use multiple methods: Observe, perform yourself, consult experts, pilot with learner. Combine information for comprehensive analysis.

WRITING TASK ANALYSIS:

STEP CRITERIA:
Each step should be: Observable (can see if completed), Measurable (can score correct/incorrect), Result-oriented (describes outcome, not just action sometimes), Achievable (within learner's capabilities with training), Necessary (required for successful task completion).

LEVEL OF DETAIL:
Balance: Too detailed = overwhelming, unnecessary steps. Too broad = steps too difficult to master.

Consider learner's skills when determining detail level. More detail for: Complex tasks, Less skilled learners, Critical precision required.

EXAMPLE - HANDWASHING:
Detailed (8 steps): 1. Turn on water, 2. Wet hands, 3. Pump soap, 4. Lather hands, 5. Rinse hands, 6. Turn off water, 7. Get towel, 8. Dry hands.

Could be more detailed (lather front, back, between fingers separately) or less (combine wet and lather).

SEQUENCE ORDERING:
Steps in logical order for task completion. Typical: Chronological (first to last), Prerequisite (must complete step A before step B), Efficiency (most efficient order).

Some flexibility in order for certain tasks.

VALIDATION:
Test task analysis: Try teaching using the sequence, Does each step logically follow previous? Are all necessary steps included? Are steps achievable? Do they result in successful task completion?

Revise based on learner performance and feedback.

CHAINING PROCEDURES:
Once task analysis complete, use chaining to teach:

FORWARD CHAINING:
DEFINITION: Teach steps in sequence from first to last. Teach Step 1 to mastery, then Step 2, then Step 3, etc.

PROCESS: Teach Step 1 independently, Complete remaining steps for learner (or have them observe), When Step 1 mastered, teach Step 2 while maintaining Step 1, Continue adding steps forward.

ADVANTAGES: Natural sequence (beginning to end), Learner experiences start-to-finish, Each step builds on previous.

WHEN TO USE: Logical progression important, Initial steps provide momentum, Skills where sequence critical.

BACKWARD CHAINING:
DEFINITION: Teach last step first, then second-to-last, working backward to first step.

PROCESS: Complete all steps except last for learner, Teach learner to complete final step independently, When mastered, teach second-to-last step, Continue backward until learner completes all steps.

ADVANTAGES: Learner always ends with success (final step), Completion provides natural reinforcement, Learns "finish" first (powerful reinforcer), Good for skills where completion is highly reinforcing.

WHEN TO USE: Final step provides strong natural reinforcement, Initial steps less reinforcing, Completion particularly important.

TOTAL TASK PRESENTATION:
DEFINITION: Present entire task sequence every time. Prompt and assist as needed on all steps.

PROCESS: Learner attempts all steps from beginning to end, Prompt on steps not yet mastered, Reinforce at completion, Fade prompts progressively on each step.

ADVANTAGES: Practices whole task each time (natural), Sees complete sequence, Good for tasks practiced as unit, Faster for learners who can handle complexity.

WHEN TO USE: Task performed as integrated whole, Learner capable of multi-step sequences, Gradual independence across steps acceptable.

SELECTING CHAINING PROCEDURE:
Consider: Task characteristics (steps independent vs integrated), Learner capabilities (can handle complexity?), Reinforcement (where is natural reinforcement?), Skill type (routine vs novel).

All three procedures effective - choice based on individual factors.

DATA COLLECTION:
Track mastery of each step: Score each step (correct, prompted, incorrect), Percentage of steps independent, Which steps mastered vs need teaching, Progress toward full independence.

GRAPHS: Can graph percentage of steps independent over time, Or separate data paths for each step.

PROMPTING WITHIN CHAINING:
Use standard prompting procedures for each step: Graduated guidance, Time delay, Least-to-most or most-to-least prompting.

Fade systematically as each step mastered.

APPLICATIONS:
Self-care: Tooth brushing, hand washing, dressing, toileting, grooming. Daily living: Making bed, setting table, preparing meals, laundry. Vocational: Job tasks (assembly, stocking, cleaning), Work sequences. Academic: Multi-step math problems, Science experiments, Writing process. Community: Shopping, using public transportation, restaurant ordering.

TROUBLESHOOTING:
Learner stuck on certain steps: Break step into smaller sub-steps, Use additional prompting, Try different prompt type, Ensure prerequisite skills present, Check if physical limitations preventing success.

Losing previously mastered steps: Review maintenance trials on mastered steps, May need to back up and re-teach, Ensure sufficient practice before moving forward.

Task analysis inaccurate: Revise based on learner performance, Add missing steps, Combine or separate steps as needed, Flexibility to modify.`);

updateTopic('skill-acquisition', 'skill-2', `Shaping develops new behaviors through differential reinforcement of successive approximations toward a target behavior. It's used when the terminal behavior is not currently in the individual's repertoire.

DEFINITION:
Shaping (differential reinforcement of successive approximations) is reinforcing responses that progressively resemble the terminal behavior while extinguishing prior approximations.

WHEN TO USE SHAPING:
Target behavior not currently emitted (can't reinforce what doesn't occur). Behavior exists but needs refinement (quality, topography, accuracy). Gradual progression needed (safety, complexity). Creating entirely new response form.

NOT needed when: Behavior already occurs (can reinforce directly), Can prompt full response, Task can be analyzed into discrete steps (use chaining instead).

SHAPING PROCESS:

STEP 1 - DEFINE TERMINAL BEHAVIOR:
Clearly specify end goal: Exactly what will the final behavior look like? What criteria must be met? Observable and measurable definition.

Example: "Student will write name legibly within 30 seconds" - specific terminal behavior.

STEP 2 - DETERMINE STARTING POINT:
Assess current behavior level. What CAN individual do now that resembles goal?

Examples: For writing name: Can hold pencil, Can make marks on paper. For conversation: Can make vocal sounds, Can imitate single words.

Start where success is possible.

STEP 3 - IDENTIFY APPROXIMATIONS:
Plan progression from current level to terminal behavior. What intermediate steps bridge the gap?

Make steps: Small enough for achievable success, Large enough to show progress, Sequential (each builds on previous).

EXAMPLE - SHAPING CIRCLE DRAWING:
Current: Random marks on paper.
Approximations: 1) Any marks on paper, 2) Curved marks, 3) Curved marks that connect, 4) Rough circle shape, 5) Smoother circle, 6) Circle meeting size criterion.

Terminal: Recognizable circle within size parameters.

STEP 4 - REINFORCE CURRENT APPROXIMATION:
Begin reinforcing best current performance. Set initial criterion at level child achieves now.

Reinforce consistently until: Behavior stabilizes, Occurs reliably, Establishes as baseline for next step.

STEP 5 - SHIFT CRITERION:
Stop reinforcing current level (extinction). Reinforce only better approximations (next level toward goal).

DIFFERENTIAL REINFORCEMENT: Better forms = reinforcement. Previous forms = extinction.

Example: Was reinforcing any curved mark → Now reinforce only curves that nearly connect. Partial curves no longer produce reinforcement.

STEP 6 - REPEAT:
Continue shifting criterion toward goal: Reinforce new approximation level, When stable, shift criterion again, Closer and closer to terminal behavior, Until final goal achieved.

STEP 7 - MAINTAIN TERMINAL BEHAVIOR:
Once goal reached, maintain through: Continued reinforcement (thin to intermittent schedule), Practice opportunities, Generalization programming.

PRINCIPLES OF EFFECTIVE SHAPING:

START WHERE LEARNER IS:
Begin at current performance level. Ensure initial success and reinforcement.

PROGRESS GRADUALLY:
Small enough steps to maintain success. If too large: Learner can't achieve next level, Frustration and extinction occur, May lose previously shaped behavior.

DON'T RUSH:
Allow sufficient time at each level before advancing. Stability at one approximation before shifting to next.

DON'T STALL:
If learner consistently exceeds current criterion, advance. Holding at too-easy level wastes time and may bore learner.

BALANCE is key: Fast enough to maintain progress, slow enough to maintain success.

FLEXIBILITY:
Pre-plan approximations but adjust based on learner response: If progressing faster, skip planned steps. If struggling, add intermediate steps, slow pace. If regression occurs, back up to previous approximation.

Data guide decisions, not rigid plan.

DIFFERENTIAL REINFORCEMENT:
Critical mechanism: Better approximations = reinforcement. Previous approximations = extinction (no longer reinforced).

This contingency moves behavior toward goal.

COMMON SHAPING TARGETS:

TOPOGRAPHY (FORM):
Shaping how behavior looks: Handwriting (from scribbles to letters), Speech articulation (from approximations to clear words), Motor skills (from crude to refined movements).

DURATION:
Shaping how long: Sitting duration (from 30 seconds to 5 minutes), Exercise duration (from 2 minutes to 20 minutes), On-task duration.

FORCE/INTENSITY:
Louder/quieter speech, Harder/softer pencil pressure, More/less forceful actions.

ACCURACY:
Closer to target: Basketball shooting closer to basket, More accurate answers, Nearer to correct position.

LATENCY:
Quicker responses: Faster compliance with instructions, Quicker social responses, Reduced response time.

CHALLENGES:

TOO-LARGE STEPS:
Learner can't achieve next approximation. Behavior deteriorates or plateaus.

SOLUTION: Add intermediate steps, reduce criterion requirement temporarily, provide additional prompting at new level, reinforce closer approximations.

TOO-SMALL STEPS:
Progress unnecessarily slow. Learner becomes bored.

SOLUTION: Combine steps, advance criterion more quickly, skip some planned approximations if learner exceeds them.

REGRESSION:
Behavior worsens, returns to earlier approximation.

CAUSES: Advanced criterion too quickly, Insufficient reinforcement, Lost motivation, Fatigue.

SOLUTIONS: Back up to previous approximation where success occurred. Increase reinforcement density. Check motivation/establishing operations. Slower criterion changes.

PLATEAU:
Behavior stops progressing, stuck at one approximation.

SOLUTIONS: Increase reinforcement for any improvement. Temporarily lower criterion slightly then rebuild. Add prompts to help reach next level. Take break and return fresh. Check if approximation sequence appropriate.

REINFORCER ISSUES:
Motivation decreases, reinforcer loses effectiveness.

SOLUTIONS: Vary reinforcers, Conduct new preference assessment, Pair with more powerful reinforcers, Ensure deprivation/motivation present.

EXAMPLES:

SHAPING VERBAL BEHAVIOR:
From: Random vocalizations.
Through: Sounds resembling target word, Partial word, Full word (rough pronunciation), Clearer pronunciation.
To: Clear, correct word production.

SHAPING SOCIAL APPROACH:
From: No peer interaction.
Through: Being near peers, Looking at peers, Parallel play, Brief interactions, Mutual engagement.
To: Sustained cooperative play.

SHAPING COMPLIANCE:
From: No response to instructions.
Through: Partial movements toward task, Touching materials, Attempting task, Completing with prompts, Independent completion.
To: Immediate, independent compliance.

COMBINING WITH OTHER PROCEDURES:
Shaping + Prompting: Prompt to help reach next approximation, Fade prompts as approximation stabilizes.

Shaping + Chaining: Shape quality/form of each step in task analysis.

Shaping + Fading: Shape while fading prompts simultaneously.

DATA AND PROGRESS MONITORING:
Graph successive approximations: X-axis = sessions/time, Y-axis = approximation level or quality measure, Shows progression toward terminal behavior, Visual record of shaping progress.

Adjust based on data trends: Plateau = modify approach, Rapid progress = advance faster, Regression = slow down or back up.`);

updateTopic('skill-acquisition', 'skill-3', `Generalization and maintenance ensure learned skills occur across appropriate contexts and persist over time. Both must be actively programmed, not assumed.

GENERALIZATION DEFINITION:
Responding in the presence of novel (untrained) stimuli, settings, or situations that share relevant features with training conditions. The behavior "spreads" beyond exact training context.

TYPES OF GENERALIZATION:

STIMULUS GENERALIZATION:
Responding to stimuli physically similar to training stimuli but not identical. Example: Taught "dog" with one picture → Labels all dogs including novel pictures, real dogs, different breeds.

Occurs across: Different examples of same stimulus, Variations in materials, Different people, Novel contexts sharing features.

SETTING/SITUATION GENERALIZATION:
Behavior occurs in settings beyond where trained. Example: Taught hand-raising in therapy room → Raises hand in classroom, at home, in community.

Must program explicitly: Practice in multiple settings, Use common stimuli, Train with varied contexts.

RESPONSE GENERALIZATION:
Functionally similar (but topographically different) responses emerge. Example: Taught saying "hi" → Also waves, smiles (greetings). Taught compliance with "sit" → Also complies with "stand," "come here."

Responses serve same function.

MAINTENANCE DEFINITION:
Continued performance over time after intervention reduced or withdrawn. Behavior persists after teaching ends.

Without maintenance: Behavior deteriorates after intervention stops. Skills "lost" when programming ends.

PROGRAMMING FOR GENERALIZATION:

STRATEGY 1 - TRAIN SUFFICIENT EXEMPLARS:
Teach enough examples that learner responds to novel untrained examples.

General rule: 3-5+ exemplars often sufficient. More needed for: Abstract concepts, Widely varying stimuli, Limited generalization in past.

Example: Teaching "red" - show red ball, red car, red crayon, red shirt. After sufficient examples, labels novel red items without training.

STRATEGY 2 - TRAIN LOOSELY:
Vary non-critical aspects during training: Different trainers, Different locations, Different materials, Different times of day, Variation in instructions/prompts.

Less rigid training = better generalization.

STRATEGY 3 - USE INDISCRIMINABLE CONTINGENCIES:
Make reinforcement schedule unpredictable. Intermittent reinforcement. Varied timing. Don't announce when reinforcement will occur.

Result: Behavior continues in non-reinforced situations (can't discriminate when reinforcement available).

STRATEGY 4 - PROGRAM COMMON STIMULI:
Use materials/stimuli present in generalization setting during training.

Example: Teaching lunchroom behavior → Use actual cafeteria trays, foods, setup in training.

Common stimuli aid transfer to natural environment.

STRATEGY 5 - TEACH IN NATURAL ENVIRONMENT:
In-situ training (teaching in actual setting where skill needed).

Example: Teaching grocery shopping → Teach in actual grocery store.

Ultimate generalization programming - eliminates need to transfer.

STRATEGY 6 - MEDIATE GENERALIZATION:
Teach learner to self-manage, self-monitor, or recruit reinforcement.

Makes learner active agent in maintaining behavior across contexts.

Example: Self-monitoring on-task behavior → Takes monitoring across settings.

STRATEGY 7 - GENERAL CASE PROGRAMMING:
Teach to respond to range of relevant stimulus conditions and response requirements.

Identify: Full range of relevant stimuli, Full range of acceptable responses, Teach sampled examples representing range.

Results in generalized performance across entire range.

PROGRAMMING FOR MAINTENANCE:

THIN REINFORCEMENT SCHEDULES:
Gradually reduce reinforcement density from continuous to intermittent. Thin to schedules resembling natural environment.

Process: CRF during acquisition → FR2 → FR5 → VR5 → VR10 → natural rates.

Thinning makes behavior less dependent on constant reinforcement.

USE NATURAL REINFORCERS:
Shift from arbitrary to natural reinforcement. Natural consequences maintain behavior long-term.

Example: Teaching social skills → Use peer social responses (natural) not just adult praise (arbitrary).

Plan for natural reinforcement to take over.

TRAIN TO NATURAL MAINTAINING CONTINGENCIES:
Identify what will maintain behavior in natural environment. Ensure those contingencies present. Fade artificial supports.

Example: Hand-raising maintained by teacher calling on student (natural) rather than special tokens (artificial).

OVERLEARNING AND PRACTICE:
Continue practice beyond initial mastery. Distributed practice over time strengthens retention.

BOOSTER SESSIONS:
After fading intervention, periodic brief re-training sessions. Prevents deterioration. Quick review maintains skills.

TEACHING SELF-MANAGEMENT:
Learner monitors own behavior, delivers own consequences, maintains own performance.

Promotes maintenance when external supports reduced.

SEQUENTIAL MODIFICATION:
If doesn't generalize naturally, systematically program generalization to each desired setting/context.

Accept that explicit programming needed. Sequentially intervene in each context.

MONITORING:
GENERALIZATION PROBES: Test performance in untrained settings with untrained stimuli. Periodic checks of generalization. Data guide decisions about additional programming.

MAINTENANCE PROBES: Test performance after intervention reduced/withdrawn. 1 week, 1 month, 3 months, 6 months post-intervention. Long-term follow-up.

FAILURES TO GENERALIZE/MAINTAIN:

COMMON CAUSES: Insufficient exemplars taught, Reinforcement too dense (can't thin to natural rates), Discriminable contingencies (knows when reinforcement available), Natural contingencies don't support behavior, Punishment in generalization setting.

SOLUTIONS: Additional programming, More exemplars, Natural reinforcement, Reduce discriminability, Address barriers in natural environment.

ETHICAL IMPERATIVE:
Not sufficient to teach skill that disappears or only occurs in therapy. Effective intervention produces durable, generalized change.

MUST program for: Behavior useful across relevant settings, Maintained over time, Functional in daily life.`);

updateTopic('skill-acquisition', 'skill-4', `Stimulus control exists when behavior reliably occurs in the presence of a discriminative stimulus (SD) and not in its absence. Discrimination training establishes this control.

DEFINITION:
Stimulus control: A strong correlation between a stimulus and a behavior. The stimulus reliably evokes the response.

DISCRIMINATIVE STIMULUS (SD): Antecedent stimulus signaling reinforcement is available for a behavior. Sets the occasion for responding.

S-DELTA (SΔ): Antecedent stimulus signaling reinforcement NOT available. Occasions non-responding.

THREE-TERM CONTINGENCY: SD → Response → Reinforcement, SΔ → Response → No Reinforcement (extinction).

EXAMPLES:
Phone ringing (SD) → Answering → Conversation. Phone silent (SΔ) → No answering.

Green light (SD) → Driving → Safe travel. Red light (SΔ) → Stopping → No accident.

"What's 2+2?" (SD) → "4" → Praise. "What's 5+3?" (Different SD) → "8" → Praise.

STIMULUS CONTROL DEMONSTRATED:
High probability of response in presence of SD. Low probability in presence of SΔ. Clear differential responding. Discrimination established.

DISCRIMINATION TRAINING:

PROCEDURE:
Present SD → If correct response → Reinforce immediately.
Present SΔ → If incorrect response (responding to SΔ) → Extinction (no reinforcement). If correct response (not responding to SΔ) → May reinforce absence.

DIFFERENTIAL REINFORCEMENT: Consequences differ based on stimulus present. Responding to SD produces reinforcement. Responding to SΔ doesn't.

PROCESS:
Initially: May respond to both SD and SΔ (hasn't discriminated). Through differential reinforcement: Responding to SD increases (reinforced), Responding to SΔ decreases (extinguished). Eventually: Responds reliably to SD, Doesn't respond to SΔ.

Discrimination established!

SIMPLE DISCRIMINATION:
One SD vs one SΔ. Example: Red card (SD) → clap gets reinforced. Blue card (SΔ) → clapping not reinforced.

CONDITIONAL DISCRIMINATION (MATCHING-TO-SAMPLE):
Response depends on sample stimulus (if-then relation). Example: If sample is RED → select red comparison (correct). If sample is BLUE → select blue comparison (correct).

"If A, then do X; if B, then do Y." More complex discrimination.

FACTORS AFFECTING ACQUISITION:

SALIENCE OF STIMULI:
SD and SΔ must be clearly discriminable. If too similar, hard to learn discrimination.

Enhance salience: Exaggerate differences initially, Gradually fade to natural differences (stimulus fading), Use attention-getting features initially.

REINFORCEMENT MAGNITUDE:
Stronger reinforcement for correct SD responses → Faster discrimination.

Clear contingency: SD response = strong reinforcement, SΔ response = nothing.

IMMEDIACY:
Immediate reinforcement for SD responses. Immediate feedback for SΔ responses (no reinforcement).

Delays blur discrimination.

CONSISTENCY:
Always reinforce SD responses. Never reinforce SΔ responses.

Inconsistency prevents clear discrimination learning.

ERRORLESS LEARNING:
Minimize errors during discrimination training. Methods: Start with very different SD and SΔ (easy discrimination), Use prompts to ensure correct responding, Gradually introduce more difficult discriminations (stimulus fading), Immediate reinforcement prevents errors.

BENEFITS: Reduces frustration, Faster learning for some, Prevents error patterns, Good for difficult discriminations.

PROCESS: Make SD very salient, SΔ less salient initially. Gradually equate salience (fade). Learner discriminates with few errors.

EXAMPLE: Teaching "touch red" vs "touch blue": Start: Red very bright, blue very dim (easy). Gradually equate brightness (fade). End: Normal red and blue, discrimination maintained.

STIMULUS FADING:
Gradually changing stimulus features while maintaining discrimination. Fade irrelevant prompts: Exaggerated size → normal size, Bright colors → standard colors, Position prompts → no prompts.

STIMULUS SHAPING:
Gradually changing stimulus from initial easy form to final natural form. Example: Teach "A" starting with clear printed A, gradually shift to various fonts, handwritten forms. Discrimination generalizes across variations.

OVERGENERALIZATION:
Responding to stimuli that share some but not all relevant features.

Example: Calls all four-legged animals "dog" (overextended tact). Responds to "sit" and "hit" same way (auditory similarity).

CORRECTION: Present contrasting SDs, Differential reinforcement for correct discriminations, Additional exemplar training.

APPLICATIONS:

ACADEMIC SKILLS: Letter/number discrimination, Math operation selection (+ vs - vs ×), Reading (different letter sounds), Vocabulary (different word meanings).

SOCIAL SKILLS: Context-appropriate behavior (library vs playground), Discriminating social cues (person wants to talk vs wants to be alone), Reading facial expressions/body language.

SAFETY SKILLS: Stop at red light/go at green, Don't touch hot stoves (discriminate hot vs cold), Safe vs unsafe strangers (complex discrimination).

FOLLOWING INSTRUCTIONS: Discriminating different instructions: "Touch nose" vs "touch toes" vs "clap hands." Must discriminate specific instruction to respond correctly.

MULTIPLE-STIMULUS DISCRIMINATION:
Field of stimuli - select correct one. Matching-to-sample: Sample stimulus, array of comparisons, select matching comparison.

Identity matching (same stimuli), Arbitrary matching (related but different stimuli).

Foundation for: Reading, Academic skills, Complex discriminations, Stimulus equivalence.

TRANSFER OF STIMULUS CONTROL:
Shifting control from one stimulus to another. Example: Initially responds to prompt (prompt has control) → Transfer control to natural SD (through fading).

Procedure: Present target SD + controlling prompt. Fade prompt gradually. SD comes to evoke response without prompt.

DATA COLLECTION:
Track: Percentage correct responses to SD, Percentage correct rejections of SΔ (didn't respond), Discrimination index or ratio, Errors to both SD and SΔ.

High percentage responses to SD + low percentage to SΔ = good stimulus control.`);

updateTopic('skill-acquisition', 'skill-5', `Teaching complex skills requires combining multiple procedures: task analysis, chaining, prompting, shaping, and discrimination training. Systematic instruction with data-based decisions produces effective learning.

DEFINING COMPLEX SKILLS:
Complex skills involve: Multiple steps or components, Integration of several simple skills, Coordination across domains (motor + cognitive + social), Context-dependent variations, Generalization across situations.

Examples: Preparing meals (task analysis + safety + problem-solving), Engaging in conversations (multiple verbal operants + social discrimination), Job tasks (motor skills + following instructions + quality standards), Independent living (self-care + time management + decision-making).

ASSESSMENT BEFORE TEACHING:

IDENTIFY PREREQUISITE SKILLS:
What must learner be able to do before teaching complex skill?

For cooking: Can follow instructions, Has safety awareness, Can discriminate quantities/measurements, Can use utensils.

Teach prerequisites first if absent.

CONDUCT BASELINE ASSESSMENT:
What can learner already do related to target skill? Which components present, which need teaching? Start where learner is, not assuming zero skills.

PRIORITIZE TARGETS:
Select complex skills based on: Functional importance (will improve life quality), Family priorities, Age-appropriateness, Prerequisite for other skills, Safety considerations, Social validity.

COMBINING TEACHING PROCEDURES:

TASK ANALYSIS + CHAINING:
Break complex skill into steps (task analysis). Teach steps using forward, backward, or total task chaining.

Example: Getting dressed → Task analysis of clothing sequence → Teach using backward chaining (starts with pulling shirt down - final step - working backward).

DISCRIMINATION TRAINING:
Teach when/where/with whom to perform skills. Identify relevant SDs (discriminative stimuli for when skill appropriate).

Example: Teaching greetings → Must discriminate familiar vs unfamiliar people, formal vs informal contexts, different greeting types.

PROMPTING AND FADING:
Support complex skill performance initially. Systematically fade to independence.

Example: Multi-step vocational task → Start with full prompting, Fade to independence on each step, Eventually completes entire task independently.

SHAPING QUALITY:
Refine how skill is performed. Initially accept crude performance, Shape toward fluent, efficient, quality performance.

Example: Can complete task but slowly/awkwardly → Shape speed, accuracy, quality.

REINFORCEMENT:
Initially high density for complex skill attempts, Fade to natural reinforcement, Reinforce completion, Reinforce quality improvements.

TEACHING STRUCTURED APPROACH:

SYSTEMATIC INSTRUCTION:
Clear operational definitions of target skills, Baseline data collection, Planned teaching procedures, Consistent implementation, Frequent data collection, Data-based modifications.

DISTRIBUTED PRACTICE:
Practice opportunities distributed over time (not all massed in one session). Distributed = better retention than massed for complex skills.

VARIED PRACTICE:
Practice under varied conditions: Different contexts, Different materials, Different people.

Builds generalization.

TEACHING IN NATURAL CONTEXTS:
Teach complex skills where they'll be used when possible: Life skills taught in home/community, Academic skills in classroom, Social skills in natural social settings, Job skills at actual worksite.

In-situ training provides: Realistic practice, Natural discriminative stimuli, Natural reinforcement, Built-in generalization.

BALANCING STRUCTURE AND NATURALISM:
STRUCTURE provides: Clear teaching trials, Systematic prompting, Controlled practice, Intensive learning opportunities.

NATURALISM provides: Realistic contexts, Functional application, Generalization, Natural reinforcement.

BEST PRACTICE: Combine both. Initial structured teaching → Transfer to natural contexts. Structured + naturalistic sessions mixed.

INCORPORATING LEARNER MOTIVATION:

USE PREFERRED ACTIVITIES:
Embed teaching in activities learner enjoys. Link skills to preferred outcomes.

Example: Teaching math using favorite snacks for problems, money for purchases.

CHOICE-MAKING:
Offer choices within instruction: Which skill to work on first, Which materials to use, Preferred reinforcers, Break timing.

Choice increases motivation without sacrificing learning.

FUNCTIONAL OUTCOMES:
Connect skills to meaningful outcomes for learner. "Once you can ___, you'll be able to ___."

Example: "Once you learn bus route, you can visit friends independently."

ERRORLESS LEARNING:
For complex skills where errors frustrating or dangerous: Strong prompting initially (ensure success), Systematic fading (reduce prompts gradually), Minimizes frustration and failure.

Useful for: Safety skills, Skills with dangerous errors, Learners with low frustration tolerance.

DATA-BASED DECISION MAKING:

WHAT TO MEASURE:
Accuracy (correctness of performance), Independence (percentage without prompts), Fluency (speed of correct performance), Quality (how well performed), Generalization (performance in novel conditions), Maintenance (retention over time).

WHEN TO ADVANCE:
Mastery criteria met (usually 80-90% across 2-3 sessions). Performance stable. Skills demonstrated across varied conditions.

WHEN TO MODIFY:
No progress after reasonable time (5-10 sessions), Regression, Plateauing, New challenges identified.

Modifications: Adjust prompts, Change reinforcers, Break steps smaller, Add practice opportunities, Modify teaching procedure.

COMPLEX SKILL EXAMPLES:

SELF-CARE:
Tooth brushing (task analysis + motor skills + sequence + independence). Dressing (discrimination of clothing types + motor skills + sequence). Bathing (safety + motor skills + multi-step task).

Progression: Prompting → Independence → Quality → Speed → Maintenance.

ACADEMIC:
Multi-step math (discrimination of operation + computation + checking work). Writing essays (planning + writing + editing + multiple skills). Reading comprehension (decoding + understanding + answering questions).

Integration of multiple component skills.

SOCIAL:
Conversation (multiple verbal operants + topic maintenance + social cues). Friendship skills (initiating + responding + sharing + conflict resolution). Group participation (listening + contributing + turn-taking + cooperation).

Complex social discriminations and coordinated skills.

VOCATIONAL:
Job tasks (motor skills + quality standards + safety + efficiency). Customer service (verbal skills + problem-solving + emotional regulation). Time management (planning + monitoring + adjusting).

Real-world skill integration.

ONGOING ASSESSMENT:
Continuous progress monitoring: Frequent data points on key measures, Probe generalization regularly, Check maintenance periodically, Adjust teaching based on data, Involve learner/family in progress review.

CELEBRATING SUCCESS:
Complex skill acquisition is significant achievement. Recognize progress: Intermediate steps accomplished, Quality improvements, Generalization success, Independence gains.

Motivation maintained through acknowledging progress.`);

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));
console.log('\n✅ BATCH 6 COMPLETE: Skill Acquisition (5 topics)\n');
console.log('Progress: 32/47 topics (68%)\n');

