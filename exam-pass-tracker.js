// Exam Pass Rate Tracking System for ABA Mastery
// Tracks real exam outcomes and calculates app effectiveness

class ExamPassTracker {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUser = null;
        
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
        });
    }

    // Submit exam result
    async submitExamResult(examData) {
        if (!this.currentUser) {
            // Allow anonymous submission with email
            if (!examData.email) {
                throw new Error('Email required for anonymous submission');
            }
        }

        const result = {
            // User info
            userId: this.currentUser?.uid || 'anonymous',
            userEmail: examData.email || this.currentUser?.email,
            userName: examData.name || this.currentUser?.displayName || 'Anonymous',
            
            // Exam info
            examType: examData.examType, // 'BCBA' or 'BCaBA'
            examDate: examData.examDate,
            passed: examData.passed,
            score: examData.score || null, // If they want to share
            attemptNumber: examData.attemptNumber || 1,
            
            // App usage stats
            appUsage: {
                questionsAnswered: examData.questionsAnswered || 0,
                practiceExamsTaken: examData.practiceExamsTaken || 0,
                studyTimeHours: examData.studyTimeHours || 0,
                finalReadinessScore: examData.finalReadinessScore || 0,
                weeksUsedApp: examData.weeksUsedApp || 0
            },
            
            // Feedback
            appRating: examData.appRating || null, // 1-5
            feedback: examData.feedback || '',
            wouldRecommend: examData.wouldRecommend || null,
            
            // Metadata
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            verified: false // Will be verified by email confirmation
        };

        try {
            const resultRef = await this.db.collection('examResults').add(result);
            
            // Send verification email
            await this.sendVerificationEmail(examData.email, resultRef.id);
            
            console.log('✅ Exam result submitted:', resultRef.id);
            return { success: true, resultId: resultRef.id };
        } catch (error) {
            console.error('❌ Error submitting exam result:', error);
            return { success: false, error: error.message };
        }
    }

    // Send verification email
    async sendVerificationEmail(email, resultId) {
        // This would integrate with email service (SendGrid, etc.)
        const verificationLink = `https://aba-mastery-app.web.app/verify-result?id=${resultId}`;
        
        console.log(`📧 Verification email would be sent to ${email}`);
        console.log(`Verification link: ${verificationLink}`);
        
        // Store verification token
        await this.db.collection('examResults').doc(resultId).update({
            verificationToken: this.generateVerificationToken(),
            verificationSent: true
        });
    }

    // Verify exam result
    async verifyResult(resultId, token) {
        try {
            const resultDoc = await this.db.collection('examResults').doc(resultId).get();
            
            if (!resultDoc.exists) {
                return { success: false, error: 'Result not found' };
            }

            const result = resultDoc.data();
            
            if (result.verified) {
                return { success: false, error: 'Already verified' };
            }

            if (result.verificationToken !== token) {
                return { success: false, error: 'Invalid verification token' };
            }

            // Mark as verified
            await this.db.collection('examResults').doc(resultId).update({
                verified: true,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Result verified:', resultId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error verifying result:', error);
            return { success: false, error: error.message };
        }
    }

    // Get aggregated pass rate statistics
    async getPassRateStatistics() {
        try {
            const resultsSnapshot = await this.db
                .collection('examResults')
                .where('verified', '==', true)
                .get();

            const stats = {
                total: 0,
                passed: 0,
                failed: 0,
                passRate: 0,
                byExamType: {
                    BCBA: { total: 0, passed: 0, passRate: 0 },
                    BCaBA: { total: 0, passed: 0, passRate: 0 }
                },
                averageAppUsage: {
                    questionsAnswered: 0,
                    practiceExams: 0,
                    studyHours: 0,
                    readinessScore: 0
                },
                appRating: {
                    average: 0,
                    count: 0,
                    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
            };

            let totalQuestionsAnswered = 0;
            let totalPracticeExams = 0;
            let totalStudyHours = 0;
            let totalReadiness = 0;
            let totalRating = 0;
            let ratingCount = 0;

            resultsSnapshot.forEach(doc => {
                const result = doc.data();
                
                stats.total++;
                if (result.passed) {
                    stats.passed++;
                } else {
                    stats.failed++;
                }

                // By exam type
                if (result.examType === 'BCBA' || result.examType === 'BCaBA') {
                    stats.byExamType[result.examType].total++;
                    if (result.passed) {
                        stats.byExamType[result.examType].passed++;
                    }
                }

                // App usage
                if (result.appUsage) {
                    totalQuestionsAnswered += result.appUsage.questionsAnswered || 0;
                    totalPracticeExams += result.appUsage.practiceExamsTaken || 0;
                    totalStudyHours += result.appUsage.studyTimeHours || 0;
                    totalReadiness += result.appUsage.finalReadinessScore || 0;
                }

                // Rating
                if (result.appRating) {
                    totalRating += result.appRating;
                    ratingCount++;
                    stats.appRating.distribution[result.appRating]++;
                }
            });

            // Calculate averages
            if (stats.total > 0) {
                stats.passRate = Math.round((stats.passed / stats.total) * 100);
                stats.averageAppUsage.questionsAnswered = Math.round(totalQuestionsAnswered / stats.total);
                stats.averageAppUsage.practiceExams = Math.round(totalPracticeExams / stats.total);
                stats.averageAppUsage.studyHours = Math.round(totalStudyHours / stats.total);
                stats.averageAppUsage.readinessScore = Math.round(totalReadiness / stats.total);
            }

            if (ratingCount > 0) {
                stats.appRating.average = (totalRating / ratingCount).toFixed(1);
                stats.appRating.count = ratingCount;
            }

            // Calculate exam type pass rates
            ['BCBA', 'BCaBA'].forEach(type => {
                if (stats.byExamType[type].total > 0) {
                    stats.byExamType[type].passRate = Math.round(
                        (stats.byExamType[type].passed / stats.byExamType[type].total) * 100
                    );
                }
            });

            return stats;
        } catch (error) {
            console.error('❌ Error calculating pass rate:', error);
            return null;
        }
    }

    // Display pass rate dashboard
    async displayPassRateDashboard() {
        const container = document.getElementById('pass-rate-dashboard');
        if (!container) return;

        try {
            const stats = await this.getPassRateStatistics();
            if (!stats) {
                this.displayNoDataYet(container);
                return;
            }

            // If no results yet, show placeholder
            if (stats.total === 0) {
                this.displayNoDataYet(container);
                return;
            }

            // Display actual stats
            this.displayActualStats(container, stats);
        } catch (error) {
            console.error('Error loading pass rates:', error);
            this.displayNoDataYet(container);
        }
    }

    // Display "no data yet" state
    displayNoDataYet(container) {
        if (!container) return;

        container.innerHTML = `
            <div class="pass-rate-intro">
                <h2>🎓 Real Exam Success Rates</h2>
                <p>Help us build transparency by sharing your exam results!</p>
            </div>

            <div class="no-data-state">
                <div class="no-data-icon">📊</div>
                <h3>No Exam Results Yet</h3>
                <p>ABA Mastery is a new platform, and we're building our success rate database.</p>
                <p style="margin-top: 16px;"><strong>Be among the first to help!</strong></p>
                
                <div class="placeholder-stats">
                    <h4>What We're Tracking:</h4>
                    <div class="tracking-grid">
                        <div class="tracking-item">
                            <span class="tracking-icon">✅</span>
                            <span>Pass/Fail Results</span>
                        </div>
                        <div class="tracking-item">
                            <span class="tracking-icon">📊</span>
                            <span>App Usage Patterns</span>
                        </div>
                        <div class="tracking-item">
                            <span class="tracking-icon">🎯</span>
                            <span>Questions Completed</span>
                        </div>
                        <div class="tracking-item">
                            <span class="tracking-icon">⭐</span>
                            <span>User Satisfaction</span>
                        </div>
                    </div>
                </div>

                <div class="cta-section">
                    <h4>Took Your Exam? Share Your Results!</h4>
                    <p>Your submission helps future students understand what works.</p>
                    <button class="btn btn-primary" onclick="examPassTracker.showSubmitResultModal()">
                        📝 Submit Your Exam Result
                    </button>
                </div>

                <div class="coming-soon-note">
                    <p><strong>Coming Soon:</strong> Real-time pass rate statistics from verified users</p>
                    <p>Check back after the first exam results are submitted!</p>
                </div>
            </div>
        `;
    }

    // Display actual statistics
    displayActualStats(container, stats) {
        container.innerHTML = `
            <div class="pass-rate-header">
                <h2>Real Exam Success Rates</h2>
                <p>Based on ${stats.total} verified exam results from ABA Mastery users</p>
            </div>

            <div class="pass-rate-grid">
                <div class="pass-rate-card overall">
                    <div class="pass-rate-score ${stats.passRate >= 90 ? 'excellent' : stats.passRate >= 80 ? 'good' : 'fair'}">
                        ${stats.passRate}%
                    </div>
                    <h3>Overall Pass Rate</h3>
                    <p>${stats.passed} passed • ${stats.failed} failed</p>
                </div>

                <div class="pass-rate-card">
                    <div class="pass-rate-score ${stats.byExamType.BCBA.passRate >= 90 ? 'excellent' : 'good'}">
                        ${stats.byExamType.BCBA.passRate}%
                    </div>
                    <h3>BCBA Exam</h3>
                    <p>${stats.byExamType.BCBA.passed}/${stats.byExamType.BCBA.total} passed</p>
                </div>

                <div class="pass-rate-card">
                    <div class="pass-rate-score ${stats.byExamType.BCaBA.passRate >= 90 ? 'excellent' : 'good'}">
                        ${stats.byExamType.BCaBA.passRate}%
                    </div>
                    <h3>BCaBA Exam</h3>
                    <p>${stats.byExamType.BCaBA.passed}/${stats.byExamType.BCaBA.total} passed</p>
                </div>
            </div>

            <div class="app-usage-section">
                <h3>Average App Usage Among Successful Candidates</h3>
                <div class="usage-stats">
                    <div class="usage-stat">
                        <span class="usage-value">${stats.averageAppUsage.questionsAnswered}</span>
                        <span class="usage-label">Questions Answered</span>
                    </div>
                    <div class="usage-stat">
                        <span class="usage-value">${stats.averageAppUsage.practiceExams}</span>
                        <span class="usage-label">Practice Exams Taken</span>
                    </div>
                    <div class="usage-stat">
                        <span class="usage-value">${stats.averageAppUsage.studyHours}h</span>
                        <span class="usage-label">Study Time</span>
                    </div>
                    <div class="usage-stat">
                        <span class="usage-value">${stats.averageAppUsage.readinessScore}%</span>
                        <span class="usage-label">Final Readiness Score</span>
                    </div>
                </div>
            </div>

            <div class="rating-section">
                <h3>User Satisfaction</h3>
                <div class="rating-display">
                    <span class="star-rating">${'⭐'.repeat(Math.round(parseFloat(stats.appRating.average)))}</span>
                    <span class="rating-value">${stats.appRating.average}/5.0</span>
                    <span class="rating-count">(${stats.appRating.count} ratings)</span>
                </div>
            </div>

            <div class="submit-result-cta">
                <h3>Took Your Exam?</h3>
                <p>Help future students by sharing your result!</p>
                <button class="btn btn-primary" onclick="examPassTracker.showSubmitResultModal()">Submit Your Result</button>
            </div>
        `;
    }

    // Show submit result modal
    showSubmitResultModal() {
        // This would show a modal with form for submitting exam results
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Submit Your Exam Result</h2>
                <form id="submit-result-form">
                    <div class="form-group">
                        <label>Exam Type</label>
                        <select name="examType" required>
                            <option value="">Select...</option>
                            <option value="BCBA">BCBA</option>
                            <option value="BCaBA">BCaBA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Result</label>
                        <select name="passed" required>
                            <option value="">Select...</option>
                            <option value="true">Passed ✓</option>
                            <option value="false">Did not pass</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Email (for verification)</label>
                        <input type="email" name="email" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Generate verification token
    generateVerificationToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
}

// Initialize exam pass tracker
const examPassTracker = new ExamPassTracker();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExamPassTracker, examPassTracker };
}

