#!/usr/bin/env node
// BATCH 3: Complete Verbal Behavior Topics (3 remaining)

const fs = require('fs');
console.log('\n📚 BATCH 3: Verbal Behavior (3 topics)\n');

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

updateTopic('verbal-behavior', 'verbal-2', `Teaching mands (requests) is foundational in verbal behavior training. Manding provides functional communication and reduces problem behavior by giving learners an appropriate way to express needs.

DEFINITION AND IMPORTANCE:
A mand is a verbal operant controlled by establishing operations (motivation) and reinforced by the specific consequence requested. It's the only verbal operant that directly benefits the speaker.

WHY MANDS ARE TAUGHT FIRST: Highly functional (learner gets what they want), Naturally reinforcing (getting desired item maintains manding), Reduces problem behavior (appropriate requesting replaces tantrums/aggression), Increases independence (can request needs), Foundation for communication (motivation drives learning).

CONTROLLING VARIABLES:
ESTABLISHING OPERATION (EO): Creates motivation. Thirst makes water reinforcing. Boredom makes activities reinforcing. Without EO, item won't reinforce mand.

HISTORY OF REINFORCEMENT: Manding "water" when thirsty was previously reinforced with water. This history increases future manding.

REINFORCEMENT: Specific item/action requested. "Water" mand reinforced BY water, not praise alone. "Help" mand reinforced BY help. This specific reinforcement defines manding.

TEACHING PROCEDURES:

STEP 1 - IDENTIFY HIGH-PREFERENCE ITEMS:
Conduct preference assessment: Present various items/activities, Observe which child approaches/engages with most, Rank preferences.

Start with 2-5 highest-preference items child cannot access without requesting.

STEP 2 - ARRANGE ESTABLISHING OPERATIONS:
Create motivation without excessive deprivation: Briefly show item then move out of reach, Provide small portion (motivates "more"), Begin activity then pause (motivates continuation request), Give materials minus one piece (motivates requesting missing item).

Ethical balance: Create want without causing distress.

STEP 3 - PROMPT MAND:
TIME DELAY: Show item, wait 3-5 seconds for independent request. If no mand, provide prompt.

VERBAL MODEL: "Say 'cookie'" → child echoes → gets cookie.

PARTIAL MODEL: "Coo..." → child completes "cookie."

SIGN MODEL: For sign language users, model sign.

ECHOIC-TO-MAND TRANSFER: Initially, mand may be echoic (child echoing your model). Transfer to independent mand by fading prompts through time delay.

STEP 4 - IMMEDIATE REINFORCEMENT:
CRITICAL: Immediately provide requested item/action. "Cookie" → Gets cookie within 1-2 seconds.

This immediate delivery creates clear contingency. Delays weaken the functional relation.

DO NOT: Provide praise alone (that's tact reinforcement). Make child wait long periods. Give something different than requested.

STEP 5 - EXPAND MAND FORMS:
APPROXIMATIONS TO WORDS: Accept "coo" → shape to "cookie" → expand to "cookie please."

SINGLE WORDS TO PHRASES: "Cookie" → "Want cookie" → "I want cookie please."

ADD VARIETY: Different ways to request same item: "Cookie," "Cookie please," "Can I have cookie?" "More cookies," "I want the chocolate cookie."

STEP 6 - EXPAND MAND REPERTOIRE:
Once child mands for 2-3 items reliably, expand:

MORE ITEMS: Additional preferred tangibles (toys, foods, activities).

ACTIONS: "Tickle," "Spin," "Chase me," "Throw."

INFORMATION: "Where ball?" "What's that?" "Who's here?"

ATTENTION: "Look!" "Watch me!" "Come here."

REMOVAL: "No," "All done," "Stop," "Go away."

HELP: "Help," "Open," "Fix it."

STEP 7 - GENERALIZE MANDING:
ACROSS PEOPLE: Teach requesting from different people (parents, teachers, peers, siblings).

ACROSS SETTINGS: Home, school, community, various locations.

ACROSS STIMULI: Different examples of item (various cookies, different balls).

ACROSS TIME: Throughout day, not just training sessions.

MAND TRAINING FORMATS:

NATURAL ENVIRONMENT: Best format. Create opportunities during daily activities, Play (request toys, actions), Meals (request food/drink items), Transitions (request destinations, activities), Routines (request help, items needed).

CONTRIVED OPPORTUNITIES: Systematically arranged: Place preferred items visible but out of reach, Provide inadequate portions (creates "more" mands), Give toys without batteries ("help" or "battery"), Offer choices ("Want juice or milk?").

STRUCTURED TEACHING: If needed initially: Sit-down sessions with preferred items, Multiple trial opportunities, Systematic prompting and data, Transfer to natural environment once emerging.

FUNCTIONAL COMMUNICATION TRAINING (FCT):
Special application of mand training: When problem behavior maintained by specific reinforcer, Teach functional mand that produces same reinforcer, Extinguish problem behavior.

Example: Aggression to escape demands → Teach "break please" → Requesting break produces break, Aggression no longer produces escape.

EXTREMELY EFFECTIVE for behavior reduction while building communication.

TYPES OF MANDS:

ITEM MANDS: Request objects - "cookie," "toy," "book."

ACTION MANDS: Request actions from others - "push" (swing), "tickle," "help," "open."

ATTENTION MANDS: Request social interaction - "look," "watch me," "play with me."

INFORMATION MANDS: Request information - "where ___?" "what's that?" "who?"

REMOVAL/REJECTION MANDS: Request termination - "all done," "no," "stop," "go away."

MAND FOR MISSING ITEMS (WH-MANDS): "Where's the ___?" when item missing.

All types important for comprehensive communication.

TRANSFER OF STIMULUS CONTROL:

ECHOIC TO MAND: Child can echo "ball" → Arrange EO (show ball, don't give) → Child mands "ball" → Gets ball. Response transfers from echoic control to EO control.

TACT TO MAND: Child can label "juice" when seeing it → Create EO (thirsty, show juice) → Child mands "juice" → Gets juice. Same word, different controlling variables.

PROCEDURE: Present EO + stimulus temporarily, Fade stimulus while maintaining EO, Word now controlled by motivation alone (pure mand).

COMMON CHALLENGES:

TACTING INSTEAD OF MANDING: Child labels item when should request it. "Ball" as observation, not request.

SOLUTION: Clear discrimination - only reinforce with item when EO present and child is requesting, not when merely labeling visible item.

PROMPT DEPENDENCY: Won't mand without verbal model.

SOLUTION: Time delay (wait longer before prompting), Reinforce independent mands more enthusiastically, Gradually fade prompts systematically.

LIMITED SPONTANEITY: Mands only when directly asked "What do you want?"

SOLUTION: Create opportunities without asking, Arrange environment so child needs to initiate, Wait for child-initiated mands, Reinforce spontaneous manding strongly.

ROTE/SCRIPTED MANDING: Always same request form, doesn't vary.

SOLUTION: Teach multiple forms, Model variety ("cookie," "want cookie," "can I have cookie?"), Reinforce varied forms.

DATA COLLECTION:
Track: Total mands per session/day, Independent vs prompted mands (%), Different items/actions manded for (repertoire size), Spontaneous vs prompted opportunities, Generalization across people/settings.

MEASURING SUCCESS: Number of functional mands child uses daily, Reduction in problem behavior (if mands replaced it), Independence in requesting needs, Variety of mands in repertoire.

FAMILY IMPLEMENTATION:
Critical for mand generalization: Teach parents/caregivers to create opportunities throughout day, Arrange motivating conditions, Wait for child manding (don't anticipate needs), Prompt if needed, Reinforce immediately with requested item/action.

When families implement consistently, manding becomes truly functional communication used throughout waking hours.

PROGRESSION:
Early: 2-5 single-word mands for items/actions, Mid: 10-20 mands including phrases, expansion to various types, Advanced: 50+ different mands, complex forms, spontaneous requesting, information-seeking, social mands.

ULTIMATE GOAL: Child can request everything they want/need appropriately, using varied language forms, across all contexts, with all people, without prompting. This is functional communication.`);

updateTopic('verbal-behavior', 'verbal-3', `Teaching tacts (labels) builds descriptive vocabulary. While mands express needs, tacts describe the world around us.

DEFINITION:
A tact is verbal behavior evoked by a non-verbal discriminative stimulus (object, event, property, relation) and reinforced through generalized conditioned reinforcement, not by the item itself.

CONTROLLING VARIABLE: What the speaker contacts in the environment. The item, action, or property controls the response.

REINFORCEMENT: Social reinforcement (praise, acknowledgment, confirmation), NOT access to the item. "Yes, that's a dog!" not getting the dog.

This distinguishes tacting from manding - tact benefits listener (information), mand benefits speaker (gets item).

IMPORTANCE:
Provides descriptive language, Expands expressive vocabulary, Enables sharing observations, Foundation for academic language, Critical for social conversation, Demonstrates knowledge.

TEACHING PROCEDURES:

STEP 1 - SELECT TARGET TACTS:
BEGIN WITH: Objects in child's environment (toys, foods, common items), People child knows (family members, teachers), Actions child observes frequently, Properties encountered often (colors, sizes).

PROGRESSION: Concrete objects → Actions → Properties → Abstract concepts.

STEP 2 - PRESENT NON-VERBAL STIMULUS:
Show actual object, Show picture/photo, Create situation where stimulus present (action occurring, property visible).

ENSURE ATTENDING: Child must be looking at stimulus before asking for tact.

STEP 3 - PRESENT VERBAL SD:
Ask tact-evoking question: "What is it?" "What's this?" (for objects), "What's he doing?" (for actions), "What color?" "What size?" (for properties).

Be consistent with wording initially, vary later for generalization.

STEP 4 - PROMPT IF NEEDED:
ECHOIC PROMPT: "Say 'ball'" → child echoes. Most common initially.

PARTIAL ECHOIC: "Ba..." → child completes.

VISUAL PROMPT: Point to written word if child reads.

MULTIPLE CHOICE: "Is it a ball or a car?" (reduces to choice).

FADE PROMPTS: Time delay (wait 2-3 seconds before prompting), Graduated reduction (full → partial → independent).

STEP 5 - PROVIDE GENERALIZED REINFORCEMENT:
Enthusiastic social praise: "Yes! Ball!"

Confirmation: "That's right, it's a ball."

Acknowledgment: "You're correct!"

DO NOT primarily reinforce by giving child the item - that teaches manding, not tacting.

Can give brief access after several correct tacts to maintain engagement, but tact itself reinforced socially.

STEP 6 - TEACH MULTIPLE EXEMPLARS:
Essential for generalization.

For "dog": Show various dogs (big, small, different colors/breeds). All are "dog."

For "red": Show various red items (ball, crayon, shirt). Property across items.

This teaches concept, not rote response to single stimulus.

STEP 7 - DISCRIMINATION TRAINING:
Teach contrasting tacts to build discrimination.

After child tacts "ball" reliably, introduce "car." Randomly present ball or car, Child must discriminate and tact correctly.

Mass trials on new item, then mix with established item (field of 2, then field of 3, etc.).

EXPANDING TACT REPERTOIRE:

NOUNS - CATEGORIES:
Common objects: Toys, furniture, vehicles, tools, Foods: Fruits, vegetables, meals, snacks, Animals: Pets, farm animals, wild animals, Body parts: Nose, ear, hands, feet, People: Family members, roles (teacher, doctor), Locations: Home, school, park, store.

VERBS/ACTIONS:
Daily actions: Eating, drinking, walking, running, Play actions: Throwing, catching, building, drawing, Self-care: Washing, brushing, dressing, Observational: Sleeping, crying, laughing, working.

TEACH DURING: Action observation (live or video), Child performing action (tact own behavior), Looking at action pictures.

ADJECTIVES - PROPERTIES:
COLORS: Start with primary (red, blue, yellow), expand to secondary and specific shades.

SIZES: Big/little → tall/short → huge/tiny → specific measurements.

SHAPES: Circle, square, triangle → rectangle, oval, hexagon.

TEXTURES: Soft, hard, rough, smooth, bumpy, fuzzy.

TEMPERATURES: Hot, cold, warm, cool.

EMOTIONS: Happy, sad, angry, scared, excited.

TEACH WITH: Multiple exemplars (many red things), Contrast training (red vs blue), Natural contexts (describe actual objects).

PREPOSITIONS (SPATIAL RELATIONS):
Basic: On, in, under, next to.
Advanced: Between, behind, in front of, above, below, beside.

TEACH BY: Arranging objects in relations, Asking "Where is the ___?", Having child place objects then tact locations, Using real situations (ball under table).

ADVANCED TACTING:

TACT COMBINATIONS: Noun + adjective: "red ball," "big truck."
Multiple descriptors: "big red ball," "little blue car."
Verb + noun: "throwing ball," "eating cookie."

SENTENCES: "The dog is running."
"I see a big tree."

ABSTRACT TACTS: Time concepts: "yesterday," "tomorrow," "morning," "night."
Quantity: "many," "few," "some," "all."
Comparatives: "bigger," "smallest," "faster."

AUTOCLITICS (modifiers): "I think...," "Maybe...," "I don't know...," "Definitely..."

These modify other tacts and show complex verbal control.

TRANSFER PROCEDURES:

ECHOIC TO TACT:
Step 1: Teach "ball" echoically (child can say it).
Step 2: Show ball, ask "What is it?" provide echoic prompt "Say ball."
Step 3: Fade prompt - child tacts ball independently when seeing it.

Now same word under new control (visual stimulus vs vocal model).

TACT TO INTRAVERBAL:
Child can tact "dog" when seeing dog.
Transfer to: "What animal says 'woof'?" → "dog" (no dog present - intraverbal).
"Name an animal" → "dog."

LISTENER TO TACT:
Child follows instruction "Touch the ball" (listener).
Transfer to: "What did you touch?" → "ball" (tact/intraverbal).

GENERALIZATION PROGRAMMING:

ACROSS STIMULI:
Teach with multiple examples: Various balls, cars, dogs. Novel examples test generalization: Show new ball never seen → child tacts "ball" = generalized!

ACROSS PEOPLE:
Practice tacting with: Parents, siblings, teachers, therapists, peers. Different voices, different questioning styles.

ACROSS SETTINGS:
Home, school, therapy, community, playground. Tact in various locations where items encountered.

COMMON CHALLENGES:

STIMULUS OVERSELECTIVITY:
Child attends to irrelevant feature. Example: Only says "dog" for one specific dog picture, not all dogs.

SOLUTION: Vary stimuli systematically (show many dogs), Highlight relevant features, Explicitly teach "All of these are dogs."

MAND-TACT CONFUSION:
Child requests item when should label it. Sees cookie, says "cookie" and expects to receive it (manding), but context was tacting.

SOLUTION: Clear discrimination training. Tacting: Item visible, questions ask "what is it," reinforcement is social. Manding: Item may not be visible, motivation present, reinforcement is getting item.

Teach both but in clearly different contexts initially.

PROMPT DEPENDENCY:
Won't tact without echoic prompt. Always needs "Say ___."

SOLUTION: Systematic fading - time delay increases, partial prompts reduce, differential reinforcement for independent tacts (more enthusiastic praise, occasional brief access to item).

LIMITED GENERALIZATION:
Only tacts with trained items/pictures. Won't generalize to novel examples.

SOLUTION: Teach sufficient exemplars (rule of thumb: 3-5+ examples per concept), Test with untrained stimuli, If doesn't generalize, teach more exemplars.

ROTE RESPONDING:
Child says same word for all stimuli (calls everything "ball").

SOLUTION: Discrimination training with contrasts, Correct errors consistently, Teach field expansion (array of different items).

APPLICATIONS:

ACADEMIC:
Labeling: Math concepts (numbers, shapes), Letters and words, Science concepts (animals, plants, weather), Social studies (maps, countries, roles).

SOCIAL:
Describing experiences to others, Sharing observations, Commenting on environment, Conversation topics.

FUNCTIONAL:
Requesting specific items (tact repertoire enables specific mands), Following instructions (comprehension linked to tacts), Safety (labeling hazards, safe behaviors).

DATA COLLECTION:
Measure: Number of different tacts (vocabulary size), Percentage correct on tact trials, Independent vs prompted tacts, Generalization (responds to novel stimuli).

GOALS: 50+ tacts first year, 200+ tacts by 2-3 years in programming, 500+ for functional language, Continued expansion throughout childhood.

TEACHING CONTEXTS:

STRUCTURED: Mass trial initially (5-10 trials of "ball"), Discrimination training (ball vs car field), Clear data collection, Systematic prompt fading.

NATURAL ENVIRONMENT: During play (tact toys being used), During activities (tact foods at snack), During outings (tact things encountered), Incidental teaching opportunities.

BALANCE: Start structured for acquisition, Move to natural for generalization/maintenance, Embed in daily activities for functionality.

PARENTAL IMPLEMENTATION:
Teach parents to: Create labeling opportunities throughout day ("What's this?" during activities), Reinforce tacts socially (don't need tangible reinforcers), Practice during natural routines, Use everyday materials, Celebrate vocabulary growth.

Parents can build vocabulary throughout daily interactions without formal sessions.

IMPORTANCE FOR FURTHER LEARNING:
Tact repertoire foundation for: Reading (labeling written words), Academics (describing concepts), Intraverbals (need vocabulary to answer questions), Complex language (sentences built from tacted words), Social interaction (shared labeling, commenting).

Strong tact repertoire enables advanced verbal behavior.`);

updateTopic('verbal-behavior', 'verbal-4', `Intraverbal behavior enables conversation and social interaction. It's verbal responding to verbal stimuli without repeating what was heard.

DEFINITION:
Intraverbal is verbal behavior evoked by other verbal behavior where there is NO point-to-point correspondence between stimulus and response. The response doesn't match or repeat the stimulus.

CONTROLLING VARIABLE: Prior verbal stimuli from others (or oneself in verbal chains).

EXAMPLES: "What's your name?" → "Emma" (doesn't repeat question), "How are you?" → "Good," "What comes after 2?" → "3," "Roses are red..." → "violets are blue," "Ready, set..." → "go!"

DISTINGUISHED FROM ECHOIC:
Echoic: Repeats stimulus. "Say ball" → "ball" (matches).
Intraverbal: Answers differently. "What do you play with?" → "ball" (doesn't match question form).

IMPORTANCE AND APPLICATIONS:
CONVERSATION: Questions and answers, Turn-taking dialogue, Topic maintenance, Social reciprocity.

ACADEMIC SKILLS: Answering test questions, Fill-in-the-blank, Category knowledge, Verbal reasoning.

SOCIAL INTERACTION: Appropriate responses to social questions, Small talk, Sharing experiences.

DAILY FUNCTIONING: Providing information when asked, Following conversational conventions, Participating in discussions.

Without intraverbal skills, communication limited to labeling (tacts) and requesting (mands). True conversation impossible.

TEACHING PROCEDURES:

STEP 1 - ENSURE PREREQUISITES:
ECHOIC: Child can imitate speech (needed for prompting).
TACT REPERTOIRE: Has vocabulary to draw upon for answers.
LISTENER SKILLS: Attends to verbal stimuli.

Not required: Perfect articulation, Large vocabulary initially, Comprehension (can teach understanding through intraverbal training).

STEP 2 - START WITH SIMPLE FILL-INS:
AUTOMATIC VERBAL CHAINS: Strong associations practiced together.

SONGS: "Twinkle twinkle little ___" → "star," "Happy birthday to ___" → "you," "Old MacDonald had a ___" → "farm."

PHRASES: "Ready, set, ___" → "go!" "1, 2, ___" → "3," "Night-___" → "night" or "time."

These are easiest because of repeated pairing. Nearly automatic for typically developing children.

STEP 3 - PERSONAL INFORMATION:
Questions about child: "What's your name?" → child's name, "How old are you?" → age, "Where do you live?" → address/city, "What's your favorite ___?" → preference.

FUNCTIONAL and frequently asked. Good early targets.

STEP 4 - SIMPLE ASSOCIATIONS:
Feature: "What color is grass?" → "green."
Function: "What do you eat with?" → "fork/spoon."
Category: "Name a food" → any food, "Tell me an animal" → any animal.
Class: "What's a fruit?" → "apple/banana/etc."

Single-word answers, but requires accessing relevant information.

PROMPTING:
ECHOIC PROMPT: Most common. "What's your name? Say 'Emma'" → child echoes.

PARTIAL ECHOIC: "What's your name? Em..." → child completes.

VISUAL SUPPORT: Show written word if child reads.

TACT PROMPT: Show picture of answer while asking question (transfers tact to intraverbal).

FADING: Time delay (ask question, wait 3 seconds, then prompt if needed), Graduated reduction (full prompt → partial → independent), Increase delay progressively (0-sec → 2-sec → 4-sec → 6-sec delay).

REINFORCE CORRECT RESPONSES:
Social praise ("Great answer!"), Confirmatory feedback ("Yes! Your name is Emma"), Continuing conversation (natural reinforcement).

Can provide access to activity periodically to maintain motivation.

STEP 5 - EXPAND COMPLEXITY:

WHY QUESTIONS: "Why do we wear coats?" → "To stay warm/because it's cold."
Require understanding causation and providing explanations.

HOW QUESTIONS: "How do you make a sandwich?" → Description of steps.
Multi-step verbal chains.

WHEN QUESTIONS: "When do you sleep?" → "At night/bedtime."
Temporal concepts.

WHERE QUESTIONS: "Where do fish live?" → "In water/ocean."
Location knowledge.

WHO QUESTIONS: "Who is your teacher?" → Teacher's name.
Personal/social knowledge.

STEP 6 - CONVERSATIONAL INTRAVERBALS:
Multi-turn exchanges: "What did you do today?" → Describes activities → "What was your favorite part?" → Answer → Follow-up.

Topic maintenance across multiple turns. Requires sustained verbal behavior on one theme.

PROGRESSION:

LEVEL 1 (EARLY): Fill-in-the-blank (automatic verbal chains), Personal information (name, age), Simple associations (grass is green).

LEVEL 2 (INTERMEDIATE): Category members ("Name an animal" → "dog"), Feature/function/class (WH questions with single-word answers), Simple explanations (why/how with brief answers).

LEVEL 3 (ADVANCED): Complex explanations and descriptions, Multi-turn conversations, Narratives and storytelling, Topic maintenance, Abstract concepts and reasoning.

TEACHING STRATEGIES:

ERRORLESS TEACHING:
Provide immediate prompt before child can error: "What's your name? (immediate) Emma" → child echoes → fades to independent.

Prevents error patterns.

MULTIPLE EXEMPLAR TRAINING:
Teach various question forms for same content: "What's your name?" "Tell me your name," "Your name is ___?"

Varied intraverbal stimuli strengthen responding.

CAPTURE AND TRANSFER:
If child can complete "Twinkle twinkle little ___" → "star," Transfer to: "What twinkles in the sky?" → "star," "Tell me something in the sky" → "star."

Use familiar success to build new intraverbals.

LISTENER RESPONSE FOUNDATION:
Teach as listener skill first: "Touch something red" → child touches red item (listener), Then: "What did you touch?" → "red" or "red car" (intraverbal).

Response established through listener training, then brought under verbal stimulus control.

COMMON CHALLENGES:

ECHOIC RESPONSES (ECHOLALIA):
Child repeats question instead of answering. "How are you?" → "How are you?"

SOLUTION: Teach echoic vs intraverbal discrimination, Use statements instead of questions ("You are ___"), Immediate echoic prompt (no time to echo question), Reinforce only intraverbal responses.

SCRIPTED/ROTE RESPONSES:
Same answer regardless of question. "How are you?" → "Good," "What did you do?" → "Good."

SOLUTION: Vary questions to require different answers, Don't reinforce scripted responses to inappropriate questions, Teach question-specific responses explicitly.

PROMPT DEPENDENCY:
Always needs echoic prompt to answer.

SOLUTION: Fade prompts aggressively using time delay, Differentially reinforce independent responses, Practice until automatic.

NO SPONTANEOUS INTRAVERBAL:
Only responds to direct questions, doesn't spontaneously comment or share information.

SOLUTION: Create natural opportunities, Model spontaneous comments, Reinforce child-initiated verbal behavior, Practice conversational exchange.

SINGLE-WORD RESPONSES:
Adequate for early skills, but want expansion: Early: "What's this?" → "ball."
Expand to: "What's this?" → "It's a ball," "A red ball," "That's my favorite ball."

Prompt and reinforce more complex responses once simple form mastered.

APPLICATIONS:

ACADEMIC SKILLS:
Answering comprehension questions after reading, Demonstrating knowledge ("What's 2+2?" → "4"), Category knowledge ("Name three states"), Verbal reasoning and problem-solving.

SOCIAL SKILLS:
Responding to social questions ("How was your day?"), Participating in group discussions, Maintaining conversation topics, Appropriate social exchanges.

DAILY LIVING:
Providing information when asked, Following conversational conventions, Interacting with community members, Job interviews and workplace communication.

DATA COLLECTION:
Track: Correct independent intraverbals (percentage), Prompted intraverbals (percentage), Variety of intraverbal questions/prompts mastered, Generalization to novel questions, Spontaneous intraverbal initiations.

PROGRESSION GOALS:
Year 1: 20-30 simple fill-ins and personal info questions.
Year 2: 50-100 including associations and simple why/how.
Year 3+: 100s of varied intraverbals, conversational skills, complex explanations.

GENERALIZATION:

ACROSS QUESTION FORMS: "What's your name?" "Tell me your name," "Your name is ___?" All should evoke same response.

ACROSS PEOPLE: Answer appropriately to questions from various people.

ACROSS SETTINGS: Intraverbal skills functional across all environments.

NATURAL CONVERSATION:
Goal is fluid, natural conversation, not just Q&A: Back-and-forth exchanges, Topic maintenance, Spontaneous comments, Sharing experiences, Asking and answering questions.

TEACHING NATURAL INTRAVERBAL: Model conversational exchanges, Practice during play and activities, Use actual conversation opportunities, Reinforce natural social interaction, Fade structured questioning.

FAMILY COACHING:
Teach parents to: Ask questions during daily activities, Wait for child's response (don't answer for them), Prompt if needed then fade, Engage in conversations not just commands/labels, Celebrate communicative growth.

ULTIMATE GOAL:
Child can: Answer wide variety of questions, Maintain conversations on various topics, Spontaneously share information, Demonstrate knowledge verbally, Engage appropriately in social verbal interaction.

This is functional, flexible verbal behavior essential for success in school, social situations, and life.`);

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));
console.log('\n✅ BATCH 3 COMPLETE: Verbal Behavior (3 topics completed)\n');
console.log('Progress: 22/47 topics now comprehensive (47%)\n');

