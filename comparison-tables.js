// Visual Comparison Tables for ABA Mastery
// Clarifies commonly confused concepts with side-by-side comparisons

const comparisonTables = {
    
    // TABLE 1: Reinforcement vs Punishment (MOST CONFUSED)
    reinforcementPunishment: {
        id: 'reinforcement-punishment',
        title: 'Reinforcement vs Punishment - The 2×2 Matrix',
        priority: 'CRITICAL',
        examFrequency: 'Very High',
        html: `
            <div class="comparison-table-container">
                <h3>Reinforcement vs Punishment Matrix</h3>
                <table class="comparison-table matrix-table">
                    <thead>
                        <tr>
                            <th>Procedure</th>
                            <th>Add/Remove</th>
                            <th>Effect on Behavior</th>
                            <th>Example</th>
                            <th>Remember As</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="positive-row">
                            <td><strong>Positive Reinforcement</strong></td>
                            <td><span class="badge add">ADD ➕</span></td>
                            <td><span class="badge increase">INCREASE ⬆</span></td>
                            <td>Give praise for completing homework → More homework completion</td>
                            <td>"Add good thing = more behavior"</td>
                        </tr>
                        <tr class="negative-row">
                            <td><strong>Negative Reinforcement</strong></td>
                            <td><span class="badge remove">REMOVE ➖</span></td>
                            <td><span class="badge increase">INCREASE ⬆</span></td>
                            <td>Stop nagging when room is cleaned → More room cleaning</td>
                            <td>"Remove bad thing = more behavior"</td>
                        </tr>
                        <tr class="positive-row">
                            <td><strong>Positive Punishment</strong></td>
                            <td><span class="badge add">ADD ➕</span></td>
                            <td><span class="badge decrease">DECREASE ⬇</span></td>
                            <td>Give speeding ticket → Less speeding</td>
                            <td>"Add bad thing = less behavior"</td>
                        </tr>
                        <tr class="negative-row">
                            <td><strong>Negative Punishment</strong></td>
                            <td><span class="badge remove">REMOVE ➖</span></td>
                            <td><span class="badge decrease">DECREASE ⬇</span></td>
                            <td>Take away phone for breaking curfew → Less rule-breaking</td>
                            <td>"Remove good thing = less behavior"</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-key">
                    <p><strong>Key Rule:</strong> "Positive" = ADD something | "Negative" = REMOVE something</p>
                    <p><strong>Key Rule:</strong> "Reinforcement" = INCREASE behavior | "Punishment" = DECREASE behavior</p>
                </div>
            </div>
        `
    },

    // TABLE 2: Differential Reinforcement Procedures
    differentialReinforcement: {
        id: 'differential-reinforcement',
        title: 'Differential Reinforcement: DRO, DRA, DRI, DRL',
        priority: 'CRITICAL',
        examFrequency: 'Very High',
        html: `
            <div class="comparison-table-container">
                <h3>Differential Reinforcement Procedures Compared</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Procedure</th>
                            <th>What Gets Reinforced</th>
                            <th>When to Use</th>
                            <th>Example</th>
                            <th>Key Feature</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>DRO</strong><br>(Other Behavior)</td>
                            <td>ABSENCE of problem behavior for interval</td>
                            <td>Don't know what replacement to teach</td>
                            <td>Reinforce if NO hitting for 5 minutes</td>
                            <td>Time-based, no specific alternative needed</td>
                        </tr>
                        <tr>
                            <td><strong>DRA</strong><br>(Alternative Behavior)</td>
                            <td>SPECIFIC appropriate alternative</td>
                            <td>Have identified replacement behavior</td>
                            <td>Reinforce hand-raising instead of calling out</td>
                            <td>Specific replacement, serves same function</td>
                        </tr>
                        <tr>
                            <td><strong>DRI</strong><br>(Incompatible Behavior)</td>
                            <td>Behavior INCOMPATIBLE with problem</td>
                            <td>Want physical impossibility of problem</td>
                            <td>Reinforce hands-in-lap (can't hit with hands in lap)</td>
                            <td>Physically impossible to do both simultaneously</td>
                        </tr>
                        <tr>
                            <td><strong>DRL</strong><br>(Low Rates)</td>
                            <td>LOWER frequency/rate of behavior</td>
                            <td>Behavior okay in moderation</td>
                            <td>Reinforce if talking out ≤5 times (down from 20)</td>
                            <td>Gradual reduction, behavior isn't eliminated</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Memory Tip:</strong> 
                    DRO = "Other" (anything else) | 
                    DRA = "Alternative" (specific replacement) |  
                    DRI = "Incompatible" (physically can't do both) | 
                    DRL = "Low" (reduce rate)
                </div>
            </div>
        `
    },

    // TABLE 3: Verbal Behavior Operants
    verbalOperants: {
        id: 'verbal-operants',
        title: 'Skinner\'s Verbal Operants Comparison',
        priority: 'CRITICAL',
        examFrequency: 'High',
        html: `
            <div class="comparison-table-container">
                <h3>Verbal Behavior Operants (Skinner, 1957)</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Operant</th>
                            <th>Controlled By</th>
                            <th>Reinforcement</th>
                            <th>Example</th>
                            <th>Key Feature</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Mand</strong></td>
                            <td>Motivating Operation (EO/AO)</td>
                            <td>Specific to form</td>
                            <td>Saying "cookie" when hungry → Gets cookie</td>
                            <td>Directly benefits speaker</td>
                        </tr>
                        <tr>
                            <td><strong>Tact</strong></td>
                            <td>Nonverbal stimulus</td>
                            <td>Generalized social</td>
                            <td>Saying "dog" when seeing dog → "Good talking!"</td>
                            <td>Labels/describes environment</td>
                        </tr>
                        <tr>
                            <td><strong>Echoic</strong></td>
                            <td>Verbal stimulus (with point-to-point)</td>
                            <td>Generalized social</td>
                            <td>Hear "ball" → Say "ball" → "Nice repeating!"</td>
                            <td>Repeats what was heard</td>
                        </tr>
                        <tr>
                            <td><strong>Intraverbal</strong></td>
                            <td>Verbal stimulus (NO point-to-point)</td>
                            <td>Generalized social</td>
                            <td>"What color?" → "Red" → "Good answer!"</td>
                            <td>Answers questions, conversations</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Quick Check:</strong>
                    Mand = Request/demand | 
                    Tact = conTact with environment |
                    Echoic = Echo/repeat | 
                    Intraverbal = Verbal to verbal (different)
                </div>
            </div>
        `
    },

    // TABLE 4: Reinforcement Schedules
    reinforcementSchedules: {
        id: 'schedules',
        title: 'Reinforcement Schedules: FR, VR, FI, VI',
        priority: 'CRITICAL',
        examFrequency: 'Very High',
        html: `
            <div class="comparison-table-container">
                <h3>The Four Basic Reinforcement Schedules</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Schedule</th>
                            <th>Reinforcement Delivered</th>
                            <th>Response Pattern</th>
                            <th>Pause After Reinforcement</th>
                            <th>Resistance to Extinction</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>FR</strong><br>(Fixed Ratio)</td>
                            <td>After EXACT # of responses</td>
                            <td>High, steady rate</td>
                            <td>✅ Yes (longer pause)</td>
                            <td>Moderate</td>
                            <td>FR-5: Every 5th response gets reinforced</td>
                        </tr>
                        <tr>
                            <td><strong>VR</strong><br>(Variable Ratio)</td>
                            <td>After AVERAGE # of responses</td>
                            <td>High, very steady</td>
                            <td>❌ No pause</td>
                            <td>Very High</td>
                            <td>VR-5: Average 5 responses (3,7,4,6...)</td>
                        </tr>
                        <tr>
                            <td><strong>FI</strong><br>(Fixed Interval)</td>
                            <td>First response after EXACT time</td>
                            <td>Scalloped (low→high)</td>
                            <td>✅ Yes (pause at start)</td>
                            <td>Low</td>
                            <td>FI-30s: First response after 30 seconds</td>
                        </tr>
                        <tr>
                            <td><strong>VI</strong><br>(Variable Interval)</td>
                            <td>First response after AVERAGE time</td>
                            <td>Moderate, steady</td>
                            <td>❌ No pause</td>
                            <td>High</td>
                            <td>VI-30s: Average 30s (20s,40s,25s...)</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Memory Tricks:</strong><br>
                    • FIXED = Predictable = Pauses after reinforcement<br>
                    • VARIABLE = Unpredictable = Steady responding (gambling effect)<br>
                    • RATIO = Count responses<br>
                    • INTERVAL = Count time<br>
                    • VR = Highest rate, most resistant to extinction (slot machines!)
                </div>
            </div>
        `
    },

    // TABLE 5: Measurement Methods
    measurementMethods: {
        id: 'measurement-methods',
        title: 'When to Use Each Measurement Method',
        priority: 'HIGH',
        examFrequency: 'High',
        html: `
            <div class="comparison-table-container">
                <h3>Choosing the Right Measurement Method</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>What It Measures</th>
                            <th>Best Used For</th>
                            <th>Advantage</th>
                            <th>Limitation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Event Recording</strong></td>
                            <td>Count/Frequency</td>
                            <td>Discrete behaviors with clear start/end</td>
                            <td>Exact count</td>
                            <td>Requires continuous observation</td>
                        </tr>
                        <tr>
                            <td><strong>Duration</strong></td>
                            <td>How long behavior lasts</td>
                            <td>Tantrums, on-task, engagement</td>
                            <td>Captures length</td>
                            <td>Requires continuous observation</td>
                        </tr>
                        <tr>
                            <td><strong>Latency</strong></td>
                            <td>Time from SD to response</td>
                            <td>Compliance, following instructions</td>
                            <td>Measures promptness</td>
                            <td>Only captures delay, not quality</td>
                        </tr>
                        <tr>
                            <td><strong>Partial Interval</strong></td>
                            <td>If behavior occurred in interval</td>
                            <td>Behaviors you want to DECREASE</td>
                            <td>Doesn't require continuous attention</td>
                            <td>Tends to OVERESTIMATE</td>
                        </tr>
                        <tr>
                            <td><strong>Whole Interval</strong></td>
                            <td>If behavior throughout interval</td>
                            <td>Behaviors you want to INCREASE (on-task)</td>
                            <td>Conservative estimate</td>
                            <td>Tends to UNDERESTIMATE</td>
                        </tr>
                        <tr>
                            <td><strong>Momentary Time Sampling</strong></td>
                            <td>If behavior at specific moment</td>
                            <td>High-rate behaviors, long observations</td>
                            <td>Very practical, less demanding</td>
                            <td>Only samples moments, may miss</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Decision Tree:</strong><br>
                    • Clear start/end? → Event Recording<br>
                    • Length matters? → Duration<br>
                    • Speed matters? → Latency<br>
                    • Want to decrease? → Partial Interval<br>
                    • Want to increase? → Whole Interval<br>
                    • High-rate/long time? → Momentary Time Sampling
                </div>
            </div>
        `
    },

    // TABLE 6: Forward vs Backward Chaining
    chainingComparison: {
        id: 'chaining',
        title: 'Forward vs Backward Chaining',
        priority: 'HIGH',
        examFrequency: 'Medium-High',
        html: `
            <div class="comparison-table-container">
                <h3>Forward vs Backward Chaining</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Aspect</th>
                            <th>Forward Chaining</th>
                            <th>Backward Chaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Teaching Order</strong></td>
                            <td>First step → Last step</td>
                            <td>Last step → First step</td>
                        </tr>
                        <tr>
                            <td><strong>Learner Completes</strong></td>
                            <td>Beginning of chain</td>
                            <td>End of chain (finish task)</td>
                        </tr>
                        <tr>
                            <td><strong>Instructor Completes</strong></td>
                            <td>Remaining steps</td>
                            <td>Initial steps</td>
                        </tr>
                        <tr>
                            <td><strong>Natural Reinforcement</strong></td>
                            <td>Delayed (only at end)</td>
                            <td>Immediate (task completion)</td>
                        </tr>
                        <tr>
                            <td><strong>Advantage</strong></td>
                            <td>Logical sequence</td>
                            <td>Learner experiences completion/success</td>
                        </tr>
                        <tr>
                            <td><strong>Example (Handwashing)</strong></td>
                            <td>Teach: Turn on water (first)→ Then add steps</td>
                            <td>Teach: Dry hands (last) → Then add earlier steps</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Which to Choose?</strong><br>
                    • Forward: More intuitive, natural sequence<br>
                    • Backward: Learner gets task completion reinforcement immediately<br>
                    • Both work - choose based on task and learner needs
                </div>
            </div>
        `
    },

    // TABLE 7: IOA Calculation Methods
    ioaMethods: {
        id: 'ioa-methods',
        title: 'IOA Calculation Methods Comparison',
        priority: 'HIGH',
        examFrequency: 'Medium',
        html: `
            <div class="comparison-table-container">
                <h3>Interobserver Agreement (IOA) Calculation Methods</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Formula</th>
                            <th>Best Used For</th>
                            <th>Stringency</th>
                            <th>When High IOA Might Be Misleading</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Total Count IOA</strong></td>
                            <td>(Smaller count ÷ Larger count) × 100</td>
                            <td>Event recording</td>
                            <td>⭐ Least stringent</td>
                            <td>When observers disagree on WHICH occurrences</td>
                        </tr>
                        <tr>
                            <td><strong>Interval-by-Interval</strong></td>
                            <td>(Agreements ÷ Total intervals) × 100</td>
                            <td>Interval recording</td>
                            <td>⭐⭐⭐ Most stringent</td>
                            <td>Recommended standard - most conservative</td>
                        </tr>
                        <tr>
                            <td><strong>Scored-Interval IOA</strong></td>
                            <td>(Agreements ÷ Intervals scored by either) × 100</td>
                            <td>Low-rate behaviors</td>
                            <td>⭐⭐ Moderate</td>
                            <td>Inflates agreement for low-rate behaviors</td>
                        </tr>
                        <tr>
                            <td><strong>Mean Count-per-Interval</strong></td>
                            <td>Average of interval IOAs</td>
                            <td>Event recording with intervals</td>
                            <td>⭐⭐ Moderate</td>
                            <td>Complex calculation, moderate stringency</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Exam Tip:</strong> Interval-by-interval is the MOST CONSERVATIVE (stringent) method - when in doubt, choose this!
                    Target IOA: ≥80% (some sources say ≥90% for important decisions)
                </div>
            </div>
        `
    },

    // TABLE 8: Experimental Designs
    experimentalDesigns: {
        id: 'experimental-designs',
        title: 'Single-Subject Experimental Designs',
        priority: 'HIGH',
        examFrequency: 'Medium-High',
        html: `
            <div class="comparison-table-container">
                <h3>Single-Subject Design Comparison</h3>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Design</th>
                            <th>How It Works</th>
                            <th>Demonstrates Control By</th>
                            <th>Best Used When</th>
                            <th>Limitation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>ABAB<br>(Reversal)</strong></td>
                            <td>Baseline → Intervention → Baseline → Intervention</td>
                            <td>Showing behavior returns to baseline when IV removed</td>
                            <td>Behavior is reversible</td>
                            <td>Unethical if behavior won't reverse (learned skills)</td>
                        </tr>
                        <tr>
                            <td><strong>Multiple Baseline</strong></td>
                            <td>Stagger intervention across behaviors/settings/people</td>
                            <td>Only treated baseline changes, others stay stable</td>
                            <td>Behavior unlikely to reverse</td>
                            <td>Requires multiple baselines, longer to complete</td>
                        </tr>
                        <tr>
                            <td><strong>Alternating Treatments</strong></td>
                            <td>Rapidly alternate between 2+ interventions</td>
                            <td>Different levels for different treatments</td>
                            <td>Comparing interventions quickly</td>
                            <td>Contrast/carryover effects possible</td>
                        </tr>
                        <tr>
                            <td><strong>Changing Criterion</strong></td>
                            <td>Systematically increase/decrease criterion</td>
                            <td>Behavior matches changing criterion</td>
                            <td>Shaping or gradual behavior change</td>
                            <td>Only works for behaviors on continuum</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-memory-tip">
                    <strong>Quick Selection:</strong><br>
                    • Can reverse? → ABAB<br>
                    • Can't reverse? → Multiple Baseline<br>
                    • Comparing treatments? → Alternating Treatments<br>
                    • Gradual shaping? → Changing Criterion
                </div>
            </div>
        `
    }
};

// Add 20 more comparison tables for other commonly confused topics...
// (For space, showing first 5. Full implementation would include all 30)

// Function to display comparison table
function displayComparisonTable(tableId, containerId = 'comparison-container') {
    const table = comparisonTables[tableId];
    if (!table) {
        console.error('Table not found:', tableId);
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }

    container.innerHTML = table.html;
}

// Add comparison table styles
function addComparisonTableStyles() {
    if (document.getElementById('comparison-table-styles')) return;

    const style = document.createElement('style');
    style.id = 'comparison-table-styles';
    style.textContent = `
        .comparison-table-container {
            margin: 24px 0;
            padding: 24px;
            background: var(--bg-primary);
            border-radius: 12px;
            border: 2px solid var(--border-color);
            box-shadow: var(--shadow-sm);
        }

        .comparison-table-container h3 {
            margin-bottom: 20px;
            color: var(--primary-color);
            font-size: 20px;
            font-weight: 700;
        }

        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }

        .comparison-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .comparison-table th {
            padding: 14px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }

        .comparison-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .comparison-table tbody tr:hover {
            background: #f8fafc;
        }

        .comparison-table tbody tr:last-child td {
            border-bottom: none;
        }

        .comparison-table .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge.add {
            background: #dbeafe;
            color: #1e40af;
        }

        .badge.remove {
            background: #fee2e2;
            color: #991b1b;
        }

        .badge.increase {
            background: #d1fae5;
            color: #065f46;
        }

        .badge.decrease {
            background: #fef3c7;
            color: #92400e;
        }

        .table-key, .table-memory-tip {
            margin-top: 16px;
            padding: 16px;
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
        }

        .table-memory-tip strong {
            color: #92400e;
        }

        .matrix-table {
            max-width: 100%;
        }

        .positive-row {
            background: #f0fdf4;
        }

        .negative-row {
            background: #fef2f2;
        }

        .sr-home-notice {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 32px;
            display: flex;
            gap: 20px;
            align-items: center;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .sr-notice-icon {
            font-size: 48px;
        }

        .sr-notice-content h3 {
            margin: 0 0 8px 0;
            font-size: 22px;
        }

        .sr-notice-content p {
            margin: 0 0 16px 0;
            opacity: 0.95;
        }

        .sr-stat-card {
            background: var(--bg-primary);
            padding: 24px;
            border-radius: 12px;
            border: 2px solid var(--border-color);
            text-align: center;
        }

        .sr-stat-card.highlight {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
        }

        .sr-stat-card.success {
            border-color: #10b981;
        }

        .sr-stat-card.efficiency {
            border-color: #f59e0b;
        }

        .sr-stat-value {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 8px;
            color: var(--primary-color);
        }

        .sr-stat-card.highlight .sr-stat-value {
            color: white;
        }

        .sr-stat-label {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .sr-stat-note {
            font-size: 12px;
            opacity: 0.7;
        }

        .sr-action-section {
            background: var(--bg-secondary);
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
        }

        .session-breakdown {
            display: grid;
            gap: 16px;
            margin: 20px 0;
        }

        .session-type {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            border: 2px solid var(--border-color);
        }

        .session-icon {
            font-size: 32px;
        }

        .session-count {
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-color);
        }

        .session-label {
            font-weight: 600;
            flex: 1;
        }

        .session-note {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .btn-large {
            padding: 16px 32px;
            font-size: 18px;
        }

        .efficiency-note {
            margin-top: 16px;
            text-align: center;
            font-size: 14px;
            color: var(--text-secondary);
        }

        .how-it-works-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }

        .how-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid var(--border-color);
            text-align: center;
        }

        .how-icon {
            font-size: 36px;
            margin-bottom: 12px;
        }

        .how-card h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: var(--primary-color);
        }

        .how-card p {
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        [data-theme="dark"] .comparison-table {
            background: var(--bg-secondary);
        }

        [data-theme="dark"] .comparison-table tbody tr:hover {
            background: var(--bg-tertiary);
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
setTimeout(addComparisonTableStyles, 100);

// Create comparison tables reference section
function createComparisonTablesSection() {
    // Add to study view or create dedicated section
    const studyView = document.getElementById('study-view');
    if (!studyView) return;

    const tablesSection = document.createElement('div');
    tablesSection.id = 'comparison-tables-section';
    tablesSection.innerHTML = `
        <div class="view-header" style="margin-top: 32px;">
            <h2>📊 Quick Reference Comparison Tables</h2>
            <p>Clarify commonly confused concepts at a glance</p>
        </div>
        <div class="tables-grid" id="tables-grid">
            ${Object.keys(comparisonTables).map(key => {
                const table = comparisonTables[key];
                return `
                    <div class="table-card" onclick="showComparisonTable('${key}')">
                        <h4>${table.title}</h4>
                        <div class="table-meta">
                            <span class="priority-badge ${table.priority.toLowerCase()}">${table.priority}</span>
                            <span>Exam frequency: ${table.examFrequency}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    studyView.appendChild(tablesSection);
}

// Show comparison table in modal
function showComparisonTable(tableId) {
    const table = comparisonTables[tableId];
    if (!table) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px;">
            <div class="modal-header">
                <h2>📊 ${table.title}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                ${table.html}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn btn-primary" onclick="bookmarkTable('${tableId}'); this.closest('.modal').remove();">🔖 Bookmark for Later</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Bookmark comparison table for quick access
function bookmarkTable(tableId) {
    const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
    if (!userData.bookmarkedTables) {
        userData.bookmarkedTables = [];
    }
    
    if (!userData.bookmarkedTables.includes(tableId)) {
        userData.bookmarkedTables.push(tableId);
        localStorage.setItem('abaUserData', JSON.stringify(userData));
        alert('✅ Table bookmarked! Access from Study → Comparison Tables');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { comparisonTables, displayComparisonTable };
}

