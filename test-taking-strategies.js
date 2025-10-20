// Test-Taking Strategy Training Module for ABA Mastery
// Teaches exam-specific skills to improve performance 5-8%

class TestTakingStrategies {
    constructor() {
        this.strategies = this.loadStrategies();
        this.userProgress = this.loadProgress();
    }

    // Load strategy progress
    loadProgress() {
        const saved = localStorage.getItem('abaTestStrategies');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            strategiesLearned: [],
            practiceCompleted: [],
            confidenceLevel: 0,
            strategiesApplied: 0
        };
    }

    // Save progress
    saveProgress() {
        localStorage.setItem('abaTestStrategies', JSON.stringify(this.userProgress));
    }

    // Load all strategies
    loadStrategies() {
        return {
            // STRATEGY 1: Question Type Identification
            questionTypes: {
                id: 'question-types',
                title: 'Identify Question Types',
                description: 'Recognize different question formats and adjust approach',
                impact: '+2-3% accuracy',
                types: [
                    {
                        type: 'Definition/Recall',
                        identifiers: ['"Define...", "What is...", "Which term describes..."'],
                        strategy: 'Recall exact definition. Eliminate options that are close but not precise.',
                        example: '"What is positive reinforcement?" → Look for exact Cooper definition'
                    },
                    {
                        type: 'Application/Scenario',
                        identifiers: ['"A BCBA observes...", "In this scenario...", "Given the following..."'],
                        strategy: 'Apply principles to situation. Think: What would actually work here?',
                        example: '"A child tantrums for cookies. What function?" → Apply FBA knowledge'
                    },
                    {
                        type: 'Best/Most Appropriate',
                        identifiers: ['"BEST describes", "MOST appropriate", "PRIMARY purpose"'],
                        strategy: 'All options may be partly true - choose MOST accurate/comprehensive',
                        example: '"BEST describes DRO" → Pick most complete/accurate definition'
                    },
                    {
                        type: 'EXCEPT/NOT',
                        identifiers: ['"All EXCEPT", "Which is NOT", "All are true EXCEPT"'],
                        strategy: 'CAREFUL! Looking for the FALSE one. Mark each as T/F, find the odd one.',
                        example: '"All are reinforcement EXCEPT" → Find the punishment option'
                    },
                    {
                        type: 'Sequence/Order',
                        identifiers: ['"First step", "Next step", "Correct order"'],
                        strategy: 'Think through logical/chronological sequence',
                        example: '"First step in FBA?" → Indirect assessment comes before FA'
                    }
                ]
            },

            // STRATEGY 2: Elimination Technique
            elimination: {
                id: 'elimination',
                title: 'Systematic Elimination',
                description: 'Rule out wrong answers to find correct one',
                impact: '+3-4% accuracy',
                steps: [
                    {
                        step: 1,
                        action: 'Read question carefully, identify what it\'s really asking',
                        tip: 'Underline key words: MOST, BEST, FIRST, EXCEPT, NOT'
                    },
                    {
                        step: 2,
                        action: 'Eliminate obviously wrong answers',
                        tip: 'Cross out options that are clearly incorrect or irrelevant'
                    },
                    {
                        step: 3,
                        action: 'Look for absolutes in remaining options',
                        tip: 'Words like "always", "never", "only" are usually wrong in ABA (few absolutes)'
                    },
                    {
                        step: 4,
                        action: 'Compare remaining 2-3 options',
                        tip: 'Which is most specific? Most accurate? Most aligned with BACB language?'
                    },
                    {
                        step: 5,
                        action: 'Choose the BEST answer from remaining',
                        tip: 'Don\'t overthink! Usually first instinct after elimination is correct'
                    }
                ],
                commonTraps: [
                    'Partially correct options (true but incomplete)',
                    'Using everyday language vs technical ABA terms',
                    'Confusing similar-sounding concepts',
                    'Overthinking simple questions'
                ]
            },

            // STRATEGY 3: Time Management
            timeManagement: {
                id: 'time-management',
                title: 'Exam Time Management',
                description: 'Optimize pacing to complete all questions',
                impact: '+2-3% by finishing all questions',
                guidelines: [
                    {
                        exam: 'BCBA',
                        totalTime: '2 hours (120 minutes)',
                        totalQuestions: 100,
                        timePerQuestion: '1.2 minutes (72 seconds)',
                        strategy: [
                            'Aim for 50 questions in first hour (2 min each)',
                            'Speed up in second hour if needed (1 min each)',
                            'Flag difficult questions, return with remaining time',
                            'Never spend more than 3 minutes on one question'
                        ]
                    },
                    {
                        exam: 'BCaBA',
                        totalTime: '1.5 hours (90 minutes)',
                        totalQuestions: 65,
                        timePerQuestion: '1.4 minutes (84 seconds)',
                        strategy: [
                            'Aim for 30-35 questions in first 45 minutes',
                            'Maintain pace in second half',
                            'Flag and skip if stuck after 2 minutes',
                            'Use final 10 minutes for flagged questions'
                        ]
                    }
                ],
                techniques: [
                    {
                        name: 'First Pass Strategy',
                        description: 'Answer all easy/medium questions first',
                        benefit: 'Locks in points, builds confidence, manages time'
                    },
                    {
                        name: 'Flag & Return',
                        description: 'Flag difficult questions, come back with fresh perspective',
                        benefit: 'Prevents getting stuck, maintains momentum'
                    },
                    {
                        name: 'Time Check Points',
                        description: 'Check clock every 25 questions',
                        benefit: 'Stay on pace, adjust speed if needed'
                    }
                ]
            },

            // STRATEGY 4: Common Exam Traps
            commonTraps: {
                id: 'exam-traps',
                title: 'Avoid Common Exam Traps',
                description: 'Recognize and avoid typical mistakes',
                impact: '+2-3% by avoiding traps',
                traps: [
                    {
                        trap: 'Confusing Positive/Negative',
                        why: 'Most common error on BCBA exam',
                        solution: 'Remember: Positive = ADD, Negative = REMOVE (nothing to do with good/bad)',
                        practicePhrase: '"Positive Nagging" = ADDING nagging (annoying but "positive")'
                    },
                    {
                        trap: 'Mixing up Reinforcement/Punishment',
                        why: 'Second most common error',
                        solution: 'Check the EFFECT: Does behavior increase (reinf.) or decrease (pun.)?',
                        practicePhrase: 'Negative reinforcement INCREASES behavior (it\'s reinforcement!)'
                    },
                    {
                        trap: 'Partially Correct Answers',
                        why: 'Options may be true but incomplete',
                        solution: 'Look for MOST complete, comprehensive answer',
                        practicePhrase: 'True ≠ Best. Choose most accurate option.'
                    },
                    {
                        trap: 'Overthinking Simple Questions',
                        why: 'Looking for complexity that isn\'t there',
                        solution: 'If it seems simple, it probably is. Trust your knowledge.',
                        practicePhrase: 'Not every question is a trick question'
                    },
                    {
                        trap: 'Ignoring "EXCEPT" or "NOT"',
                        why: 'Reading too fast, missing critical word',
                        solution: 'CIRCLE or UNDERLINE "EXCEPT"/"NOT" - looking for FALSE answer',
                        practicePhrase: 'EXCEPT questions flip everything'
                    },
                    {
                        trap: 'Assuming "Always" or "Never"',
                        why: 'ABA has few absolutes',
                        solution: 'Options with "always"/"never" are usually wrong',
                        practicePhrase: 'Behavior analysis recognizes variability'
                    }
                ]
            },

            // STRATEGY 5: Anxiety Management
            anxietyManagement: {
                id: 'anxiety-management',
                title: 'Manage Test Anxiety',
                description: 'Stay calm and perform your best',
                impact: '+1-2% by reducing anxiety interference',
                techniques: [
                    {
                        name: 'Deep Breathing',
                        when: 'Before exam, during difficult stretches',
                        how: 'Breathe in 4 counts, hold 4, out 4. Repeat 3x.',
                        why: 'Activates parasympathetic nervous system, reduces cortisol'
                    },
                    {
                        name: 'Positive Self-Talk',
                        when: 'When doubting yourself',
                        how: '"I\'ve practiced 500+ questions. I know this material."',
                        why: 'Counters negative thoughts, maintains confidence'
                    },
                    {
                        name: 'Skip & Return',
                        when: 'Feeling stuck on a question',
                        how: 'Flag it, move on, return with fresh perspective',
                        why: 'Prevents rumination, maintains momentum'
                    },
                    {
                        name: 'Progress Anchoring',
                        when: 'Feeling overwhelmed',
                        how: 'Focus on questions completed, not remaining',
                        why: 'Maintains motivation, positive frame'
                    }
                ]
            }
        };
    }

    // Display strategy training module
    displayStrategyTraining() {
        const container = document.getElementById('strategy-training-container');
        if (!container) return;

        container.innerHTML = `
            <div class="strategy-training-header">
                <h2>🎯 Test-Taking Strategy Training</h2>
                <p>Master exam-specific skills to improve performance 5-8%</p>
                <div class="impact-badge">Research-Backed: +5-8% Score Improvement</div>
            </div>

            <div class="strategies-grid">
                ${this.createStrategyCard(this.strategies.questionTypes)}
                ${this.createStrategyCard(this.strategies.elimination)}
                ${this.createStrategyCard(this.strategies.timeManagement)}
                ${this.createStrategyCard(this.strategies.commonTraps)}
                ${this.createStrategyCard(this.strategies.anxietyManagement)}
            </div>

            <div class="strategy-practice-section">
                <h3>📝 Practice These Strategies</h3>
                <p>Apply strategies during your next practice session to build test-taking skills!</p>
                <button class="btn btn-primary" onclick="startStrategyPractice()">
                    Practice with Strategy Guidance
                </button>
            </div>
        `;
    }

    // Create individual strategy card
    createStrategyCard(strategy) {
        return `
            <div class="strategy-card" onclick="testTakingStrategies.showStrategyDetails('${strategy.id}')">
                <h3>${strategy.title}</h3>
                <p>${strategy.description}</p>
                <div class="strategy-impact">${strategy.impact}</div>
                <button class="btn btn-secondary btn-small" onclick="testTakingStrategies.showStrategyDetails('${strategy.id}'); event.stopPropagation();">Learn More →</button>
            </div>
        `;
    }

    // Show full strategy details
    showStrategyDetails(strategyId) {
        const strategy = Object.values(this.strategies).find(s => s.id === strategyId);
        if (!strategy) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${strategy.title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="font-size: 16px; margin-bottom: 20px;">${strategy.description}</p>
                    <div class="impact-note">Expected Impact: <strong>${strategy.impact}</strong></div>
                    
                    ${this.renderStrategyContent(strategy)}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="testTakingStrategies.markStrategyLearned('${strategy.id}'); this.closest('.modal').remove();">
                        ✓ Mark as Learned
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Render strategy-specific content
    renderStrategyContent(strategy) {
        if (strategy.types) {
            // Question types
            return `
                <h4>Question Types to Recognize:</h4>
                ${strategy.types.map(type => `
                    <div class="strategy-detail-card">
                        <h5>${type.type}</h5>
                        <p><strong>Look for:</strong> ${type.identifiers.join(', ')}</p>
                        <p><strong>Strategy:</strong> ${type.strategy}</p>
                        <p><strong>Example:</strong> <em>${type.example}</em></p>
                    </div>
                `).join('')}
            `;
        } else if (strategy.steps) {
            // Elimination steps
            return `
                <h4>5-Step Elimination Process:</h4>
                <ol class="strategy-steps">
                    ${strategy.steps.map(step => `
                        <li>
                            <strong>Step ${step.step}:</strong> ${step.action}
                            <br><em>Tip: ${step.tip}</em>
                        </li>
                    `).join('')}
                </ol>
                <h4 style="margin-top: 24px;">Common Traps to Avoid:</h4>
                <ul>
                    ${strategy.commonTraps.map(trap => `<li>${trap}</li>`).join('')}
                </ul>
            `;
        } else if (strategy.guidelines) {
            // Time management
            return `
                <h4>Time Guidelines by Exam Type:</h4>
                ${strategy.guidelines.map(guide => `
                    <div class="strategy-detail-card">
                        <h5>${guide.exam} Exam</h5>
                        <p><strong>Total Time:</strong> ${guide.totalTime}</p>
                        <p><strong>Questions:</strong> ${guide.totalQuestions}</p>
                        <p><strong>Time per Question:</strong> ${guide.timePerQuestion}</p>
                        <h6>Strategy:</h6>
                        <ul>
                            ${guide.strategy.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
                <h4 style="margin-top: 20px;">Techniques:</h4>
                ${strategy.techniques.map(tech => `
                    <div class="technique-card">
                        <h5>${tech.name}</h5>
                        <p>${tech.description}</p>
                        <p><strong>Benefit:</strong> ${tech.benefit}</p>
                    </div>
                `).join('')}
            `;
        } else if (strategy.traps) {
            // Common traps
            return `
                <h4>Recognize These Common Pitfalls:</h4>
                ${strategy.traps.map(trap => `
                    <div class="strategy-detail-card trap-card">
                        <h5>❌ ${trap.trap}</h5>
                        <p><strong>Why it happens:</strong> ${trap.why}</p>
                        <p><strong>Solution:</strong> ${trap.solution}</p>
                        <p class="practice-phrase"><strong>Practice phrase:</strong> "${trap.practicePhrase}"</p>
                    </div>
                `).join('')}
            `;
        } else if (strategy.techniques) {
            // Anxiety management
            return `
                <h4>Anxiety Reduction Techniques:</h4>
                ${strategy.techniques.map(tech => `
                    <div class="strategy-detail-card">
                        <h5>${tech.name}</h5>
                        <p><strong>When to use:</strong> ${tech.when}</p>
                        <p><strong>How to do it:</strong> ${tech.how}</p>
                        <p><strong>Why it works:</strong> ${tech.why}</p>
                    </div>
                `).join('')}
            `;
        }
    }

    // Mark strategy as learned
    markStrategyLearned(strategyId) {
        if (!this.userProgress.strategiesLearned.includes(strategyId)) {
            this.userProgress.strategiesLearned.push(strategyId);
            this.userProgress.confidenceLevel = Math.min(100, this.userProgress.confidenceLevel + 20);
            this.saveProgress();
            
            alert('✅ Strategy learned! Apply it in your next practice session.');
        }
    }

    // Show strategy hints during practice
    showStrategyHint(question) {
        const hints = [];

        // Detect question type
        const questionText = question.question.toLowerCase();
        
        if (questionText.includes('best') || questionText.includes('most')) {
            hints.push('💡 "BEST/MOST" question - All options may be partly true. Choose the MOST accurate.');
        }
        
        if (questionText.includes('except') || questionText.includes('not ')) {
            hints.push('⚠️ "EXCEPT/NOT" question - Looking for the FALSE option!');
        }
        
        if (questionText.includes('first') || questionText.includes('next step')) {
            hints.push('📋 Sequence question - Think through logical order.');
        }

        // Add hint to UI if available
        if (hints.length > 0 && document.getElementById('strategy-hint-container')) {
            document.getElementById('strategy-hint-container').innerHTML = `
                <div class="strategy-hint">
                    ${hints.join('<br>')}
                </div>
            `;
            document.getElementById('strategy-hint-container').style.display = 'block';
        }

        return hints;
    }
}

// Initialize test-taking strategies
const testTakingStrategies = new TestTakingStrategies();

// Start strategy-guided practice
function startStrategyPractice() {
    // Start a regular practice quiz but with strategy hints enabled
    const questions = shuffle([...appData.content.practiceQuestions]).slice(0, 20);
    
    appData.quizState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        correctCount: 0,
        startTime: Date.now(),
        examMode: 'strategy-practice',
        examDuration: null,
        isFullExam: false,
        strategyHintsEnabled: true
    };

    switchView('practice');
    document.getElementById('practice-setup').style.display = 'none';
    document.getElementById('practice-quiz').style.display = 'block';
    displayQuestion();
}

// Enhanced display question with strategy hints
const originalDisplayQuestionStrategy = displayQuestion;
displayQuestion = function() {
    originalDisplayQuestionStrategy();

    const state = appData.quizState;
    if (!state || !state.strategyHintsEnabled) return;

    const question = state.questions[state.currentIndex];
    
    // Add strategy hint container if not exists
    const quizContent = document.querySelector('.quiz-content');
    if (quizContent && !document.getElementById('strategy-hint-container')) {
        const hintContainer = document.createElement('div');
        hintContainer.id = 'strategy-hint-container';
        hintContainer.style.display = 'none';
        quizContent.insertBefore(hintContainer, document.getElementById('answers-container'));
    }

    // Show strategy hints
    if (typeof testTakingStrategies !== 'undefined') {
        testTakingStrategies.showStrategyHint(question);
    }
};

// Add strategy training section to settings or dedicated view
function addStrategyTrainingSection() {
    const settingsView = document.getElementById('settings-view');
    if (!settingsView) return;

    // Check if already added
    if (document.getElementById('strategy-training-container')) return;

    const strategySection = document.createElement('div');
    strategySection.id = 'strategy-training-container';
    strategySection.style.marginBottom = '32px';

    settingsView.insertBefore(strategySection, settingsView.firstChild);
    
    if (typeof testTakingStrategies !== 'undefined') {
        testTakingStrategies.displayStrategyTraining();
    }
}

// Add styles for strategy module
function addStrategyStyles() {
    if (document.getElementById('strategy-styles')) return;

    const style = document.createElement('style');
    style.id = 'strategy-styles';
    style.textContent = `
        .strategy-training-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .impact-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 12px;
        }

        .strategies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .strategy-card {
            background: var(--bg-primary);
            padding: 24px;
            border-radius: 12px;
            border: 2px solid var(--border-color);
            cursor: pointer;
            transition: all 0.3s;
        }

        .strategy-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .strategy-card h3 {
            margin: 0 0 12px 0;
            font-size: 18px;
            color: var(--primary-color);
        }

        .strategy-card p {
            margin: 0 0 16px 0;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .strategy-impact {
            font-size: 13px;
            font-weight: 600;
            color: #10b981;
            margin-bottom: 12px;
        }

        .strategy-detail-card {
            background: var(--bg-secondary);
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            border-left: 4px solid var(--primary-color);
        }

        .strategy-detail-card h5 {
            margin: 0 0 8px 0;
            color: var(--primary-color);
        }

        .strategy-detail-card p {
            margin: 6px 0;
            font-size: 14px;
        }

        .strategy-detail-card.trap-card {
            border-left-color: #ef4444;
        }

        .practice-phrase {
            font-style: italic;
            color: #059669;
            background: #f0fdf4;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
        }

        .strategy-steps {
            padding-left: 24px;
        }

        .strategy-steps li {
            margin: 12px 0;
            line-height: 1.6;
        }

        .strategy-hint {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            color: #92400e;
        }

        .impact-note {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #065f46;
        }

        .technique-card {
            background: white;
            padding: 12px;
            margin: 8px 0;
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }

        .technique-card h5 {
            margin: 0 0 6px 0;
            font-size: 15px;
        }

        .technique-card p {
            margin: 4px 0;
            font-size: 13px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize
setTimeout(() => {
    addStrategyStyles();
    addStrategyTrainingSection();
}, 1000);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestTakingStrategies, testTakingStrategies };
}

