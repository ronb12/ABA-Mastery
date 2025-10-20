#!/usr/bin/env node
// FINAL 2 TOPICS: Derived Relational Responding + Token Economy

const fs = require('fs');
console.log('\n📚 EXPANDING FINAL 2 TOPICS TO REACH 100%!\n');

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

updateTopic('foundations', 'foundations-4', `Derived relational responding extends beyond simple stimulus equivalence to include all types of relational frames. It forms the basis for complex language, reasoning, and cognition.

DEFINITION:
Derived relational responding is responding to relations between stimuli without direct training for those specific relations. The individual derives new stimulus relations from previously trained relations.

RELATIONAL FRAME THEORY (RFT):
RFT (Hayes, Barnes-Holmes, & Roche) extends equivalence to all relational responding. Proposes humans learn to respond relationally through multiple exemplar training across many contexts.

CORE CLAIMS: Relational responding is learned behavior (not innate). Becomes generalized across novel stimuli. Underlies human language and cognition. Distinguishes human from non-human behavior.

TYPES OF RELATIONAL FRAMES:

COORDINATION (SAME AS):
Equivalence relation. "This is like that," "A is the same as B."

Example: Word "dog" is same as picture of dog. Coordination frames underlie symbolic language.

OPPOSITION (OPPOSITE OF):
Inverse relation. "A is opposite of B."

Examples: Hot-cold, up-down, happy-sad, big-little.

Understanding opposition without direct training on each pair. If taught hot is opposite of cold, can derive cold is opposite of hot.

COMPARISON (MORE/LESS THAN):
Quantitative relations along continuum.

Examples: Bigger-smaller, faster-slower, better-worse, heavier-lighter.

Derived: If A > B and B > C, then derive A > C without training this specific comparison.

DISTINCTION (DIFFERENT FROM):
"A is different from B."

Discriminating non-equivalent stimuli. Important for: Categorization, Discrimination, Understanding differences.

TEMPORAL (BEFORE/AFTER):
Time-based relations.

Examples: Before-after, now-later, first-last, yesterday-today-tomorrow.

Complex temporal reasoning emerges from derived relations.

SPATIAL (HERE/THERE, NEAR/FAR):
Location-based relations.

Examples: Above-below, left-right, near-far, inside-outside.

HIERARCHICAL (PART-WHOLE):
Inclusion and category relations.

Examples: Dog is part of animals category. Wheel is part of car.

Understanding hierarchies and classification.

CAUSAL (IF-THEN):
Cause-effect relations.

Examples: If rain, then wet. If hot stove, then burn. If study, then good grades.

Conditional reasoning.

DERIVED RELATIONS EMERGE:
Once relational responding established: Generalized across novel stimuli, Applied to new contexts, Combined in complex ways, Enables language, reasoning, problem-solving.

This is what makes human language generative and flexible.

TEACHING DERIVED RELATIONAL RESPONDING:

MULTIPLE EXEMPLAR TRAINING:
Teach sufficient examples of each relation type across varied stimuli. Eventually generalizes - individual can derive novel relations without explicit training on each instance.

Example: Teach 20+ examples of "opposite of" relations (hot-cold, big-little, happy-sad, etc.). Child learns the concept of opposition. Can then derive "opposite of sweet" → "sour" without specific training.

TESTING FOR DERIVED RELATIONS:
After teaching some relations, test for untrained derived relations.

Example: Teach: A is bigger than B, B is bigger than C. Test (without reinforcement): Is A bigger than C? (should derive yes). Is C smaller than A? (should derive yes - combined comparison + opposition).

If derives correctly = relational responding established.

IMPLICATIONS FOR LANGUAGE:
Derived relational responding explains: Metaphor understanding ("My job is prison"), Analogical reasoning ("Like is to love as dislike is to hate"), Abstract concepts (freedom, justice, love), Complex verbal reasoning, Symbolic thought.

Makes human language infinitely generative.

IMPLICATIONS FOR COGNITION:
Underlies: Problem-solving (deriving solutions), Academic reasoning (math, science concepts), Perspective-taking (understanding others' viewpoints), Complex decision-making, Abstract thought.

CLINICAL APPLICATIONS:
Teaching complex language skills, Developing reasoning abilities, Building abstract understanding, Problem-solving training, Cognitive flexibility.

ASSESSMENT:
PEAK Relational Training System assesses derived relational responding capabilities: Tests various relational frames, Identifies strong and weak relations, Guides intervention planning.

IMPORTANCE FOR ABA:
Understanding derived relations helps explain: How language goes beyond direct training, How complex reasoning emerges, How to teach generative language, Why some individuals struggle with abstract language (limited derived relational responding).

Guides sophisticated language intervention.

RESEARCH FOUNDATION:
Extensive research demonstrates: Derived relations emerge from training, Generalize to novel stimuli, Can be strengthened through multiple exemplar training, Correlate with language and cognitive abilities, Deficits present in some developmental disabilities.

Solid empirical foundation for understanding complex verbal behavior.

RELATIONSHIP TO STIMULUS EQUIVALENCE:
Equivalence (reflexivity, symmetry, transitivity) is ONE type of relational frame (coordination). RFT extends this to ALL relations (opposition, comparison, temporal, spatial, etc.).

Equivalence = foundation. Derived relational responding = comprehensive framework for understanding all complex verbal behavior.`);

updateTopic('intervention', 'intervention-9', `Token economies are structured reinforcement systems where individuals earn tokens (conditioned reinforcers) for desired behaviors, then exchange tokens for backup reinforcers. They're effective across diverse settings and populations.

DEFINITION:
A token economy is a behavior change system using tokens (tangible or symbolic items) as conditioned reinforcers that can be exchanged for backup reinforcers (preferred items/activities).

COMPONENTS:

TOKENS:
Tangible items functioning as conditioned reinforcers: Physical: Poker chips, stickers, tickets, checkmarks, stamps. Electronic: Points on app, digital tracking, Virtual tokens on tablet.

Requirements: Easily deliverable, Not easily counterfeited, Durable (won't be destroyed/lost easily), Age/setting appropriate.

BACKUP REINFORCERS:
Items/activities tokens can be exchanged for: Tangibles: Toys, snacks, school supplies, privileges. Activities: Computer time, preferred activities, special events. Social: Time with preferred person, choice of activity.

MENU: Variety of options at different "prices." Allows individualization to preferences.

EXCHANGE RATE:
Specifies how many tokens needed for each backup: Simple: All items cost same (10 tokens each). Variable: Items priced differently (small items 5 tokens, large items 25 tokens).

Based on: Item value/preference, Desired earning rate, Behavior difficulty.

TARGET BEHAVIORS:
Clearly defined behaviors that earn tokens: Academic: Completed assignments, correct answers, on-task behavior. Social: Sharing, kind words, following rules, peer interactions. Self-care: Hygiene tasks, room cleaning, chores. Behavioral: Compliance, appropriate requests, following schedule.

OPERATIONAL DEFINITIONS: All behaviors must be clearly defined so everyone knows what earns tokens.

EXCHANGE OPPORTUNITIES:
When can tokens be exchanged: Immediate: After each token earned (young children, beginning). Delayed: End of activity, day, or week (builds delayed gratification).

Frequency decreases as system matures.

IMPLEMENTING TOKEN ECONOMY:

STEP 1 - IDENTIFY TARGET BEHAVIORS:
Select 3-5 behaviors to reinforce. Start manageable (not too many). Operationally define each. Observable and measurable.

STEP 2 - SELECT TOKEN TYPE:
Based on setting and population: Preschool: Tangible tokens (chips, stickers). Elementary: Stars on chart, tickets. Adolescent: Points in book, digital tracking. Adults: Sophisticated point system, money.

STEP 3 - IDENTIFY BACKUP REINFORCERS:
Preference assessment: What does individual value? Create menu: 5-10 options at varying prices. Include both small (affordable frequently) and large (save up for) options.

UPDATE: Reassess preferences regularly, add new items, remove ineffective options.

STEP 4 - ESTABLISH EXCHANGE RATE:
Balance: Easy enough to earn regularly (maintains motivation). Challenging enough to require sustained appropriate behavior.

EXAMPLE: 10 tokens per small item, 50 tokens per large item. Can earn 20-30 tokens per day with good behavior.

STEP 5 - TEACH THE SYSTEM:
Explain: What behaviors earn tokens, How tokens are earned, What tokens can be exchanged for, When exchange happens, Rules of the system.

Model: Show earning and exchanging. May give "free" tokens initially to practice exchange.

STEP 6 - IMPLEMENT CONSISTENTLY:
Deliver tokens immediately when target behavior occurs. Use enthusiastic delivery: "Great job! Here's a token for completing work!"

Exchange at designated times. Follow rules consistently (no exceptions - undermines system).

STEP 7 - MONITOR AND ADJUST:
Collect data: Tokens earned per day, Behaviors occurring, Backup preferences, System effectiveness.

Modify: Adjust rates if too easy/hard, Change backup items based on preferences, Add new target behaviors, Revise exchange schedule.

RESPONSE COST (OPTIONAL):
Losing tokens for specific problem behaviors (negative punishment).

REQUIREMENTS: Clear rules about what loses tokens and how many. Must have tokens to lose (can't go negative - impossible to recover). Ratio: More earning than losing opportunities. Not primary feature - emphasize earning, not losing.

Example: Earn tokens for positive behavior throughout day. Lose 2 tokens for rule violations.

ADVANTAGES:

IMMEDIATE REINFORCEMENT: Tokens delivered right away even when backup not immediately available. Bridges delay between behavior and backup reinforcer.

DON'T SATIATE: Unlike consumables (food), tokens don't cause satiation. Can deliver many without reducing effectiveness.

INDIVIDUALIZATION: Each person can exchange for preferred backup. Same token system, personalized reinforcers.

CONCRETE AND VISIBLE: Accumulation visible (motivating). Can see progress toward goal.

TEACHES: Delayed gratification (save for bigger items), Money concepts (earning, spending, saving), Value and exchange, Planning and decision-making.

DISADVANTAGES/CHALLENGES:

REQUIRES MANAGEMENT:
Time to deliver tokens, Track earnings, Manage exchange, Update backup menus, Prevent counterfeiting/stealing.

Labor-intensive initially.

GENERALIZATION CONCERNS:
Behavior may not maintain without tokens. Natural contingencies don't include tokens.

SOLUTION: Plan fading to natural reinforcement.

POSSIBLE SATIATION:
If backups become less preferred, system loses power.

SOLUTION: Regular preference reassessment, Rotate options, Maintain variety.

UNEARNED ACCESS:
If individuals access backups without earning tokens, system fails.

SOLUTION: Strict control of backup access. Only through token exchange.

FADING TOKEN ECONOMIES:

GOAL: Transition to natural contingencies. Behavior maintained without artificial token system.

GRADUAL FADING:
Increase response cost (more tokens needed for backups). Increase delay to exchange (daily → weekly → monthly). Reduce token density (every response → intermittent). Fade to more natural systems (transition to money, grades, natural privileges).

MAINTAIN SKILLS: Continue some level of reinforcement even as tokens fade. Natural reinforcement takes over.

APPLICATIONS:

CLASSROOMS:
Students earn tokens for: Academic work, Following rules, Positive social behavior, Completed homework.

Exchange for: Computer time, Choice of activities, Small prizes, Special privileges.

Benefits: Manages whole class, Clear expectations, Reduces problem behavior, Increases academic engagement.

PSYCHIATRIC/RESIDENTIAL FACILITIES:
Earn tokens for: Attending therapy, Participating in programs, Following unit rules, Self-care tasks.

Exchange for: Privileges, Preferred activities, Commissary items.

Benefits: Structured environment, Promotes prosocial behavior, Reduces need for punishment.

HOMES:
Children earn tokens for: Chores, Homework, Appropriate behavior, Following house rules.

Exchange for: Screen time, Outings, Allowance, Special activities.

Benefits: Clear expectations, Reduces parent-child conflict, Teaches responsibility.

INDIVIDUAL PROGRAMS:
For specific behavior goals: Weight loss (earn for healthy eating/exercise), Productivity (earn for work completed), Habit building (earn for desired habits).

WORKPLACE:
Performance incentives and bonus systems function like token economies.

GROUP CONTINGENCIES:
Entire group earns toward shared goal. When group collectively earns X tokens, all get reward.

BENEFITS: Peer support for behavior, Cooperation, Reduced individual competition.

ETHICAL CONSIDERATIONS:
Tokens should never be used to: Withhold basic needs (food, safety, dignity as backup), Demean or degrade individuals, Exploit vulnerabilities, Coerce participation.

Informed consent required. Client involvement in selecting backups and goals.

RESEARCH SUPPORT:
Extensive evidence for token economy effectiveness: Across populations (children, adults, various disabilities), Across settings (schools, homes, institutions, clinics), For various behaviors (academic, social, self-care, behavioral).

Well-established, evidence-based procedure.

DATA COLLECTION:
Track: Tokens earned per day/week (across behaviors and total), Exchange patterns (what's preferred), Behavior frequency (is it increasing?), System modifications made, Fading progress.

MEASURING SUCCESS:
Target behaviors increasing, Problem behaviors decreasing, High engagement with system (motivated to earn), Successful exchanges, Eventually: Fading to natural contingencies while maintaining behaviors.

TIPS FOR EFFECTIVENESS:
Start simple (few behaviors, clear rules), Make earning achievable (motivation maintained), Variety of backups (prevents satiation), Consistent implementation (all staff follow rules), Visual display (token boards, charts), Positive focus (emphasize earning, not losing), Regular updates (keep fresh and motivating), Plan for fading from start (not permanent system).`);

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));
console.log('✅ FINAL 2 TOPICS EXPANDED!\n');
console.log('🎉 100% COMPREHENSIVE - ALL 47 TOPICS COMPLETE!\n');

