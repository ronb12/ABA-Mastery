// Multimedia Content Support for ABA Mastery
// Adds support for images, diagrams, graphs, and visual content in questions

class MultimediaManager {
    constructor() {
        this.mediaCache = new Map();
        this.supportedTypes = ['image', 'diagram', 'graph', 'chart', 'video'];
    }

    // Add multimedia content to a question
    addMediaToQuestion(questionId, mediaData) {
        const question = this.findQuestion(questionId);
        if (!question) {
            console.error(`Question ${questionId} not found`);
            return false;
        }

        if (!question.multimedia) {
            question.multimedia = [];
        }

        question.multimedia.push({
            id: `media_${Date.now()}`,
            type: mediaData.type,
            url: mediaData.url,
            alt: mediaData.alt || 'Visual content',
            caption: mediaData.caption || '',
            placement: mediaData.placement || 'above-options', // 'above-question', 'above-options', 'in-explanation'
            width: mediaData.width || '100%',
            height: mediaData.height || 'auto'
        });

        return true;
    }

    // Render multimedia content in question display
    renderMedia(media) {
        const container = document.createElement('div');
        container.className = `media-container media-${media.type}`;
        container.style.margin = '20px 0';
        container.style.textAlign = 'center';

        switch (media.type) {
            case 'image':
            case 'diagram':
            case 'graph':
                const img = document.createElement('img');
                img.src = media.url;
                img.alt = media.alt;
                img.style.maxWidth = media.width;
                img.style.height = media.height;
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                container.appendChild(img);
                break;

            case 'chart':
                // For charts, we'll use a placeholder that can integrate with Chart.js
                const chartCanvas = document.createElement('canvas');
                chartCanvas.id = media.id;
                chartCanvas.width = 600;
                chartCanvas.height = 400;
                container.appendChild(chartCanvas);
                break;

            case 'video':
                const video = document.createElement('video');
                video.src = media.url;
                video.controls = true;
                video.style.maxWidth = media.width;
                video.style.borderRadius = '8px';
                container.appendChild(video);
                break;
        }

        // Add caption if present
        if (media.caption) {
            const caption = document.createElement('p');
            caption.className = 'media-caption';
            caption.textContent = media.caption;
            caption.style.fontSize = '14px';
            caption.style.color = 'var(--text-secondary)';
            caption.style.marginTop = '8px';
            caption.style.fontStyle = 'italic';
            container.appendChild(caption);
        }

        return container;
    }

    // Find question by ID
    findQuestion(questionId) {
        if (typeof appData !== 'undefined' && appData.content) {
            return appData.content.practiceQuestions.find(q => q.id === questionId);
        }
        return null;
    }

    // Enhanced display question to include multimedia
    displayQuestionWithMedia(questionIndex) {
        const state = appData.quizState;
        const question = state.questions[questionIndex];

        // Display standard question content
        document.getElementById('question-text').textContent = question.question;

        // Add multimedia if present
        if (question.multimedia && question.multimedia.length > 0) {
            const questionContainer = document.getElementById('question-text').parentElement;
            
            question.multimedia.forEach(media => {
                if (media.placement === 'above-question') {
                    questionContainer.insertBefore(
                        this.renderMedia(media),
                        document.getElementById('question-text')
                    );
                } else if (media.placement === 'above-options') {
                    const answersContainer = document.getElementById('answers-container');
                    answersContainer.parentElement.insertBefore(
                        this.renderMedia(media),
                        answersContainer
                    );
                }
            });
        }

        // Display answer options (standard)
        const container = document.getElementById('answers-container');
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-option';
            btn.textContent = option;
            btn.dataset.index = index;
            
            if (state.answers[questionIndex] === index) {
                btn.classList.add('selected');
            }
            
            btn.addEventListener('click', () => selectAnswer(index));
            container.appendChild(btn);
        });
    }

    // Add explanation media after answer submission
    displayExplanationMedia(question) {
        if (!question.multimedia) return;

        const explanationMedia = question.multimedia.filter(m => m.placement === 'in-explanation');
        if (explanationMedia.length === 0) return;

        const explanationDiv = document.getElementById('explanation-container');
        explanationMedia.forEach(media => {
            explanationDiv.appendChild(this.renderMedia(media));
        });
    }
}

// Sample multimedia question data structure
const sampleMultimediaQuestions = [
    {
        id: "q_visual_1",
        category: "measurement",
        question: "Based on the graph below, what type of trend is demonstrated in the baseline phase?",
        multimedia: [
            {
                type: "graph",
                url: "/assets/graphs/baseline-trend-example.png",
                alt: "Line graph showing baseline data with increasing trend",
                caption: "Figure 1: Baseline data showing clear ascending trend",
                placement: "above-options"
            }
        ],
        options: [
            "Ascending (therapeutic) trend",
            "Descending trend", 
            "No trend (stable)",
            "Variable trend"
        ],
        correctAnswer: 0,
        explanation: "The graph shows an ASCENDING trend during baseline - behavior is increasing over time. This is important because if behavior is already improving during baseline (ascending trend for target behavior increase or descending for behavior reduction), you may want to continue baseline or investigate what's causing the natural change before implementing intervention."
    }
];

// Chart.js integration for data visualization
function createPerformanceChart(canvasId, userData) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: userData.dates,
            datasets: [{
                label: 'Accuracy %',
                data: userData.accuracy,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4
            }, {
                label: 'Exam Readiness %',
                data: userData.readiness,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Your Progress Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                }
            }
        }
    });
}

// Initialize multimedia manager
const multimediaManager = new MultimediaManager();

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultimediaManager, multimediaManager };
}

