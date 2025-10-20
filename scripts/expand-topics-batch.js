#!/usr/bin/env node
// Batch Topic Expansion - Expand 5-7 topics at a time
// Run multiple times to complete all topics

const fs = require('fs');

// Configuration
const BATCH_SIZE = 6;
let batchNumber = process.argv[2] ? parseInt(process.argv[2]) : 1;

console.log(`\n📚 BATCH TOPIC EXPANSION - BATCH #${batchNumber}\n`);

const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

function findCategory(id) {
    return content.categories.find(c => c.id === id);
}

function updateTopic(categoryId, topicId, newContent) {
    const category = findCategory(categoryId);
    if (category) {
        const topic = category.topics.find(t => t.id === topicId);
        if (topic) {
            topic.content = newContent;
            const wordCount = newContent.split(/\s+/).length;
            console.log(`✅ Updated: ${topic.title} (${wordCount} words)`);
            return true;
        }
    }
    return false;
}

// ============================================
// BATCH 1: INTERVENTION STRATEGIES (5 topics)
// ============================================

if (batchNumber === 1) {
    console.log('🎯 BATCH 1: Core Intervention Strategies (5 topics)\n');
    
    updateTopic('intervention', 'intervention-1', `Reinforcement is the cornerstone of behavior analysis. Understanding how to implement reinforcement effectively is essential for increasing desired behaviors.

DEFINITION AND PRINCIPLES:
Reinforcement is any consequence that INCREASES the future probability of a behavior. The consequence must actually increase behavior - if behavior doesn't increase, it wasn't reinforcement regardless of intent.

POSITIVE REINFORCEMENT:
DEFINITION: Adding a stimulus following a behavior that increases that behavior. The "positive" means adding/presenting something.

EXAMPLES: Giving praise for completed homework (praise added, homework completion increases), Providing break after work completion (break added, work increases), Receiving paycheck for working (money added, working continues), Child gets toy after requesting appropriately (toy added, requests increase).

KEY PRINCIPLE: The added stimulus must be a REINFORCER for that individual. What's reinforcing varies by person, context, and time. Food may reinforce behavior when hungry but not when satiated.

NEGATIVE REINFORCEMENT:
DEFINITION: Removing an aversive stimulus following a behavior that increases that behavior. The "negative" means removing/subtracting something.

EXAMPLES: Taking aspirin removes headache (aspirin-taking increases), Fastening seatbelt stops annoying beeping (buckling increases), Completing homework stops parent nagging (homework increases), Leaving noisy environment reduces auditory discomfort (leaving increases).

COMMON MISCONCEPTION: Negative reinforcement is NOT punishment. It INCREASES behavior (like positive reinforcement) by removing something aversive. Both positive and negative reinforcement INCREASE behavior.

ESCAPE VS AVOIDANCE:
ESCAPE: Behavior terminates ongoing aversive. Examples: Leaving situation after it becomes unpleasant, Tantrum stops ongoing demand.

AVOIDANCE: Behavior prevents aversive from occurring. Examples: Studying prevents failing (never experience failure), Leaving before situation becomes unpleasant.

Both are negative reinforcement - behavior increases through removal/prevention of aversives.

IMPLEMENTING EFFECTIVE REINFORCEMENT:

IMMEDIACY: Deliver reinforcement immediately after behavior. Delays weaken effect, especially for young children or new skills. "3-second rule" - reinforce within 3 seconds when possible.

CONSISTENCY: Reinforce every occurrence during acquisition (continuous reinforcement). Inconsistency confuses learners and slows learning.

MAGNITUDE: Reinforcement must be powerful enough to motivate. Too weak = insufficient to increase behavior. Too strong = quick satiation. Adjust based on response.

QUALITY: Use high-preference items/activities identified through preference assessment. Vary reinforcers to prevent satiation. Pair with social reinforcement to build conditioned reinforcers.

CONTINGENCY: Reinforcement must be contingent on behavior - delivered only when target behavior occurs. Non-contingent delivery doesn't strengthen behavior.

SCHEDULES OF REINFORCEMENT:
CONTINUOUS (CRF): Reinforce every occurrence. Use during initial acquisition. Rapid learning but quick extinction.

INTERMITTENT: Reinforce only some occurrences. Use for maintenance. Creates more durable behavior resistant to extinction.

Types: Fixed/Variable Ratio (based on number of responses), Fixed/Variable Interval (based on time passage). Variable schedules produce strongest, most persistent responding.

THINNING REINFORCEMENT:
Gradually shift from continuous to intermittent schedules. Prevents dependence on constant reinforcement. Promotes maintenance and resembles natural contingencies.

Procedure: Start CRF during acquisition, Thin to FR2 (every 2nd response), Continue thinning (FR3, FR5, VR5, VR10), Eventually thin to natural rates.

DIFFERENTIAL REINFORCEMENT:
Reinforcing one behavior while withholding reinforcement for other behaviors. Powerful for both increasing desired behavior and decreasing problem behavior.

Types: DRA (reinforce alternative), DRI (reinforce incompatible), DRO (reinforce absence), DRL (reinforce lower rates).

NATURAL VS ARBITRARY REINFORCERS:
NATURAL: Direct result of behavior. Examples: Requesting cookie produces cookie, Opening door leads to going outside. Promotes generalization and maintenance.

ARBITRARY: Unrelated to behavior. Examples: Token for completing task, Praise for sitting quietly. Easier to control but may not maintain without continued delivery.

PREFERENCE: Use natural reinforcers when possible, Pair arbitrary with natural, Fade to natural contingencies over time.

CONDITIONED REINFORCERS:
Neutral stimuli that acquire reinforcing properties through pairing with established reinforcers.

Examples: Praise (paired with attention, tangibles), Tokens (paired with backup reinforcers), Grades (paired with privileges, parent approval), Money (paired with purchasing power).

ADVANTAGES: Can be delivered immediately even when primary reinforcer unavailable, Don't satiate like consumables, Bridge delays, Can be individualized.

GENERALIZED CONDITIONED REINFORCERS: Paired with multiple backup reinforcers. Examples: Money (buys many things), Praise (associated with many positive outcomes), Tokens (exchangeable for various rewards). Very powerful because they don't depend on single establishing operation.

ETHICAL CONSIDERATIONS:
Use least restrictive effective reinforcement, Prefer positive over negative reinforcement when possible, Ensure reinforcement is appropriate and dignified, Fade to natural contingencies, Don't withhold basic needs/rights to use as reinforcers, Client preference and assent when possible.`);

    updateTopic('intervention', 'intervention-2', `Prompting involves providing supplementary stimuli to increase the likelihood of correct responding. Effective prompting followed by systematic fading is critical for skill acquisition.

DEFINITION:
A prompt is an antecedent stimulus or cue provided to assist a learner in performing a target behavior. Prompts temporarily increase correct responding during acquisition, then must be systematically removed (faded) to achieve independent performance.

TYPES OF PROMPTS (Least to Most Intrusive):

NATURAL CUES:
The discriminative stimulus naturally present in the environment. Not technically a prompt, but the goal is for behavior to come under control of natural cues. Example: Red light is natural cue for stopping.

VERBAL PROMPTS:
DEFINITION: Words or vocal cues that assist responding.

LEVELS: Indirect ("What should you do now?"), Direct ("Touch your nose"), Partial ("To- ..." for tooth brushing).

WHEN TO USE: For learners with strong language skills, Following multi-step directions, Teaching conversational skills.

CAUTION: Can create prompt dependency if overused. Many learners become "prompt-dependent" on verbal instructions.

GESTURAL PROMPTS:
DEFINITION: Non-contact physical movement that cues response. Examples: Pointing to correct item, Nodding head for "yes", Motioning toward direction, Eye gaze toward target.

ADVANTAGES: Less intrusive than physical prompts, Can be subtle and naturalistic, Easy to fade gradually.

WHEN TO USE: Learner attends to gestures, Teaching discrete responses, Supplementing other prompts.

VISUAL PROMPTS:
DEFINITION: Visual cues added to environment. Examples: Pictures showing task steps, Written lists (schedules, checklists), Highlighted correct response, Color coding.

ADVANTAGES: Can remain in place longer without prompt dependency, Support independence, Useful for learners with autism.

FADING: Gradually reduce size, color intensity, or specificity of visual cue.

MODEL PROMPTS:
DEFINITION: Demonstrating the target behavior for learner to imitate.

FULL MODEL: Complete demonstration of entire behavior. Example: "Do this" followed by touching nose while learner imitates.

PARTIAL MODEL: Demonstrating part of behavior. Example: Starting hand movement toward object.

WHEN TO USE: Teaching motor skills, Learners with imitation skills established, Skills that can be observed and copied.

PHYSICAL PROMPTS:
DEFINITION: Physical contact that guides learner through response.

FULL PHYSICAL: Hand-over-hand complete guidance through entire response. Example: Placing hands on learner's hands and guiding full tooth-brushing motion.

PARTIAL PHYSICAL: Light touch or partial guidance. Examples: Tap on elbow to initiate reaching, Light touch on back to prompt forward movement, Guiding initial part of movement.

WHEN TO USE: Motor skills, Safety skills, When other prompts unsuccessful, Initial stages of teaching.

CAUTION: Most intrusive prompt type. Can create dependency. Fade as quickly as possible while maintaining success.

PROMPT HIERARCHIES:

LEAST-TO-MOST PROMPTING (LTM):
PROCEDURE: Present natural SD, Wait for response (3-5 seconds), If incorrect or no response, provide least intrusive prompt, If still incorrect, move to more intrusive prompt, Continue until correct response occurs.

PROGRESSION: Natural cue → Verbal → Gestural → Model → Partial physical → Full physical.

ADVANTAGES: Promotes independence, Learner attempts with minimal help, Reduces prompt dependency, Efficient once established.

DISADVANTAGES: Learner may experience errors/frustration, Slower initially, May reinforce incorrect responding.

WHEN TO USE: Learners with some skill, Low frustration tolerance for errors isn't issue, Skills where errors aren't dangerous.

MOST-TO-LEAST PROMPTING (MTL):
PROCEDURE: Begin with prompts sufficient for success (often physical), Ensure correct responding, Systematically fade to less intrusive prompts, Eventually fade to natural cue alone.

PROGRESSION: Full physical → Partial physical → Model → Gestural → Verbal → Natural cue.

ADVANTAGES: Errorless learning (fewer mistakes), Reduces frustration, Learner experiences success from beginning, Appropriate for difficult skills.

DISADVANTAGES: Risk of prompt dependency, Requires careful systematic fading, May take longer to achieve independence.

WHEN TO USE: New/difficult skills, Learners who become frustrated by errors, Safety-critical skills, Severe disabilities.

SIMULTANEOUS PROMPTING:
PROCEDURE: Training trials use controlling prompt (ensures success), Probe trials test without prompts (checks if learning occurring).

Process: Give instruction + immediate controlling prompt (no wait time), Reinforce correct prompted response, Periodically do probe trials (instruction only, no prompt), Check if learner can respond independently.

ADVANTAGES: No errors during training, Clear assessment of learning, Works well with discrete skills.

PROGRESSIVE TIME DELAY:
PROCEDURE: Gradually increase time between instruction and prompt.

CONSTANT TIME DELAY: Use same delay throughout (e.g., always 4 seconds).
PROGRESSIVE TIME DELAY: Increase delay systematically (0 sec → 2 sec → 4 sec → 6 sec).

PROCESS: Begin 0-second delay (instruction and prompt simultaneously - errorless), Increase delay gradually (2 seconds, then 4 seconds, etc.), If learner responds correctly before prompt, reinforce and praise (unprompted response!), If no response or error, deliver prompt.

ADVANTAGES: Systematic, research-supported, Transfers control gradually, Data show when independence achieved.

GRADUATED GUIDANCE:
PROCEDURE: Start with physical prompts, Reduce contact as learner demonstrates skill, Shadow (hands near but not touching), Fade to spatial fading (move farther away).

Process: Begin hand-over-hand, Lighten pressure gradually, Touch only lightly, Hover hands near, Move hands farther away, Remove entirely.

ADVANTAGES: Responsive to learner performance, Smooth transition, Physical connection reassuring initially.

STIMULUS FADING AND SHAPING:
STIMULUS FADING: Gradually changing prompts or SDs. Examples: Fading color intensity, Reducing size of visual cue, Decreasing volume.

RESPONSE SHAPING: Reinforcing closer approximations. Use with prompting when developing new responses.

COMMON PROMPTING ERRORS:

PROMPT DEPENDENCY: Learner won't respond without prompts. CAUSES: Not fading promptly, Inconsistent fading, Waiting for prompts reinforced. SOLUTION: Thin prompts more quickly, Reinforce unprompted responses more strongly, Ensure fading is systematic.

PREMATURE FADING: Removing prompts before learner ready, causing errors. SOLUTION: Fade more gradually, Use data to guide fading decisions, Accept slower pace for success.

INCONSISTENT PROMPTING: Sometimes prompting, sometimes not. SOLUTION: Decide prompting strategy and follow consistently, Staff training on prompt procedures.

REINFORCING PROMPTED RESPONSES EQUALLY: Prompted and unprompted get same reinforcement. SOLUTION: Differential reinforcement - more/better reinforcement for unprompted correct responses.

BEST PRACTICES:
Plan prompting strategy before teaching begins, Select hierarchy based on learner needs and skill, Fade as soon as possible while maintaining success, Collect data on prompt levels used, Differentially reinforce less-prompted responses, Train all implementers on prompting procedures, Monitor for prompt dependency and adjust.`);

    updateTopic('intervention', 'intervention-3', `Discrete Trial Training (DTT) is a structured, systematic teaching method involving clear trials with defined beginnings and ends. It's particularly effective for teaching discrete, easily defined skills.

DEFINITION:
DTT is an instructional method where learning opportunities are broken down into discrete, structured trials. Each trial has a clear beginning (antecedent), a response opportunity, and a consequence. Trials are presented in rapid succession with brief inter-trial intervals.

COMPONENTS OF A DISCRETE TRIAL:

DISCRIMINATIVE STIMULUS (SD):
The instruction or cue that signals the learner to respond. Must be clear, consistent, and discriminable.

Examples: "Touch nose," "What's this?" (holding picture), "Clap hands."

Requirements: Brief and clear, Same wording each trial, Presented when learner is attending, Given in neutral tone initially.

RESPONSE:
The learner's behavior following the SD. Can be prompted or independent.

TIME ALLOWED: Typically 3-5 seconds for responding. If no response, move to prompting or re-present.

CORRECT, INCORRECT, OR NO RESPONSE: Score each for data collection.

CONSEQUENCE:
Immediate feedback based on learner's response.

CORRECT RESPONSE: Immediate reinforcement - praise, tangible, activity. Enthusiastic and specific ("Great job touching your nose!").

INCORRECT RESPONSE: Correction procedure - may re-present trial with prompt, brief "Try again," or simply move to next trial. No prolonged attention to errors.

NO RESPONSE: Typically treated like incorrect - provide prompt and re-present.

PROMPTS (if needed): As described in prompting procedures. Use least-to-most or most-to-least hierarchy. Systematically fade.

INTER-TRIAL INTERVAL (ITI):
Brief pause between trials (typically 3-5 seconds). Allows brief break, prevents blending of trials, provides time to record data.

Should be: Brief (not too long - maintain momentum), Consistent duration, Used for data recording, Not reinforcing (neutral time).

DTT SESSION STRUCTURE:

PREPARATION:
Materials ready and organized, Data sheets prepared, Reinforcers identified and available, Minimize distractions, Ensure learner attending.

MASSED VS DISTRIBUTED TRIALS:
MASSED: Multiple trials on same target in succession (5-10 trials of "touch nose"). Advantages: Rapid skill acquisition, Clear focus on one skill. Used during initial acquisition.

DISTRIBUTED: Mixing multiple targets within session (1 trial "touch nose," 1 trial "clap hands," rotate). Advantages: Maintains attention, Reduces repetition fatigue, Promotes discrimination. Used after initial acquisition.

TYPICAL SESSION: 20-40 trials over 15-30 minutes, Mix of mastered skills (maintenance) and acquisition targets, Start and end with easier tasks (success), More intensive for younger children.

MASTERY CRITERIA:
Define criteria before teaching: Often 80-90% correct across 2-3 sessions, Or 3 consecutive sessions at criterion, Or specific number of consecutive correct responses.

When mastery achieved: Reduce frequency of presentation (maintenance), Introduce in natural environment (generalization), Fade to less structured teaching format (incidental teaching).

DATA COLLECTION:
Record for each trial: SD presented, Response (correct/incorrect/no response/prompted), Prompt level if used.

Calculate: Percentage correct, Percentage prompted, Trend over sessions, Mastery achievement.

ADVANTAGES OF DTT:
High number of learning opportunities in short time, Clear structure aids learning for some children, Easy to collect data on every trial, Effective for discrete, easily defined skills, Strong research support for skill acquisition, Allows precise prompting and fading, Suitable for intensive intervention.

LIMITATIONS AND CONSIDERATIONS:
Can be rigid/artificial compared to natural learning, May not promote generalization without explicit programming, Can be repetitive (boring for some learners), Requires skilled implementation, Less appropriate for complex social skills, Must be balanced with naturalistic teaching.

SKILLS APPROPRIATE FOR DTT:
Receptive language (following instructions, identifying items), Expressive language (labeling, answering questions), Imitation skills, Matching and sorting, Pre-academic skills (letters, numbers, colors), Simple discrimination tasks.

SKILLS LESS APPROPRIATE:
Conversation and social interaction, Creative play, Complex social skills, Context-dependent behaviors, Skills requiring flexibility and spontaneity.

BALANCING DTT WITH OTHER APPROACHES:
DTT should be ONE component of comprehensive programming. Balance with: Natural Environment Teaching (NET) for generalization, Play-based learning for engagement, Incidental teaching for following learner's interests, Group instruction for social skills, Functional activities for meaningful contexts.

EFFECTIVENESS FACTORS:
Skilled implementers (proper training required), Appropriate target selection (discrete skills), Adequate reinforcement, Systematic prompting and fading, Data-based decision making, Embedding maintenance trials, Programming for generalization, Balancing with naturalistic teaching.

ETHICAL IMPLEMENTATION:
Maintain learner dignity and respect, Ensure potent reinforcement (sessions should be enjoyable), Monitor for signs of frustration or satiation, Balance intensive teaching with breaks and preferred activities, Always pair with social interaction and relationship-building, Avoid punishment or harsh correction, Make learning fun!`);

    updateTopic('intervention', 'intervention-4', `Natural Environment Teaching (NET) is a child-led, naturalistic approach that capitalizes on naturally occurring learning opportunities. It complements structured teaching like DTT.

DEFINITION AND PHILOSOPHY:
NET (also called Incidental Teaching, Naturalistic Teaching) involves providing instruction in the natural environment using naturally occurring teaching opportunities. Teaching is embedded in daily activities and routines, following the learner's interests and motivation.

CORE PRINCIPLES:

CHILD-LED:
Instruction follows the child's interests and initiations. Wait for child to show interest in an item/activity, then create teaching opportunity around that interest.

Example: Child reaches for bubbles → Teacher says "Say 'bubbles'" (mand training), Child labels "bubbles" → Teacher blows bubbles (natural reinforcement).

NATURAL REINFORCERS:
Consequences are directly related to the behavior and occur naturally. The reinforcer is what the child wants, not an arbitrary reward.

Examples: Requesting "open" produces jar opening (not a token), Asking "where ball?" leads to finding ball (not praise alone), Requesting "swing" results in pushing swing.

ADVANTAGES: Motivation is high (reinforcer is what child wanted), Generalization built-in (teaching where skill will be used), Maintenance likely (natural contingencies maintain behavior).

NATURAL CONTEXTS:
Teaching occurs in settings where skills are needed: home, playground, community, classroom during regular activities.

Not in isolated therapy room with structured materials, but during: Snack time, Play activities, Daily routines (dressing, bathing), Community outings, Social interactions.

LOOSE TEACHING STRUCTURE:
Unlike DTT's rigid structure, NET is flexible and responsive. No formal discrete trials with set ITI. Teaching embedded fluidly in ongoing activities.

PROCEDURES:

ENVIRONMENTAL ARRANGEMENT:
Set up environment to create learning opportunities. Place preferred items in view but out of reach (prompts requesting), Provide incomplete materials (child needs to ask for missing pieces), Create obstacles (need to request help), Offer choices (practice decision-making and labeling).

CONTRIVED ESTABLISHING OPERATIONS:
Arrange motivation for target behavior. Examples: Give small portions to increase requesting "more", Use containers child can't open to prompt "help", Begin preferred activity then pause to prompt continuation requests.

INCIDENTAL TEACHING:
Wait for child initiation, Provide instruction opportunity, Reinforce with natural consequences.

STEPS:
1. Arrange environment to encourage initiations
2. Wait for child to initiate (reach, vocalize, approach)
3. Elaborate/expand on initiation (model better response, ask question)
4. If child responds, provide natural reinforcer immediately
5. If doesn't respond, provide brief prompt then reinforce
6. Continue activity naturally

Example: Child says "car" → Adult says "red car" (model expansion) → Child imitates "red car" → Gets to play with red car.

MAND-MODEL PROCEDURE:
When child initiates, provide model of better/more complete response.

Procedure: Child initiates (reaches for toy), Adult provides mand ("Say 'car'") or model ("Say 'I want car'"), Child imitates, Receives natural reinforcer (gets car).

Fading: Reduce specificity of prompts over time, Expect more complex responses, Fade to natural cues.

TIME DELAY:
Create pause to prompt independent responding. Child reaches for item, Adult waits (time delay - 2-5 seconds) for verbal request, If child requests, provide item immediately, If no request by end of delay, provide model/mand.

BALANCING STRUCTURE WITH NATURALISM:
NET can be more or less structured depending on needs:

HIGHLY STRUCTURED NET: Planned activities with specific targets, Clear data collection, Arranged environment with planned opportunities.

LOOSELY STRUCTURED NET: Capitalize on completely natural opportunities, Responsive to child in moment, Data collected informally.

Both are valid - choice depends on goals and learner needs.

ADVANTAGES OF NET:
Follows child motivation (high engagement), Natural reinforcers (strong, meaningful), Generalization built-in (teaching in natural context), Family-friendly (parents can implement), Functional communication emphasized, Reduces prompt dependency, Maintains natural social interactions, Skills learned where they'll be used.

CHALLENGES:
Fewer trials per time compared to massed DTT, Requires skilled opportunistic teaching, Data collection can be challenging, Needs environmental arrangement, May miss some teaching opportunities, Less control over variables.

COMBINING DTT AND NET:
BEST PRACTICE: Use both approaches complementarily.

DTT FOR: Initial acquisition of discrete skills, High trial frequency needed, Specific skill building, Clear measurement.

NET FOR: Generalization of mastered skills, Functional communication, Social interaction skills, Maintenance of learned skills, Following learner motivation.

SEQUENCE: Often teach with DTT until skill emerges, then shift to NET for fluency, generalization, and maintenance.

IMPLEMENTING NET:

PLANNING: Identify target skills appropriate for NET, Plan environmental arrangements, Identify natural routines/activities for teaching, Train implementers on opportunistic teaching.

DURING ACTIVITIES: Attend to child's interests and initiations, Create opportunities through arrangement, Respond to initiations with elaboration/instruction, Provide natural reinforcers, Embed learning in flow of activity.

DATA COLLECTION: Can use frequency tallies, Narrative notes on opportunities and responses, Rating scales for skill demonstration, Less formal than DTT but still data-based.

EXAMPLES IN DAILY ROUTINES:

SNACK TIME: Practice requesting items/actions (mands), Label foods (tacts), Follow instructions ("get cup"), Social interaction (sharing, turn-taking).

PLAY: Request toys/activities, Imitate play actions, Label toys and actions, Follow game rules, Social skills with peers.

TRANSITIONS: Follow instructions, Request help, Make choices, Independent navigation.

FAMILY INVOLVEMENT:
NET is ideal for parent implementation. Natural activities provide teaching opportunities throughout the day. Coaching parents to: Arrange environment, Wait for initiations, Provide prompts naturally, Use natural reinforcers, Practice during daily routines.`);

    updateTopic('intervention', 'intervention-5', `Behavior reduction procedures aim to decrease problem behavior while teaching appropriate alternatives. Function-based approaches are most effective and ethical.

FUNDAMENTAL PRINCIPLE:
Always combine behavior reduction with skill building. Reduce problem behavior while simultaneously teaching what to do instead. Reduction without replacement teaches what NOT to do but not what TO do.

FUNCTION-BASED APPROACH:

IDENTIFY FUNCTION FIRST:
Conduct FBA to determine why behavior occurs (attention, escape, tangible, automatic). Function guides intervention selection. Same topography, different function = different intervention.

Example: Screaming for attention requires different intervention than screaming to escape demands.

MATCH INTERVENTION TO FUNCTION:
ATTENTION-MAINTAINED: Extinction (withhold attention), DRA (reinforce appropriate attention-seeking), Teach functional communication.

ESCAPE-MAINTAINED: Extinction (don't allow escape), Modify antecedents (reduce task difficulty, provide breaks), DRA (reinforce task completion), Teach requesting breaks appropriately.

TANGIBLE-MAINTAINED: Extinction (don't provide item), Schedule access (non-contingent or on schedule), DRA (reinforce waiting, requesting appropriately).

AUTOMATIC/SENSORY: Enrich environment, Provide alternative sensory input, Teach self-management, May require medical consultation.

ANTECEDENT INTERVENTIONS (PREVENT BEFORE IT OCCURS):

NON-CONTINGENT REINFORCEMENT (NCR):
DEFINITION: Providing reinforcement on a time-based schedule independent of behavior. Prevents deprivation that motivates problem behavior.

PROCEDURE: Identify maintaining reinforcer, Deliver it on fixed-time schedule (e.g., every 2 minutes) regardless of behavior, Problem behavior no longer needed to access reinforcement.

Example: If tantrums maintained by attention, provide attention every 3 minutes freely. Tantrums become unnecessary.

FADING: Gradually increase interval between reinforcer deliveries.

ENVIRONMENTAL MODIFICATION:
Change setting events or antecedents that evoke problem behavior.

Examples: Reduce task difficulty (if escape-maintained), Provide adequate sleep/food (setting events), Remove or reduce aversive stimuli, Increase predictability (visual schedules), Modify seating arrangement, Adjust activity duration.

HIGH-PROBABILITY REQUEST SEQUENCE:
Present several easy tasks (high-probability compliance) before difficult task (low-probability). Compliance momentum increases likelihood of completing difficult task.

Procedure: Give 3-5 easy instructions child typically follows, Praise compliance with each, Immediately present target difficult instruction, Momentum of compliance carries over.

FUNCTIONAL COMMUNICATION TRAINING (FCT):
DEFINITION: Teaching an appropriate communicative alternative to problem behavior serving same function.

PROCEDURE: Identify function of problem behavior, Teach functionally equivalent communication response (FER), Reinforce communication with functional reinforcer, Extinguish problem behavior (no longer produces reinforcer).

Example: Aggression to escape demands → Teach "break please" → Requesting break produces break, Aggression no longer produces escape.

ADVANTAGES: Addresses function directly, Teaches what to do, Reduction + skill building, Socially acceptable, Generalizable.

CONSEQUENCE-BASED PROCEDURES:

EXTINCTION:
Withholding the reinforcer that previously maintained behavior. If attention maintained behavior, withhold attention. If escape maintained, don't allow escape.

EXTINCTION CHARACTERISTICS: Extinction burst (temporary increase), Spontaneous recovery (reappearance after pause), Increased variability, Possible aggression, Takes time to work.

REQUIREMENTS: Identify maintaining reinforcer correctly, Withhold consistently (100% consistency), Have safety plan for bursts, Combine with reinforcement of alternative behavior.

DIFFERENTIAL REINFORCEMENT:
Reinforcing target behaviors while withholding reinforcement for problem behavior.

DRA (Differential Reinforcement of Alternative): Reinforce any appropriate behavior, extinguish problem behavior.

DRI (Differential Reinforcement of Incompatible): Reinforce behavior physically incompatible with problem behavior. Example: Hands down incompatible with hitting.

DRO (Differential Reinforcement of Other): Reinforce absence of problem behavior for interval. Example: Reinforce every 5 minutes problem behavior didn't occur.

DRL (Differential Reinforcement of Low rates): Reinforce when behavior occurs at lower rate. Used for behaviors to reduce but not eliminate.

TIMEOUT FROM POSITIVE REINFORCEMENT:
Removing access to reinforcement for brief period following problem behavior. Not "timeout" as sending child away, but timeout from reinforcement.

Types: Exclusionary (remove from environment), Non-exclusionary (remain in environment but no reinforcement access).

Duration: Brief (1-5 minutes typically, sometimes age in minutes), Must be from reinforcing environment (timeout from boring situation isn't effective).

Requirements: Environment must be reinforcing (or timeout isn't punishing), Applied consistently and immediately, Release contingent on appropriate behavior or time elapsed, Monitor during timeout for safety.

RESPONSE COST:
Removing specific amount of reinforcer contingent on problem behavior. Type of negative punishment.

Examples: Losing tokens for rule violations, Losing minutes of recess for problem behavior, Removal of privileges.

Requirements: Reinforcers to remove must exist (can't lose what you don't have), Amount proportional to behavior, Clear rules about what behaviors lose what amount, Combined with reinforcement for appropriate behavior.

POSITIVE PUNISHMENT:
Adding aversive stimuli to decrease behavior. LEAST PREFERRED option in ABA. Used only when: Other procedures failed, Behavior dangerous, Benefits outweigh risks, Informed consent obtained, Close monitoring, Plan to fade.

Examples (if used): Overcorrection (restore environment plus practice correct form), Contingent exercise (brief physical activity).

NEVER USED: Painful stimuli, Humiliation, Anything degrading or harmful.

CRISIS/SAFETY PROCEDURES:
When behavior dangerous to self or others:

BLOCKING: Preventing behavior from occurring (blocking hit before contact). Not punishment, just prevention.

RESPONSE INTERRUPTION: Stopping behavior sequence before completion.

PHYSICAL RESTRAINT: Last resort, only for immediate safety, Brief as possible, Trained staff, Documentation, Debriefing after incident.

SELECTING PROCEDURES - ETHICAL HIERARCHY:

START LEAST RESTRICTIVE:
1. Antecedent modifications
2. Enriching environment
3. Reinforcement-based procedures
4. Extinction combined with reinforcement
5. Differential reinforcement
6. Time-out or response cost (if needed)
7. Positive punishment (last resort, rarely)

CONSIDERATIONS:
Effectiveness research for procedure, Risks vs benefits, Social acceptability, Client dignity, Least restrictive effective approach, Informed consent, Monitoring and oversight.

BEHAVIOR SUPPORT PLAN COMPONENTS:
Operational definition of target behavior, Identified function, Antecedent strategies, Teaching alternative skills, Reinforcement procedures, Reactive strategies (if problem behavior occurs), Crisis procedures (if dangerous), Data collection plan, Review schedule.

BEST PRACTICES:
Always assess function first, Prioritize teaching over punishment, Use antecedent strategies proactively, Combine multiple procedures, Ensure consistent implementation, Monitor data regularly, Modify based on outcomes, Fade restrictive procedures as behavior improves, Plan for generalization and maintenance.`);

    updateTopic('intervention', 'intervention-4', `Natural Environment Teaching (NET) uses naturalistic learning opportunities embedded in daily activities. It follows the learner's interests and motivation rather than a structured teaching agenda.

CORE PHILOSOPHY:
Learning should occur in the context where skills will be used, using materials and activities that are naturally motivating. Teaching is responsive to the learner rather than adult-directed.

CONTRASTS WITH DTT:
DTT: Adult-selected targets, Structured trials, Massed practice, Arbitrary reinforcers often.
NET: Child-selected interests, Naturalistic opportunities, Distributed practice, Natural reinforcers.

Both are valuable - NET particularly powerful for generalization.

IMPLEMENTATION STRATEGIES:

FOLLOW THE CHILD'S LEAD:
Observe what child is interested in or attending to. Use that interest as teaching opportunity.

Example: Child looks at ball → Teach "ball" (tact), "I want ball" (mand), or rolling action (motor skill). Interest provides natural motivation.

ENVIRONMENTAL ARRANGEMENT:
Structure environment to create communication needs and learning opportunities.

STRATEGIES: Place preferred items visible but out of reach (must request), Provide inadequate portions (creates need for "more"), Sabotage activities (give brush without toothpaste - must request missing item), Offer choices (practice decision-making), Provide novel items (creates interest and questions).

NATURAL TEACHING MOMENTS:
Capitalize on naturally occurring situations: Routines (mealtime, bath time, bedtime), Play (toys, games, outdoor play), Social interactions (greetings, turn-taking), Daily activities (dressing, shopping, travel), Preferred activities (snack, favorite games).

INCIDENTAL TEACHING:
Wait for learner initiation, Elaborate or expand, Reinforce with natural consequence.

EXAMPLE: Child points to cookie → Adult models "cookie please" → Child imitates → Gets cookie immediately.

TEACHING IS BRIEF: Quick interaction, then return to natural activity. Doesn't interrupt flow for extended teaching.

LANGUAGE TARGETS IN NET:

MANDS (REQUESTS):
Most natural in NET because motivation is present. Child wants something → Perfect time to teach requesting it.

Use time delay (wait for request before providing), Model requests ("Say 'push'" on swing), Start simple, expand over time ("more" → "more juice please").

TACTS (LABELS):
While engaged with items/activities, teach labeling. "What's this?" while playing with car. Natural activity provides non-verbal discriminative stimuli.

INTRAVERBALS:
During conversation, games, songs. "Ready, set, ___" (child fills in "go"). Natural back-and-forth creates intraverbal opportunities.

ADVANTAGES OF NET:
High motivation (child-selected interests), Natural reinforcement (gets what they want), Generalization built-in (taught where used), Family-friendly (parents easily implement), Maintains natural social quality, Reduces prompt dependency, Functional communication emphasized, Enjoyable for child and teacher, Learning distributed throughout day.

LIMITATIONS:
Lower trial frequency than massed DTT, Requires skilled opportunistic teaching, More challenging to collect data systematically, Some skills harder to teach naturalistically (discrete discriminations), Environmental arrangement requires planning, May miss opportunities if not alert.

COMBINING NET WITH DTT:

COMPLEMENTARY USE:
DTT for: Initial acquisition, Building foundational skills, High trial frequency, Discrete targets.

NET for: Generalizing DTT-taught skills, Functional use of skills, Maintaining learned skills, Social communication, Following motivation.

TYPICAL APPROACH: Introduce skill in DTT, Practice until emerging, Shift to NET for fluency and generalization, Maintain through natural opportunities.

FAMILY IMPLEMENTATION:
NET ideal for parent/caregiver implementation because: Embedded in routines they already do, Uses natural reinforcers (no token systems needed), Doesn't require formal sessions, Capitalizes on child's interests, Increases learning opportunities throughout day.

COACHING PARENTS: Recognize teaching moments, Arrange environment for opportunities, Pause and wait for child initiation, Model/prompt better responses, Reinforce naturally.

DATA COLLECTION IN NET:
Less formal than DTT but still important: Tally opportunities and responses during activities, Rate quality of skill demonstration, Narrative notes on naturalistic use, Periodic probes of target skills, Track generalization across settings and people.

EXAMPLES ACROSS SETTINGS:

MEALTIME: Request food/drink items, Label foods, Follow instructions ("get spoon"), Social skills (waiting, turn-taking).

PLAY: Request toys/actions ("push me"), Label toys and actions, Imitate play sequences, Social interaction with peers, Problem-solving (what to do when piece doesn't fit).

COMMUNITY: Request items at store, Greet people, Follow safety rules, Make choices, Practice appropriate public behavior.

BATH TIME: Follow instructions (wash hands, rinse hair), Request items (soap, towel), Label body parts, Sequential skills (washing routine).

NET TEACHING FORMATS:

PLANNED ACTIVITIES: Set up specific activities with embedded teaching opportunities. Example: Art project requires requesting materials, following steps, labeling colors.

OPPORTUNISTIC TEACHING: Respond to naturally occurring moments without pre-planning. Child shows interest → Create teaching moment.

STRUCTURED ROUTINES: Daily routines (morning routine, bedtime) with consistent teaching steps embedded.

EFFECTIVENESS FACTORS:
Implementer alertness to opportunities, Quick timing (capture interest moment), Environmental arrangement, Natural reinforcers used, Brief teaching (don't over-extend), Consistency across people and settings, Data-based adjustments.`);

    updateTopic('intervention', 'intervention-1-old', 'backup'); // Keep old version safe
    
    console.log('\n✅ BATCH 1 COMPLETE: Intervention Core Topics (5/32)\n');
}

// ============================================
// BATCH 2: VERBAL BEHAVIOR (4 topics)
// ============================================

if (batchNumber === 2) {
    console.log('🎯 BATCH 2: Verbal Behavior Topics (4 topics)\n');
    
    updateTopic('verbal-behavior', 'verbal-1', `Skinner's functional analysis of verbal behavior examines language not by its form but by its function - the variables controlling it. This behavioral approach distinguishes different types of language by their controlling antecedents and maintaining consequences.

DEFINITION OF VERBAL BEHAVIOR:
Verbal behavior is behavior reinforced through the mediation of another person's behavior. The listener must be specifically trained to provide reinforcement. Examples: Speaking, signing, writing, gesturing for communication.

NON-EXAMPLES: Random vocalizations not reinforced by listeners, Talking to oneself with no audience, Behaviors that produce direct physical consequences without social mediation.

VERBAL OPERANTS - TYPES:

MAND (REQUEST):
CONTROLLING VARIABLE: Establishing operation (motivation) and history of reinforcement with specific consequences.

DEFINING FEATURE: Mand benefits the speaker directly and specifically. Reinforcer is what was requested.

EXAMPLES: "Water" when thirsty → Gets water, "Help" when stuck → Receives help, "Break" when tired → Gets break.

KEY: Controlled by motivation, not environmental stimuli.

TACT (LABEL):
CONTROLLING VARIABLE: Non-verbal discriminative stimulus (object, event, property, relation).

DEFINING FEATURE: Controlled by what speaker contacts in environment. Benefits listener (provides information).

EXAMPLES: "Dog" in presence of dog, "Red" when seeing red object, "Big" when observing large item, "Running" when seeing running action.

REINFORCEMENT: Generalized conditioned reinforcement (praise, acknowledgment), not the item labeled.

ECHOIC (VOCAL IMITATION):
CONTROLLING VARIABLE: Vocal verbal stimulus (someone's speech).

DEFINING FEATURE: Point-to-point correspondence between stimulus and response (sounds match). Formal similarity (sound alike).

EXAMPLES: Adult says "ball" → Child says "ball", Model says "mama" → Learner says "mama".

NO MEANING REQUIRED: Can echo in foreign languages without understanding.

INTRAVERBAL:
CONTROLLING VARIABLE: Prior verbal behavior without point-to-point correspondence.

DEFINING FEATURE: Verbal stimulus controls verbal response, but they don't match in form.

EXAMPLES: "What's your name?" → "Emma" (question and answer don't match), Singing songs ("Twinkle twinkle little ___" → "star"), Conversations ("How are you?" → "Good"), "Roses are red..." → "Violets are blue" (verbal chains).

CRITICAL FOR: Conversation, Social interaction, Answering questions, Academic skills (fill-in-the-blank, Q&A).

LISTENER BEHAVIOR:
CONTROLLING VARIABLE: Verbal stimuli from others (instructions, directions).

DEFINING FEATURE: Non-verbal response to verbal stimulus. Following instructions.

EXAMPLES: "Touch your nose" → Touches nose, "Get the ball" → Retrieves ball, "Sit down" → Sits.

NOT VERBAL (Skinner's definition): Listener isn't engaging in verbal behavior (speaking), but responding to it. Still critical for language development.

TEXTUAL BEHAVIOR:
CONTROLLING VARIABLE: Written verbal stimulus (text).

DEFINING FEATURE: Reading text aloud. Point-to-point correspondence between written stimulus and vocal response.

EXAMPLE: Seeing written "CAT" → Saying "cat" (each letter corresponds to sound).

NOT COMPREHENSION: Can read aloud without understanding (decode without comprehension).

TRANSCRIPTION:
CONTROLLING VARIABLE: Verbal stimulus (spoken or written).

DEFINING FEATURE: Writing or typing in response to verbal stimuli.

TYPES: Taking dictation (write what you hear), Copying text (write what you see).

EXAMPLE: Hear "cat" → Write "cat", or See written "cat" → Copy "cat".

MULTIPLE CONTROL:
Most verbal behavior under control of multiple variables simultaneously. Example: Requesting "water" controlled by: Thirst (EO - mand), Seeing water (non-verbal stimulus - tact), Someone asking "What do you want?" (verbal stimulus - intraverbal).

RICH verbal repertoires have skills under multiple types of control.

WHY FUNCTION MATTERS:
Same topography (form) can be different operants: "Cookie" when seeing cookie = tact (labeling), "Cookie" when hungry = mand (requesting), "Cookie" after "What do you want?" = intraverbal (answering).

DIFFERENT OPERANTS REQUIRE DIFFERENT TEACHING: Can't teach mands like tacts. Must arrange motivation (EO) for mands, but non-verbal stimulus for tacts.

BUILDING COMPREHENSIVE LANGUAGE:
Teach ALL verbal operants, not just one type: Mands (functional communication, requesting needs), Tacts (descriptive language, labels), Echoic (vocal imitation, articulation), Intraverbals (conversation, social interaction), Listener (following instructions, comprehension).

Balanced repertoire allows functional, flexible communication.

TRANSFER OF STIMULUS CONTROL:
Often teach one operant then transfer to another. Example: Teach "ball" as echoic (can say it), Transfer to mand (request ball when wants it), Transfer to tact (label ball when seeing it), Transfer to intraverbal ("What do you play with?" → "ball").

ASSESSMENT: VB-MAPP and ABLLS-R assess verbal operants separately to identify strengths/deficits in each area.

PRACTICAL APPLICATIONS:
Understanding operants guides intervention: Child has many tacts but no mands → Teach manding priority (functional communication), Child echoes but doesn't use language functionally → Transfer echoic to mands and tacts, Child follows instructions but doesn't initiate → Teach mands and intraverbals.`);
    
    console.log('\n✅ BATCH 2 COMPLETE: Verbal Behavior Topics (4/32)\n');
}

// Save progress
fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));

console.log(`\n📊 Batch ${batchNumber} processing complete!`);
console.log('💾 Progress saved to content.json\n');
console.log('🔄 Run with next batch number to continue:');
console.log(`   node expand-topics-batch.js ${batchNumber + 1}\n`);

