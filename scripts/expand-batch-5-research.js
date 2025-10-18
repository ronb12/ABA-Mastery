#!/usr/bin/env node
// BATCH 5: Research Methods (5 topics)

const fs = require('fs');
console.log('\n📚 BATCH 5: Research Methods (5 topics)\n');

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

updateTopic('research', 'research-1', `Single-subject experimental designs demonstrate functional relationships between independent and dependent variables through repeated measurement and systematic manipulation.

DEFINITION:
Single-subject designs (also called single-case, N=1, or intrasubject designs) involve repeated measurement of behavior for individual participants across experimental conditions. Each participant serves as their own control.

FUNDAMENTAL FEATURES:

REPEATED MEASUREMENT:
Behavior measured repeatedly over time, not just once. Creates data series showing patterns and trends.

Advantages: Detects variability, Shows trends, Demonstrates stability, Allows within-individual comparison.

BASELINE LOGIC:
Establish baseline performance before intervention. Baseline provides: Prediction of future performance without intervention, Comparison point for evaluating intervention effects, Understanding of natural variability.

Baseline continues until: Stable pattern emerges (low variability, predictable trend), Or ethical necessity requires starting intervention (dangerous behavior).

EXPERIMENTAL CONTROL:
Demonstrated through: Systematic manipulation of independent variable (intervention), Replication of effect (showing control multiple times), Prediction (baseline predicts future without intervention), Verification (intervention changes behavior from predicted pattern), Replication within design (effect repeats when IV introduced again).

EACH PARTICIPANT AS OWN CONTROL:
Compare individual's behavior across conditions, not to other people. Individual differences don't confound results.

Benefits: Individualized analysis, Fewer participants needed, Clinically relevant, Detects individual response patterns.

VISUAL ANALYSIS:
Data displayed graphically and analyzed visually, not through statistics. Examine: Level, Trend, Variability, Immediacy of change, Overlap between phases, Consistency across replications.

VISUAL ANALYSIS COMPONENTS:

LEVEL: The value (mean/average) of data within a condition. Compare baseline mean to intervention mean. Level change = vertical distance between phase averages.

TREND: Direction (slope) of data path. Ascending (increasing), Descending (decreasing), or Flat (stable). Analyze trend within phases and changes across phases.

VARIABILITY: Degree of fluctuation in data. Stable data (low variability) = clustered points, clear pattern. Variable data (high variability) = scattered points, unclear pattern. Stability aids interpretation.

IMMEDIACY: How quickly behavior changes after intervention. Immediate change at phase transition suggests strong effect. Gradual change may indicate weaker or delayed effect.

OVERLAP: Proportion of intervention data within baseline range. Low overlap = clear separation between phases = strong effect. High overlap = data ranges similar = weak/no effect.

CONSISTENCY: In designs with replication, do effects replicate consistently? Same pattern each time IV introduced = strong experimental control.

ADVANTAGES OF SINGLE-SUBJECT DESIGNS:
Applicable to applied settings (schools, clinics, homes), Flexible to individual needs, Continuous monitoring allows adjustments, Clinically meaningful, Few participants needed, Sensitive to individual variability, Direct relevance to practice, Satisfies scientific standards while helping individuals.

LIMITATIONS:
Can't assess average group effects, Generalization to population unclear (external validity), Time-intensive (requires many sessions), Requires cooperation for repeated measurement, Some behaviors inappropriate (dangerous, irreversible), May not detect subtle effects with high variability.

INTERNAL VS EXTERNAL VALIDITY:

INTERNAL VALIDITY: Degree to which design demonstrates functional relationship. Did IV cause change in DV?

Threats: Confounding variables, Measurement issues, Maturation, History (external events).

Single-subject designs emphasize strong internal validity through: Tight experimental control, Repeated measurement, Systematic manipulation, Replication.

EXTERNAL VALIDITY: Generality of findings to other people, settings, behaviors.

Addressed through: Direct and systematic replication, Multiple baseline across settings/people, Teaching in natural environments.

DIRECT VS SYSTEMATIC REPLICATION:

DIRECT REPLICATION: Same researcher repeats same procedures with different participants. Shows effect wasn't unique to one individual.

SYSTEMATIC REPLICATION: Different researchers, settings, variations of procedure. Shows generality across conditions.

Both increase confidence in external validity.

EXPERIMENTAL CONTROL DEMONSTRATION:
Designs demonstrate control by showing: Baseline stability (prediction), Change when intervention introduced (verification), Change when intervention withdrawn or modified (replication), Consistency of pattern.

THREE DEMONSTRATIONS OF EFFECT within same design (baseline-intervention-baseline-intervention or across multiple baselines) provides convincing experimental control.

SINGLE-SUBJECT VS GROUP DESIGNS:
GROUP DESIGNS: Random assignment to groups, average effects compared, statistical analysis, larger sample sizes.

SINGLE-SUBJECT: Repeated measures, individual as own control, visual analysis, fewer participants, continuous assessment.

Both valid but serve different purposes. Applied settings often favor single-subject due to practicality and clinical relevance.

WHEN TO USE SINGLE-SUBJECT:
Individual treatment planning, Applied clinical/educational settings, Continuous progress monitoring, When group assignment unethical/impractical, Demonstrating intervention effects, Behavior change research.

BASIC DESIGN TYPES:
Covered in subsequent topics: ABAB/Reversal, Multiple Baseline, Changing Criterion, Alternating Treatments, plus variations and combinations.

DATA-BASED DECISIONS:
Single-subject designs enable: Determining if intervention working, When to change phases, Modifications needed, Mastery achievement, Generalization needs.

Decisions based on visual analysis of graphed data, not arbitrary timelines or subjective impressions.`);

updateTopic('research', 'research-2', `Reversal and withdrawal designs demonstrate experimental control by introducing and removing interventions while continuously measuring behavior.

ABAB DESIGN STRUCTURE:
A = Baseline (no intervention), B = Intervention, A = Return to baseline (remove intervention), B = Re-introduction of intervention.

Demonstrates control by showing behavior changes systematically with intervention presence/absence.

COMPONENTS:

INITIAL BASELINE (A):
Measure target behavior repeatedly without intervention. Continue until: Stable pattern (low variability), Clear trend (or lack thereof), At least 3-5 data points (more if variable), Ethical to continue (not dangerous behavior).

Baseline establishes: What behavior looks like without intervention, Natural variability, Predicted future pattern without treatment.

FIRST INTERVENTION (B):
Introduce intervention while continuing measurement. Continue until: Clear change from baseline demonstrated, Stable pattern in new direction, Sufficient data points (3-5+), Effect clearly established.

Look for: Level change (higher/lower average), Trend change (different slope), Reduced variability.

RETURN TO BASELINE/WITHDRAWAL (A):
Remove intervention, return to baseline conditions. If behavior returns toward baseline levels, demonstrates intervention was controlling variable.

Continue withdrawal until: Behavior approaches baseline pattern, Clear reversal demonstrated, Or ethical limits reached (don't let dangerous behavior deteriorate completely).

SECOND INTERVENTION (B):
Re-introduce intervention. Behavior should improve again. This replication strengthens demonstration that intervention causes change.

May continue: Additional replications (ABABAB), Or end in intervention phase (better for client).

WITHDRAWAL VS REVERSAL:

WITHDRAWAL DESIGN: Simply stop intervention, observe if behavior returns to baseline.

Example: Stop reinforcement procedure → see if behavior returns to baseline rate.

REVERSAL DESIGN: Actively implement opposite contingencies to reverse behavior direction.

Example: Was reinforcing appropriate behavior → Now differentially reinforce inappropriate behavior (DRI in reverse) to show functional control.

REVERSAL provides stronger control demonstration but ethical concerns about deliberately worsening behavior.

DEMONSTRATING EXPERIMENTAL CONTROL:
Control shown by: Baseline stable → Intervention changes behavior → Withdrawal returns behavior toward baseline → Re-intervention improves behavior again.

Pattern demonstrates functional relationship: Behavior systematically changes with IV manipulation. Changes coincide with condition changes. Effect replicates.

ADVANTAGES:
Strong demonstration of experimental control, Clear cause-effect relationship, Replication within single design, Relatively quick compared to some designs, Powerful evidence for intervention effectiveness.

LIMITATIONS AND ETHICAL CONCERNS:

REVERSIBILITY REQUIRED:
Behavior must be reversible (return to baseline when intervention stopped). Not appropriate for: Skills that won't reverse (learned skills - tying shoes), Behaviors where reversal unethical (dangerous behaviors), Irreversible changes.

ETHICAL ISSUES:
Withdrawing effective intervention may be: Unethical if behavior dangerous, Harmful to client, Unacceptable to caregivers/clients.

SOLUTIONS: Use DRO/DRI reversal (don't fully withdraw treatment), End in intervention phase, Use multiple baseline instead, Minimize withdrawal duration.

THIRD VARIABLE POSSIBILITY:
Could some other variable be changing coincidentally with your manipulations? Control through: Tight experimental procedures, Replication, Documenting all changes, Consistency across replications.

PRACTICAL LIMITATIONS:
Takes time (multiple phases), Requires cooperation throughout, May be resisted by families/clients, Interim withdrawal may be unacceptable.

VARIATIONS:

BAB DESIGN: Skip initial baseline in urgent situations. Start intervention immediately, Then withdraw to show reversibility, Re-introduce intervention.

Weaker than ABAB (no initial baseline for comparison) but ethically acceptable when immediate intervention needed.

ABAB WITH DRO/DRI:
Instead of complete withdrawal: Baseline: No intervention, Intervention: Reinforce target behavior, "Reversal": DRO or DRI (reinforce alternative/incompatible), Intervention again: Return to reinforcing target.

More ethical - still providing intervention during "reversal" phase, just different focus.

ABCAC DESIGN:
Compare two interventions. A = Baseline, B = Intervention 1, C = Intervention 2, A = Return to baseline (if ethical), C = Best intervention continued.

Shows which intervention more effective.

WHEN TO USE REVERSAL/WITHDRAWAL:
Behavior likely to reverse (maintained by ongoing contingencies, not learned skill), Ethical to withdraw temporarily, Quick demonstration of control desired, Single behavior focus, Research purposes (demonstrating functional relationship).

WHEN NOT TO USE:
Skill acquisition (won't reverse learned skills), Dangerous behaviors (unethical to allow deterioration), Irreversible changes, Client/family objects to withdrawal.

Alternative: Use multiple baseline design instead.

DATA INTERPRETATION:
STRONG EFFECT: Clear level separation, Immediate changes at phase transitions, Behavior returns to near-baseline in withdrawal, Consistent replication, Low overlap.

WEAK/NO EFFECT: Similar levels across phases, Gradual unclear changes, High overlap, Inconsistent patterns.

VARIABLES AFFECTING REVERSIBILITY:
Some behaviors reverse easily: Maintained by ongoing reinforcement, No learned component, Recent acquisition.

Some resist reversal: Well-established skills, Multiple maintaining variables, Natural contingencies maintaining behavior, Generalized to multiple contexts.

PRACTICAL APPLICATIONS:
Research demonstrating intervention effects, Clinical demonstration of functional control (when ethical), Identifying maintaining variables, Behavior maintained by specific contingencies (not learned skills), Brief interventions producing quick changes.`);

updateTopic('research', 'research-3', `Multiple baseline designs demonstrate experimental control by introducing intervention sequentially across behaviors, settings, or participants while maintaining baseline for others.

DEFINITION AND LOGIC:
Multiple baseline design introduces intervention to one baseline while others remain in baseline condition. When intervention is applied to second baseline (while first continues in intervention), that baseline should change while remaining baselines stay stable.

Control demonstrated through temporal relationship: Behavior changes ONLY when intervention introduced to that specific baseline, not when introduced to other baselines.

THREE TYPES:

MULTIPLE BASELINE ACROSS BEHAVIORS:
Two or more different behaviors for same individual in same setting. Baselines: Behavior 1, Behavior 2, Behavior 3 (same person).

Intervention: Applied sequentially - first to Behavior 1 (while 2 & 3 remain baseline), then to Behavior 2 (while 3 remains baseline), finally to Behavior 3.

Control: Only targeted behavior changes when intervention applied to it. Other behaviors stable.

Example: Target aggression, property destruction, and tantrums. Intervene on aggression first → only aggression decreases. Then intervene on property destruction → it decreases while tantrums remain elevated. Then target tantrums.

REQUIREMENTS: Behaviors must be functionally independent (changing one doesn't automatically change others). If too related, intervention on one might generalize to others (ruins design but good for client!).

MULTIPLE BASELINE ACROSS SETTINGS:
Same behavior, same individual, different settings. Baselines: Behavior in Setting 1, Setting 2, Setting 3 (same person, same behavior).

Intervention: Applied sequentially across settings.

Example: Target on-task behavior in classroom, cafeteria, and playground. Intervene in classroom first → on-task increases in classroom only. Then cafeteria → increases there. Then playground.

Control: Behavior changes only in setting where intervention implemented.

REQUIREMENTS: Intervention must be setting-specific (can be implemented independently in each setting). Behavior relatively independent across settings (generalization across settings ruins design but helps client).

MULTIPLE BASELINE ACROSS PARTICIPANTS:
Same behavior, different individuals, same setting. Baselines: Participant 1 with target behavior, Participant 2 with same behavior, Participant 3 with same behavior.

Intervention: Applied to participants sequentially.

Example: Teaching social initiations to three children. Intervene with Child 1 → their initiations increase. Child 2 & 3 remain at baseline. Then intervene with Child 2, etc.

Control: Each participant's behavior changes when intervention applied to them specifically.

REQUIREMENTS: Participants should not influence each other's behavior significantly (some separation helpful).

DEMONSTRATING EXPERIMENTAL CONTROL:

PREDICTION: Each baseline predicts what would occur without intervention (stable or predictable pattern).

VERIFICATION: When intervention introduced, behavior changes from predicted pattern.

REPLICATION: Pattern replicates across multiple baselines (3+ ideally). Each baseline serves as replication of effect.

STRONG CONTROL: Clear separation between baseline and intervention levels. Change occurs at intervention introduction. Consistent effect across all baselines.

ADVANTAGES:
No withdrawal of effective intervention required (ethical!). Particularly useful when reversal unethical or impractical. Replication built into design (multiple demonstrations). Practical for applied settings. Can intervene on multiple targets eventually.

LIMITATIONS AND CHALLENGES:

INDEPENDENCE REQUIREMENT:
Baselines must be relatively independent. If intervention on one baseline affects others, design compromised.

Problem: Intervene on aggression → all problem behaviors decrease (response generalization). Design fails to show control (but clinically excellent!).

Solution: Select more independent behaviors, settings, or participants.

NUMBER OF BASELINES:
Need minimum 3 baselines for convincing demonstration. More is better (4-5 stronger than 3). Fewer than 3 insufficient replication.

SIMULTANEOUS BASELINE CHANGES:
If all baselines change at same time (not sequentially), suggests external variable, not intervention.

Example: All behaviors decrease when new teacher starts (confound). Intervention effects unclear.

PRACTICAL CONSTRAINTS:
Requires: Multiple appropriate baselines available, Ability to withhold intervention from some baselines while treating others (ethical?), Resources to monitor multiple baselines, Time to implement sequentially.

May be impractical with: Urgent dangerous behaviors (can't leave some untreated), Very limited behaviors to target, Unstable baselines that extend timeline.

STAGGERED INTRODUCTION:
Introduce intervention at different times for different baselines. Timing depends on: First baseline showing clear intervention effect, Subsequent baselines remaining stable, Practical considerations.

Don't rush: Allow sufficient time in each condition for patterns to emerge. Don't delay excessively: Once control demonstrated, proceed to next baseline (ethical to treat).

DESIGN VARIATIONS:

DELAYED MULTIPLE BASELINE:
Start with one baseline initially. Add additional baselines later if needed.

Use when: Uncertain how many baselines needed, Practical constraints on monitoring multiple baselines initially.

NON-CONCURRENT MULTIPLE BASELINE:
Baselines collected at different times (not simultaneously). Participants at different calendar times but same procedure.

Less rigorous (more threats to internal validity), but sometimes necessary for practical reasons.

COMBINED DESIGNS:
Multiple baseline + reversal: Demonstrate control through both methods. Multiple baseline + changing criterion: Different criterion levels across baselines.

DATA INTERPRETATION:

STRONG EFFECT: Clear, immediate change when intervention introduced to each baseline. No change in baselines still in baseline condition. Consistent effect size across replications. Low variability.

WEAK/UNCLEAR EFFECT: Gradual or delayed changes. Changes in untreated baselines. Inconsistent patterns. High overlap.

WHEN TO USE MULTIPLE BASELINE:
Behaviors unlikely to reverse (learned skills). Reversal ethically problematic. Multiple targets, settings, or participants available. Want to demonstrate generality across contexts. Applied intervention research. When maintaining intervention throughout is important.

WHEN NOT TO USE:
Baselines not independent (likely to generalize). Fewer than 3 appropriate baselines. Urgent need to treat all immediately (ethical priority). High instability preventing clear patterns.

PRACTICAL APPLICATIONS:
School settings (multiple students or behaviors). Clinical interventions (can't withdraw effective treatment). Skill acquisition (won't reverse). Multiple problem behaviors need addressing. Demonstrating intervention effectiveness across contexts.`);

updateTopic('research', 'research-4', `Changing criterion design demonstrates experimental control through systematic changes in performance criteria. Behavior tracking criterion changes shows functional relationship.

DEFINITION:
Baseline followed by intervention phases with stepwise criterion changes. Each phase requires meeting a new performance criterion. Control demonstrated when behavior systematically matches changing criterion levels.

STRUCTURE:

INITIAL BASELINE:
Measure target behavior without intervention. Establish starting level.

Example: Smoking baseline = 20 cigarettes/day consistently.

INTERVENTION WITH CRITERION 1:
Introduce intervention with first criterion level. Reinforce behavior meeting this criterion.

Example: Criterion = 15 cigarettes/day. Reinforce if meets this.

CRITERION 2, 3, 4, etc.:
Systematically change criterion each phase. Each new criterion requires better performance than previous.

Example: Phase 2 = 12 cigarettes/day, Phase 3 = 9 cigarettes/day, Phase 4 = 6 cigarettes/day, Phase 5 = 3 cigarettes/day.

FINAL CRITERION:
Ultimate goal. Example: 0 cigarettes or predetermined safe level.

DEMONSTRATING CONTROL:
Experimental control shown when: Behavior tracks (matches) each criterion change. As criterion becomes more stringent, behavior changes accordingly. If criterion relaxed, behavior could follow that too (though typically progress toward goal).

Behavior following criterion demonstrates it's responding to the contingency, not other variables.

CRITERION SELECTION:

INITIAL CRITERION: Should be achievable from baseline. Not too difficult (causes failure), not too easy (minimal change required).

Typical: 10-20% improvement from baseline.

SUBSEQUENT CRITERIA: Each criterion requires improvement from previous but remains achievable. Progressive increases toward goal.

FINAL CRITERION: Terminal goal - desired end state.

GUIDELINES: Small enough steps to maintain success. Large enough to show meaningful change. Can vary step size based on performance (flexible). Number of phases typically 4-8.

WHEN TO ADVANCE CRITERION:
Behavior meets criterion for predetermined time/trials: Often 3-5 consecutive sessions at criterion, Or predetermined number of successful days, Or data show stable pattern at criterion level.

Don't advance too quickly (ensures stability), Don't wait too long (unnecessary delay of progress).

BIDIRECTIONAL CRITERION CHANGES:
Usually criterion progresses in one direction (increasing or decreasing). Can vary direction occasionally to test control: Increase criterion → behavior increases, Decrease criterion → behavior follows down, Increase again → behavior tracks up.

Shows behavior under tight control of criterion, not just improving due to other variables.

APPROPRIATE BEHAVIORS:

BEST FOR:
Behaviors that can be shaped gradually: Reducing smoking, caffeine, calories. Increasing exercise duration, homework completion, studying time. Academic fluency (math facts per minute). Response latency reduction.

Behaviors occurring along a continuum that can be gradually changed.

NOT APPROPRIATE FOR:
All-or-none behaviors (can't do "half a tantrum"). Skills not yet in repertoire (can't set criterion for behavior that doesn't occur). Dangerous behaviors needing immediate elimination. Highly variable behaviors making criterion-matching unclear.

ADVANTAGES:
No withdrawal of effective intervention required (ethical). Gradual change may be more acceptable than abrupt. Useful for behaviors resistant to rapid change. Built-in success (criteria achievable). Clear performance goals (client knows targets). Applicable to many behaviors (academic, health, social).

LIMITATIONS:
Requires behavior in repertoire at some level (can't shape from zero). Behavior must be capable of gradual change. Requires careful criterion planning. May be time-consuming (multiple phases). Less clear if behavior variable and doesn't track criterion.

EXPERIMENTAL CONTROL THREATS:

CONFOUNDING VARIABLES:
If another variable changes coincidentally with criterion changes, can't determine which controlled behavior.

Control: Minimize other changes, Document all program modifications, Consistent implementation across phases.

BEHAVIOR DOESN'T TRACK CRITERION:
If behavior doesn't match criterion changes, control not demonstrated.

Reasons: Criterion changes too large, Intervention not powerful enough, Other variables controlling behavior, Criterion changes not adequately discriminated.

Solutions: Adjust criterion steps, Enhance intervention, Ensure clear criterion communication.

MATURATION/PRACTICE:
Behavior might improve simply from practice or maturation, not criterion contingency.

Control through: Varied criterion progression (not linear), Bidirectional changes if ethical, Multiple participants/replications.

DESIGN VARIATIONS:

CHANGING CRITERION WITH MULTIPLE BASELINES:
Combine designs: Multiple baseline structure, But within each baseline, use changing criterion.

Stronger control demonstration.

DISTRIBUTED CRITERION:
Criterion applied to distributed behavior (throughout day, across settings).

Example: Exercise for 10 minutes across any time of day (not specific time).

RANGE-BOUND CRITERION:
Instead of exact number, specify acceptable range.

Example: 8-12 cigarettes/day acceptable (instead of exactly 10).

More flexible and realistic.

DATA REQUIREMENTS:
Must clearly show: Baseline level, Performance relative to each criterion, Changes coinciding with criterion changes.

Visual display: Horizontal line showing criterion level each phase. Data path showing actual performance. Should track closely.

INTERPRETATION:

SUCCESSFUL DESIGN:
Behavior closely matches criterion each phase. Changes occur when criterion changes. Systematic progression toward goal. Low variability around criterion.

UNSUCCESSFUL:
Behavior doesn't match criteria. High variability obscures tracking. Changes unrelated to criterion shifts.

If unsuccessful: Modify criteria (too large steps?), Enhance intervention, Consider different design.

PRACTICAL APPLICATIONS:
Academic behaviors (homework completion, reading fluency), Health behaviors (smoking reduction, exercise increase), Social behaviors (increasing initiations, reducing interruptions), Organizational behaviors (productivity, quality), Behaviors requiring gradual change for success or safety.

CLINICAL EXAMPLES:
Reducing self-injury from 50 instances/day gradually to zero. Increasing exercise from 5 minutes/day to 30 minutes. Improving homework completion from 20% to 100% gradually. Decreasing off-task behavior step-by-step.

CRITERION SETTING STRATEGIES:
Start conservatively (ensure early success). Increase incrementally (10-20% changes). Adjust based on performance (data-driven). Can relax if too difficult, can accelerate if exceeding criteria easily. Personalize to individual's response pattern.`);

updateTopic('research', 'research-5', `Alternating treatments design rapidly alternates two or more conditions while measuring the same behavior. It identifies which treatment is most effective.

DEFINITION:
Alternating treatments (also called multi-element design) involves rapid alternation between two or more treatment conditions (or treatment vs baseline). Same target behavior measured across conditions presented in counterbalanced order.

PURPOSE:
Compare effectiveness of different interventions. Determine which produces better outcomes. Identify most efficient treatment. Test treatment components.

STRUCTURE:

INITIAL BASELINE (optional):
Brief baseline showing behavior without any intervention. Provides comparison point.

ALTERNATING TREATMENTS PHASE:
Rapidly alternate conditions: Intervention A, Baseline, Intervention B (counterbalanced order). Example: Monday AM = Treatment 1, Monday PM = Treatment 2, Tuesday AM = Treatment 2, Tuesday PM = Treatment 1 (order varies).

MEASURE: Same target behavior across all conditions.

FINAL PHASE (optional):
Implement most effective condition exclusively to show it works when used consistently.

DISCRIMINATION TRAINING:
Associate each condition with discriminative stimulus so learner can discriminate: Different colored shirts for therapist. Different locations. Different materials. Different verbal cues ("This is game 1," "This is game 2").

Discrimination allows behavior to differ appropriately across conditions.

DEMONSTRATING CONTROL:
Control shown by: Differentiation - behavior differs systematically across conditions. Consistency - pattern replicates each time conditions presented. Clear separation in data paths for different conditions. Low overlap between conditions if effects different.

If Treatment A consistently superior to Treatment B (across multiple presentations), A is more effective.

COUNTERBALANCING:
Vary order of condition presentation to control for: Sequence effects (order influencing results), Time of day effects, Fatigue or practice effects.

Example schedule: Day 1: A-B-A, Day 2: B-A-B, Day 3: A-B-B, Day 4: B-A-A. Each condition presented approximately equally at different times.

RANDOMIZATION: Condition order randomized (within constraints of practical delivery).

ADVANTAGES:
Compares multiple treatments efficiently. Quick identification of effective intervention (don't have to complete phases sequentially). No withdrawal required. Can test component variations. Useful for rapid clinical decision-making. Practical when multiple options available.

LIMITATIONS AND CHALLENGES:

DISCRIMINATION REQUIRED:
Learner must discriminate conditions or behavior won't differentiate.

If can't discriminate: Data paths won't separate (looks like all conditions same even if potentially different).

Solutions: Make conditions clearly distinct, Use strong discriminative stimuli, Train discrimination explicitly if needed.

MULTIPLE TREATMENT INTERFERENCE:
One treatment may affect performance in another condition. Example: Skills learned in Treatment A carry over to Treatment B condition.

Results: Blurred differentiation, Unclear which treatment actually effective.

Control: Select independent treatments less likely to interact. Brief conditions minimize carry-over. Use distinct discriminative stimuli.

SEQUENCE/ORDER EFFECTS:
Order of presentation may influence responding. Example: Always performing better on second condition due to warm-up.

Control: Counterbalancing order, Randomization, Multiple presentations of each.

ALTERNATION FREQUENCY:
How quickly to alternate? OPTIONS: Within session (condition 1 then condition 2 same day), Across sessions (different condition each session), Days alternating.

TRADE-OFFS: Faster alternation = quicker results but harder to discriminate. Slower alternation = clearer discrimination but takes longer.

DESIGN VARIATIONS:

ADAPTED ALTERNATING TREATMENTS:
Baseline not necessary if goal is comparing treatments (not showing both better than baseline).

Simply alternate treatments to see which better.

ALTERNATING TREATMENTS + BASELINE:
Include baseline condition in alternation: Treatment A vs Treatment B vs Baseline (no treatment).

Shows if either treatment better than baseline AND which treatment superior.

ATD + FINAL PHASE:
After identifying most effective treatment: Implement it exclusively in final phase. Shows effect maintains when used consistently.

INTERPRETING DATA:

CLEAR DIFFERENTIATION:
Data paths for conditions clearly separated. One consistently superior. Low overlap. Difference meaningful and consistent.

CONCLUSION: The superior condition identified. Implement that treatment.

NO DIFFERENTIATION:
Data paths overlap. Conditions produce similar outcomes.

CONCLUSIONS: Treatments equally effective (choose based on other factors - cost, acceptability, ease). Neither treatment effective (need different approach). Design problems prevented differentiation (improve discrimination, reduce interference).

VARIABLE RESULTS:
Sometimes one better, sometimes another. Inconsistent patterns.

POSSIBLE CAUSES: Individual factors varying (mood, motivation), Condition differences not salient enough, Implementation inconsistency.

Solutions: Enhance discrimination, Improve implementation fidelity, Consider within-session patterns.

WHEN TO USE:
Comparing two or more interventions. Selecting among treatment options. Testing variations of procedure (component analysis). Need quick decision about treatment. Multiple promising options available. Client/family want evidence for treatment selection.

WHEN NOT TO USE:
Only one treatment option. Treatments likely to interact strongly. Learner can't discriminate conditions. Practical constraints prevent rapid alternation.

PRACTICAL APPLICATIONS:

TREATMENT SELECTION:
Comparing DRA vs DRI for problem behavior. Testing different reinforcement schedules. Evaluating prompt types (verbal vs model). Comparing teaching formats (DTT vs NET).

PREFERENCE ASSESSMENT:
Alternating different reinforcers to identify preference (which produces better responding?).

COMPONENT ANALYSIS:
Intervention package vs components. Example: Teaching procedure with and without visual supports - which more effective?

EFFICIENCY TESTING:
Comparing intervention intensities. Example: Daily vs 3x/week sessions - comparable effects?

CLINICAL DECISION-MAKING:
Rapid determination of effective procedure. Especially valuable when: Multiple viable options, Quick decision beneficial, Resources to test options systematically.

DATA DISPLAY:
Graph with multiple data paths: Each condition represented by different symbol (circles, squares, triangles) or different line style (solid, dashed).

Legend identifies which symbol represents which condition.

X-axis = sessions, Y-axis = behavior measure.

Clear visual separation shows which condition superior.

EXAMPLE STUDY:
Comparing two strategies for teaching sight words: Condition A = Flashcard drill, Condition B = Computer program.

Alternate daily, Each day teach 5 words using that day's condition, Assess learning immediately and retention next day.

Results show which method produces better learning and retention. Implement superior method for continued instruction.`);

updateTopic('research', 'research-3', `Multiple baseline designs introduce intervention sequentially across behaviors, settings, or participants while maintaining baseline for others. This demonstrates control without reversing effective treatment.

DEFINITION:
Intervention applied to one baseline while others remain in baseline condition. When first baseline shows clear effect, intervene on second baseline while third remains at baseline. Continue sequentially.

Control shown by temporal relationship - behavior changes only when intervention introduced to that specific baseline, not before.

TYPES:

ACROSS BEHAVIORS:
Target multiple behaviors for one individual. Intervene sequentially on Behavior 1, then Behavior 2, then Behavior 3.

Example: Target hand-raising, homework completion, and staying seated. Start intervention on hand-raising only → it increases while others stay at baseline. Then target homework → it improves. Then staying seated.

Requirements: Behaviors must be functionally independent (intervention on one shouldn't automatically change others). If behaviors too related, generalization may occur (good clinically but weakens design).

ACROSS SETTINGS:
Same behavior, same person, different locations. Example: On-task behavior in math class, reading class, and science class.

Intervene in math first → on-task increases there only. Then reading → increases there while science remains at baseline. Then science.

Requirements: Settings must allow independent intervention. Behavior somewhat independent across settings. Can implement consistently in each setting.

ACROSS PARTICIPANTS:
Same behavior, different individuals. Example: Teaching three students to raise hands before speaking.

Intervene with Student 1 → their hand-raising increases. Students 2 and 3 remain at baseline. Then Student 2, then Student 3.

Requirements: Participants relatively independent (not heavily influencing each other). Same intervention applicable to all. Can stagger intervention practically.

EXPERIMENTAL LOGIC:
If intervention is truly causing change: Behavior changes only when intervention applied to that baseline. Other baselines remain stable (demonstrating they weren't affected by external variables). When intervention introduced to each subsequent baseline, same effect occurs.

This replication demonstrates functional control - IV causes DV change.

ADVANTAGES OVER REVERSAL DESIGNS:
No withdrawal of effective treatment required (ethical advantage!). Especially valuable when: Behavior won't reverse (learned skills). Reversal ethically unacceptable (dangerous behaviors). Client/family objects to withdrawal.

Replication built into design (3+ demonstrations of effect).

Eventually all targets treated (everyone/everything gets intervention).

IMPLEMENTATION PROCEDURES:

ESTABLISHING BASELINES:
Begin collecting data on all baselines simultaneously. Continue baseline until: Stable patterns or clear trends, Adequate data points (minimum 3-5), Patterns sufficiently different that changes will be detectable.

VARIABLE BASELINE LENGTHS: Baselines need not be equal length. Some may be longer (if variable, need more data). Some shorter (if stable quickly).

INTRODUCING INTERVENTION:
Intervene on first baseline when: Baseline stable or showing problem trend (increasing problem behavior, decreasing skill). Clear pattern established.

Continue baseline for other targets.

STAGGERED INTRODUCTION:
Wait to intervene on next baseline until: Previous intervention shows clear effect (data separation), Remaining baselines stay stable (demonstrating independence), Enough time passed to show first effect replicable.

PRACTICAL RULE: 3-5 sessions showing intervention effect on first baseline before starting second.

CONTINUE MEASUREMENT:
Measure all baselines throughout: Even after intervention introduced, keep measuring. All baselines remain on graph throughout study.

SEQUENTIAL INTERVENTION:
Apply to each baseline in succession until all are treated.

DEMONSTRATING STRONG CONTROL:

IMMEDIATE EFFECTS:
Each baseline shows change right when intervention introduced. Minimal delay from intervention start to behavior change. Suggests strong treatment effect.

STABILITY IN UNTREATED BASELINES:
While one baseline in intervention, others remain stable at baseline levels. No premature changes. Shows intervention, not external variables, causing change.

REPLICATED EFFECTS:
Consistent pattern across all baselines. Similar magnitude of effect. Predictable response to intervention.

CONSISTENCY builds confidence in functional relationship.

THREATS TO VALIDITY:

GENERALIZATION ACROSS BASELINES:
Intervention on one baseline affects others. Examples: Teaching hand-raising in math → student raises hand in all classes (across settings generalization). Treating aggression → all problem behaviors decrease (response generalization).

EFFECT: Ruins experimental control (can't show intervention caused change if all changed together). Excellent clinically (want generalization!).

SOLUTION: Select more independent baselines, Implement intervention more discretely, Accept clinical benefit over experimental clarity.

EXTERNAL EVENTS:
If external variable changes and affects all baselines simultaneously, confounds results.

Example: New teacher, medication change, family crisis affecting all behaviors.

CONTROL: Document all programmatic changes, Minimize changes during study, Analyze data for coincidental changes.

BASELINE INSTABILITY:
If baselines highly variable or drifting, hard to detect intervention effects.

Solution: Continue baseline longer until stable, Use larger criterion differences, Statistical analysis may supplement visual if needed.

PRACTICAL CONSTRAINTS:
Long time required (sequential implementation). Need 3+ appropriate baselines. Resources to monitor multiple baselines continuously. Ethical to delay intervention on some targets while treating others.

VARIATIONS:

DELAYED MULTIPLE BASELINE:
Start with one or two baselines. Add more later if needed for replication.

Less rigorous but practically useful.

NON-CONCURRENT MULTIPLE BASELINE:
Baselines not collected simultaneously in time. Different participants at different calendar times.

Weaker design (more threats) but sometimes necessary.

COMBINED DESIGNS:
Multiple baseline + reversal: After all baselines treated, withdraw from one to show reversal.
Multiple baseline + changing criterion: Different criterion levels in different baselines.

WHEN TO USE:
Skill acquisition (won't reverse). Ethical issues with withdrawal. Multiple targets/settings/people available. Applied research showing intervention effectiveness. Practical settings where withdrawal unacceptable.

WHEN NOT TO USE:
Baselines not independent. Fewer than 3 appropriate baselines. Need immediate treatment of all (ethical urgency). High instability in baselines.

DATA DISPLAY:
Stacked (tiered) graphs: Each baseline on separate tier, aligned vertically by time session numbers. Intervention introduction indicated by phase line in each tier. Shows clear temporal relationship between intervention and change.`);

fs.writeFileSync('./content.json', JSON.stringify(content, null, 2));
console.log('\n✅ BATCH 5 COMPLETE: Research Methods (5 topics)\n');
console.log('Progress: 27/47 topics (57%)\n');

