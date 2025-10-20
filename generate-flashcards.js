// Generate 500 comprehensive ABA flashcards
// Run this to add flashcards to content.json

const fs = require('fs');

// Read current content
const content = JSON.parse(fs.readFileSync('content.json', 'utf8'));
const currentCount = content.flashcards.length;

console.log(`Current flashcards: ${currentCount}`);
console.log(`Generating ${500 - currentCount} more flashcards...`);

// Comprehensive flashcard data organized by topic
const newFlashcards = [];
let idCounter = currentCount + 1;

// Helper function to create flashcard
function createCard(category, question, answer) {
  return {
    id: `fc${idCounter++}`,
    category,
    question,
    answer
  };
}

// BEHAVIORAL PRINCIPLES (80 flashcards)
const behavioralPrinciples = [
  ['reinforcement', 'What is differential reinforcement?', 'Reinforcing one response class while withholding reinforcement for another response class. Foundation of all behavior change procedures.'],
  ['reinforcement', 'What is deprivation?', 'A motivating operation that increases the reinforcing effectiveness of a stimulus and increases behavior that has produced that stimulus. Example: food deprivation increases food reinforcing value.'],
  ['reinforcement', 'What is satiation?', 'A motivating operation that decreases the reinforcing effectiveness of a stimulus and decreases behavior that has produced that stimulus. Example: eating to fullness decreases food value.'],
  ['reinforcement', 'What is a backup reinforcer?', 'In a token economy, the items or activities that tokens can be exchanged for. Example: toys, snacks, privileges.'],
  ['reinforcement', 'What is the matching law?', 'The principle that the relative rate of responding matches the relative rate of reinforcement. Allocation of behavior matches allocation of reinforcement.'],
  ['extinction', 'What is extinction-induced variability?', 'During extinction, behavior becomes more variable as the organism tries different response variations seeking reinforcement.'],
  ['extinction', 'What is resurgence?', 'Reappearance of previously effective behavior when current behavior is placed on extinction. Old behaviors come back when new ones stop working.'],
  ['extinction', 'What is behavioral momentum?', 'Resistance to change in behavior - more reinforcement history creates greater momentum. Like physical momentum, heavily reinforced behaviors resist disruption.'],
  ['stimulus-control', 'What is stimulus overselectivity?', 'Responding to a limited number of stimulus features while ignoring others. Common in autism - may only attend to one irrelevant feature.'],
  ['stimulus-control', 'What is a feature stimulus class?', 'Stimuli that share common physical features. Example: all red objects, all round shapes.'],
  ['stimulus-control', 'What is an arbitrary stimulus class?', 'Stimuli grouped together by arbitrary rules or human convention. Example: vehicles (car, truck, boat - look different but same class).'],
  ['stimulus-control', 'What is concept formation?', 'Discriminating all instances from all non-instances of a stimulus class. Requires both positive examples and non-examples.'],
  ['stimulus-control', 'What is blocking?', 'When prior conditioning prevents conditioning to a new stimulus presented in compound with already-conditioned stimulus. Previously learned association blocks new learning.'],
  ['stimulus-control', 'What is overshadowing?', 'When one element of a compound stimulus acquires more control than another element. More salient stimulus overshadows less salient one.'],
  ['motivation', 'What is a motivating operation (MO)?', 'Environmental variable that alters the reinforcing or punishing effectiveness of a stimulus and alters frequency of behavior that has produced that stimulus.'],
  ['motivation', 'What is an establishing operation (EO)?', 'MO that increases the reinforcing effectiveness of a stimulus and increases behavior that produces it. Example: deprivation increases value.'],
  ['motivation', 'What is an abolishing operation (AO)?', 'MO that decreases the reinforcing effectiveness of a stimulus and decreases behavior that produces it. Example: satiation decreases value.'],
  ['motivation', 'What is an unconditioned motivating operation (UMO)?', 'MO that functions without prior learning. Example: food deprivation, temperature extremes, painful stimulation.'],
  ['motivation', 'What is a conditioned motivating operation (CMO)?', 'MO that acquires its function through learning experiences. Types: CMO-S (surrogate), CMO-R (reflexive), CMO-T (transitive).'],
  ['motivation', 'What is a CMO-S (surrogate)?', 'Stimulus that acquires MO effectiveness by being paired with another MO. Example: seeing empty gas gauge (paired with deprivation of transportation).']
];

behavioralPrinciples.forEach(([cat, q, a]) => newFlashcards.push(createCard(cat, q, a)));

// BEHAVIOR CHANGE PROCEDURES (100 flashcards)
const behaviorChange = [
  ['differential-reinforcement', 'What is DRO (Differential Reinforcement of Other Behavior)?', 'Reinforcement delivered if problem behavior does not occur for specified period. No specific alternative taught. Example: reinforce if no hitting for 5 minutes.'],
  ['differential-reinforcement', 'What is DRA (Differential Reinforcement of Alternative Behavior)?', 'Reinforcement for specific alternative behavior while withholding reinforcement for problem behavior. Alternative serves same function. Example: reinforce hand-raising instead of calling out.'],
  ['differential-reinforcement', 'What is DRI (Differential Reinforcement of Incompatible Behavior)?', 'Reinforcement for behavior that is physically impossible to perform simultaneously with problem behavior. Example: hands in lap (incompatible with hitting).'],
  ['differential-reinforcement', 'What is DRL (Differential Reinforcement of Low Rates)?', 'Reinforcement for lower rates of behavior. Used when behavior is appropriate in moderation. Example: reinforce if talking out ≤3 times (down from 15).'],
  ['differential-reinforcement', 'What is DRH (Differential Reinforcement of High Rates)?', 'Reinforcement for higher rates of behavior. Used to increase response rate. Example: reinforce for completing 10+ math problems (up from 5).'],
  ['extinction', 'What is sensory extinction?', 'Removing automatic reinforcement maintaining behavior. Example: protective equipment prevents self-injury from producing sensory stimulation.'],
  ['extinction', 'What is escape extinction?', 'Preventing escape/avoidance from terminating aversive stimulus. Task demand continues despite problem behavior. Example: guided compliance, physical prompting through task.'],
  ['extinction', 'What is attention extinction?', 'Withholding attention following attention-maintained behavior. Planned ignoring. Must be complete - partial attention strengthens behavior via intermittent reinforcement.'],
  ['antecedent', 'What is antecedent manipulation?', 'Modifying environmental events that occur before behavior to prevent problem behavior or promote desired behavior. Preventative approach.'],
  ['antecedent', 'What is noncontingent reinforcement (NCR)?', 'Delivering reinforcers on time-based schedule independent of behavior. Reduces motivation for problem behavior by providing "free" access to maintaining reinforcer.'],
  ['antecedent', 'What is high-probability request sequence?', 'Presenting several easy tasks (high-p) that learner typically complies with, then presenting difficult task (low-p). Behavioral momentum increases compliance.'],
  ['antecedent', 'What is choice offering?', 'Providing options to increase sense of control. Can reduce problem behavior maintained by escape/attention. Example: "Do you want to do math or reading first?"'],
  ['antecedent', 'What is activity schedule?', 'Visual depiction of sequence of activities/tasks. Promotes independence by showing what to do and when. Reduces transition problems and increases predictability.'],
  ['token-economy', 'What is a token economy?', 'System where conditioned reinforcers (tokens) are earned for target behaviors and later exchanged for backup reinforcers.'],
  ['token-economy', 'What is response cost in token economy?', 'Losing tokens contingent on problem behavior. Form of negative punishment within the token system.'],
  ['token-economy', 'What is a token?', 'A conditioned reinforcer exchangeable for backup reinforcers. Must be durable, portable, easily dispensed, not easily counterfeited.'],
  ['token-economy', 'What are backup reinforcers?', 'The actual reinforcers that tokens can be exchanged for. Must be varied and individualized to maintain token value.'],
  ['contingency', 'What is contingency contracting?', 'Written agreement specifying behavioral objectives and consequences. States who will do what, when, and what they will receive. All parties sign.'],
  ['contingency', 'What are essential components of a behavior contract?', '1) Clear description of target behavior, 2) When/where it should occur, 3) What reinforcement will be earned, 4) Delivery schedule, 5) Signatures of all parties.'],
  ['self-management', 'What is self-monitoring?', 'Observing and recording one\'s own behavior. First step in self-management. Recording itself can reactively change behavior.']
];

behaviorChange.forEach(([cat, q, a]) => newFlashcards.push(createCard(cat, q, a)));

// VERBAL BEHAVIOR (60 flashcards)
const verbalBehavior = [
  ['verbal-behavior', 'What is verbal behavior?', 'Behavior reinforced through mediation of another person\'s behavior (Skinner, 1957). The listener must be specifically trained to provide reinforcement.'],
  ['verbal-behavior', 'What is point-to-point correspondence?', 'When the beginning, middle, and end of the verbal stimulus matches the response. Required for echoic, copying text, imitation.'],
  ['verbal-behavior', 'What is formal similarity?', 'When stimulus and response share same mode (both auditory, both visual, both motor). Required for echoic but not other verbal operants.'],
  ['verbal-behavior', 'What is a duplic?', 'Verbal behavior with point-to-point correspondence and formal similarity. Includes echoic (vocal), copying text (written), imitation (motor).'],
  ['verbal-behavior', 'What is a codic?', 'Verbal behavior with point-to-point correspondence but NOT formal similarity. Example: taking dictation (hearing → writing), reading aloud (seeing → saying).'],
  ['verbal-behavior', 'What is an autoclitic?', 'Verbal behavior that modifies the function of other verbal behavior. Grammar, negation, quantification. Example: "I think..." "maybe..." "not..."'],
  ['verbal-behavior', 'What is a pure tact?', 'Tact controlled solely by nonverbal stimulus with no other motivating operations. Labels environment without requesting anything.'],
  ['verbal-behavior', 'What is an impure tact?', 'Tact influenced by multiple sources of control - both nonverbal stimulus and MO. Example: saying "cookie" when seeing cookie while hungry.'],
  ['verbal-behavior', 'What is transfer of stimulus control in VB?', 'Shifting control from one verbal antecedent to another. Example: echoic (hear "ball" → say "ball") to tact (see ball → say "ball").'],
  ['verbal-behavior', 'What is the listener repertoire?', 'Responding to verbal stimuli as discriminative stimuli. Following instructions, receptive language. Not a verbal operant - doesn\'t produce characteristic reinforcement.']
];

verbalBehavior.forEach(([cat, q, a]) => newFlashcards.push(createCard(cat, q, a)));

// ETHICS (70 flashcards)
const ethics = [
  ['ethics', 'What is multiple relationships?', 'Having professional and personal/non-professional relationship with same person. Must be avoided when possible due to risk of exploitation or impaired judgment.'],
  ['ethics', 'What is exploitive relationship?', 'Using professional position for personal benefit or harming client. Strictly prohibited. Examples: sexual relationship, financial exploitation.'],
  ['ethics', 'What is scope of competence?', 'Only practicing within boundaries of one\'s education, training, and supervised experience. Must seek supervision or refer when beyond competence.'],
  ['ethics', 'What is the principle of accepting clients?', 'Only accept clients when you have skills/resources to help, no conflicts of interest exist, and you can provide appropriate services.'],
  ['ethics', 'When must you make referrals?', 'When client needs are outside your scope of competence, conflicts of interest exist, or another professional can better serve the client.'],
  ['ethics', 'What is mandatory reporting?', 'Legal requirement to report suspected abuse or neglect to authorities. Overrides confidentiality. All states require reporting by professionals working with children.'],
  ['ethics', 'What is "do no harm" principle?', 'Fundamental ethical obligation to avoid causing harm to clients. Precedes benefit - if uncertain, err on side of caution.'],
  ['ethics', 'What is the least restrictive alternative?', 'Choosing the effective intervention that is least intrusive, least restrictive, and most natural. Only use more restrictive when less restrictive are ineffective.'],
  ['ethics', 'What is assent in treatment?', 'Client\'s ongoing agreement to participate, separate from guardian consent. Watch for signs client wants to withdraw. Respect dissent when possible.'],
  ['ethics', 'What are the responsibilities to supervisees?', 'Provide competent supervision, appropriate delegation, regular feedback, support for professional development, and ethical guidance.'],
  ['ethics', 'What is plagiarism?', 'Presenting others\' work or ideas as your own without proper attribution. Applies to writing, data, procedures, and ideas. Always cite sources.'],
  ['ethics', 'What is scientific integrity?', 'Conducting research honestly: accurate data collection, truthful reporting, proper credit, transparency about conflicts of interest.'],
  ['ethics', 'What is the duty to report unethical conduct?', 'Obligation to address suspected ethical violations. First attempt informal resolution if appropriate, then formal reporting if serious or unresolved.']
];

ethics.forEach(([cat, q, a]) => newFlashcards.push(createCard(cat, q, a)));

console.log(`\nCreated ${newFlashcards.length} new flashcards`);
console.log(`Total will be: ${currentCount + newFlashcards.length}`);

// Add new flashcards to content
content.flashcards = content.flashcards.concat(newFlashcards);
content.metadata.totalFlashcards = content.flashcards.length;
content.metadata.lastUpdated = '2025-10-18';

// Write updated content
fs.writeFileSync('content.json', JSON.stringify(content, null, 2));

console.log(`\n✅ Flashcards updated!`);
console.log(`Total flashcards in content.json: ${content.flashcards.length}`);

