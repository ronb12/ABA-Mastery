// Video Explanation System for ABA Mastery
// Provides video-based explanations for complex concepts

class VideoExplanationSystem {
    constructor() {
        this.videoLibrary = new Map();
        this.videoPlayer = null;
        this.initializePlayer();
    }

    // Initialize video player modal
    initializePlayer() {
        // Create modal for video player
        const modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'video-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="video-modal-content">
                <div class="video-modal-header">
                    <h3 id="video-title">Video Explanation</h3>
                    <button class="video-close-btn" onclick="videoExplanationSystem.closeVideo()">×</button>
                </div>
                <div class="video-container">
                    <video id="explanation-video" controls style="width: 100%; border-radius: 8px;">
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-modal-footer">
                    <p id="video-description"></p>
                    <div class="video-actions">
                        <button class="btn btn-secondary" onclick="videoExplanationSystem.closeVideo()">Close</button>
                        <button class="btn btn-primary" onclick="videoExplanationSystem.markAsWatched()">Mark as Watched</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.videoPlayer = modal;

        // Add styles
        this.addStyles();
    }

    // Add video explanation styles
    addStyles() {
        if (document.getElementById('video-explanation-styles')) return;

        const style = document.createElement('style');
        style.id = 'video-explanation-styles';
        style.textContent = `
            .video-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                animation: fadeIn 0.3s;
            }

            .video-modal-content {
                background: var(--bg-primary);
                border-radius: 16px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .video-modal-header {
                padding: 24px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .video-modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
            }

            .video-close-btn {
                background: none;
                border: none;
                font-size: 32px;
                cursor: pointer;
                color: var(--text-secondary);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .video-close-btn:hover {
                background: var(--bg-secondary);
                transform: scale(1.1);
            }

            .video-container {
                padding: 24px;
                background: #000;
            }

            .video-modal-footer {
                padding: 24px;
                border-top: 1px solid var(--border-color);
            }

            .video-modal-footer p {
                margin-bottom: 16px;
                color: var(--text-secondary);
                line-height: 1.6;
            }

            .video-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            .video-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .video-btn:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }

            .video-btn.watched {
                background: var(--success-color);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Add video explanation to question
    addVideoToQuestion(questionId, videoData) {
        this.videoLibrary.set(questionId, {
            id: videoData.id || `video_${questionId}`,
            title: videoData.title,
            url: videoData.url,
            description: videoData.description,
            duration: videoData.duration,
            transcript: videoData.transcript || '',
            watched: false
        });
    }

    // Display video button with question
    addVideoButtonToQuestion(questionId) {
        if (!this.videoLibrary.has(questionId)) return;

        const video = this.videoLibrary.get(questionId);
        const explanationContainer = document.getElementById('explanation-container');
        
        if (!explanationContainer) return;

        // Check if button already exists
        if (document.getElementById(`video-btn-${questionId}`)) return;

        const videoBtn = document.createElement('button');
        videoBtn.id = `video-btn-${questionId}`;
        videoBtn.className = `video-btn ${video.watched ? 'watched' : ''}`;
        videoBtn.innerHTML = `
            <span>🎥</span>
            <span>${video.watched ? 'Rewatch' : 'Watch'} Video Explanation</span>
            <span style="font-size: 11px; opacity: 0.8;">(${video.duration})</span>
        `;
        videoBtn.onclick = () => this.playVideo(questionId);

        explanationContainer.appendChild(videoBtn);
    }

    // Play video explanation
    playVideo(questionId) {
        const video = this.videoLibrary.get(questionId);
        if (!video) return;

        // Set video content
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description;
        const videoElement = document.getElementById('explanation-video');
        videoElement.src = video.url;

        // Store current question for marking as watched
        this.currentVideoQuestionId = questionId;

        // Show modal
        this.videoPlayer.style.display = 'flex';
        
        // Play video
        videoElement.play();

        // Track video view
        this.trackVideoView(questionId);
    }

    // Close video modal
    closeVideo() {
        this.videoPlayer.style.display = 'none';
        const videoElement = document.getElementById('explanation-video');
        videoElement.pause();
        videoElement.currentTime = 0;
    }

    // Mark video as watched
    markAsWatched() {
        if (this.currentVideoQuestionId) {
            const video = this.videoLibrary.get(this.currentVideoQuestionId);
            if (video) {
                video.watched = true;
                this.saveWatchedStatus(this.currentVideoQuestionId);
                
                // Update button
                const btn = document.getElementById(`video-btn-${this.currentVideoQuestionId}`);
                if (btn) {
                    btn.classList.add('watched');
                    btn.innerHTML = `
                        <span>✓</span>
                        <span>Rewatch Video Explanation</span>
                    `;
                }
            }
        }
        this.closeVideo();
    }

    // Track video views in analytics
    trackVideoView(questionId) {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        if (!userData.videosWatched) {
            userData.videosWatched = [];
        }
        
        userData.videosWatched.push({
            questionId,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('abaUserData', JSON.stringify(userData));
    }

    // Save watched status
    saveWatchedStatus(questionId) {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        if (!userData.watchedVideos) {
            userData.watchedVideos = [];
        }
        
        if (!userData.watchedVideos.includes(questionId)) {
            userData.watchedVideos.push(questionId);
        }

        localStorage.setItem('abaUserData', JSON.stringify(userData));
    }

    // Load watched status
    loadWatchedStatus() {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        const watched = userData.watchedVideos || [];
        
        watched.forEach(questionId => {
            const video = this.videoLibrary.get(questionId);
            if (video) {
                video.watched = true;
            }
        });
    }

    // Get video statistics
    getVideoStats() {
        const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
        const totalVideos = this.videoLibrary.size;
        const watchedCount = (userData.watchedVideos || []).length;
        const viewCount = (userData.videosWatched || []).length;

        return {
            totalVideos,
            watchedCount,
            watchedPercentage: totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0,
            totalViews: viewCount
        };
    }
}

// Sample video library data
const sampleVideoExplanations = [
    {
        questionId: "q1",
        title: "Understanding Positive Reinforcement",
        url: "https://example.com/videos/positive-reinforcement.mp4",
        description: "This 3-minute video explains the key differences between positive and negative reinforcement with real-world examples.",
        duration: "3:24",
        transcript: "Positive reinforcement involves adding a stimulus..."
    },
    {
        questionId: "q50",
        title: "Functional Behavior Assessment Process",
        url: "https://example.com/videos/fba-process.mp4",
        description: "Learn the step-by-step process of conducting a comprehensive FBA, from indirect assessment to functional analysis.",
        duration: "5:45",
        transcript: "The FBA process begins with gathering information..."
    },
    {
        questionId: "q100",
        title: "Reinforcement Schedules Explained",
        url: "https://example.com/videos/schedules.mp4",
        description: "Visual demonstration of FR, VR, FI, and VI schedules and their effects on behavior.",
        duration: "4:12",
        transcript: "Let's explore how different schedules affect behavior patterns..."
    }
];

// Initialize video explanation system
const videoExplanationSystem = new VideoExplanationSystem();

// Load sample videos
sampleVideoExplanations.forEach(video => {
    videoExplanationSystem.addVideoToQuestion(video.questionId, video);
});

// Integration with main app - override submit answer to add video button
const originalSubmitAnswerForVideo = submitAnswer;
submitAnswer = function() {
    originalSubmitAnswerForVideo();
    
    // After explanation is shown, add video button if available
    const state = appData.quizState;
    const question = state.questions[state.currentIndex];
    
    setTimeout(() => {
        videoExplanationSystem.addVideoButtonToQuestion(question.id);
    }, 100);
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VideoExplanationSystem, videoExplanationSystem };
}

