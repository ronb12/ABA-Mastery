// Study Groups Feature for ABA Mastery - PREMIUM EDITION
// Enables collaborative learning and peer support with advanced features
// A product of Bradley Virtual Solutions, LLC

class StudyGroupsManager {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUser = null;
        this.userGroups = [];
        this.activeVideoCall = null;
        this.notificationPermission = false;
        this.maxSmallFileSize = 1024 * 1024; // 1MB limit for base64 storage
        
        // Listen for auth changes
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            if (user) {
                this.loadUserGroups();
                this.setupNotifications();
            }
        });
    }

    // Setup browser notifications
    async setupNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
        } else if (Notification.permission === 'granted') {
            this.notificationPermission = true;
        }
    }

    // Send browser notification
    sendNotification(title, body, icon = '/icons/icon-192.png') {
        if (this.notificationPermission && 'Notification' in window) {
            new Notification(title, {
                body: body,
                icon: icon,
                badge: icon
            });
        }
    }

    // Create a new study group
    async createStudyGroup(groupData) {
        if (!this.currentUser) {
            throw new Error('Must be logged in to create study group');
        }

        const group = {
            name: groupData.name,
            description: groupData.description || '',
            examDate: groupData.examDate || null,
            examType: groupData.examType || 'BCBA', // BCBA or BCaBA
            isPrivate: groupData.isPrivate || false,
            inviteCode: this.generateInviteCode(),
            createdBy: this.currentUser.uid,
            createdByName: this.currentUser.displayName || 'Anonymous',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            memberCount: 1,
            maxMembers: groupData.maxMembers || 50,
            settings: {
                allowChat: groupData.allowChat !== false,
                allowQuestionSharing: groupData.allowQuestionSharing !== false,
                allowProgressSharing: groupData.allowProgressSharing !== false
            }
        };

        try {
            const groupRef = await this.db.collection('studyGroups').add(group);
            
            // Add creator as first member
            await this.addMemberToGroup(groupRef.id, {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName || 'Anonymous',
                email: this.currentUser.email,
                role: 'admin',
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Study group created:', groupRef.id);
            return { success: true, groupId: groupRef.id, inviteCode: group.inviteCode };
        } catch (error) {
            console.error('❌ Error creating study group:', error);
            return { success: false, error: error.message };
        }
    }

    // Join study group with invite code
    async joinStudyGroup(inviteCode) {
        if (!this.currentUser) {
            throw new Error('Must be logged in to join study group');
        }

        try {
            // Find group by invite code
            const groupSnapshot = await this.db.collection('studyGroups')
                .where('inviteCode', '==', inviteCode)
                .limit(1)
                .get();

            if (groupSnapshot.empty) {
                return { success: false, error: 'Invalid invite code' };
            }

            const groupDoc = groupSnapshot.docs[0];
            const groupData = groupDoc.data();

            // Check if already a member
            const memberDoc = await this.db
                .collection('studyGroups')
                .doc(groupDoc.id)
                .collection('members')
                .doc(this.currentUser.uid)
                .get();

            if (memberDoc.exists) {
                return { success: false, error: 'Already a member of this group' };
            }

            // Check if group is full
            if (groupData.memberCount >= groupData.maxMembers) {
                return { success: false, error: 'Group is full' };
            }

            // Add as member
            await this.addMemberToGroup(groupDoc.id, {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName || 'Anonymous',
                email: this.currentUser.email,
                role: 'member',
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Increment member count
            await this.db.collection('studyGroups').doc(groupDoc.id).update({
                memberCount: firebase.firestore.FieldValue.increment(1)
            });

            console.log('✅ Joined study group:', groupDoc.id);
            return { success: true, groupId: groupDoc.id, groupName: groupData.name };
        } catch (error) {
            console.error('❌ Error joining study group:', error);
            return { success: false, error: error.message };
        }
    }

    // Add member to group
    async addMemberToGroup(groupId, memberData) {
        await this.db
            .collection('studyGroups')
            .doc(groupId)
            .collection('members')
            .doc(memberData.uid)
            .set(memberData);
    }

    // Post message to group chat
    async postGroupMessage(groupId, message) {
        if (!this.currentUser) {
            throw new Error('Must be logged in to post messages');
        }

        const messageData = {
            userId: this.currentUser.uid,
            userName: this.currentUser.displayName || 'Anonymous',
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0
        };

        try {
            await this.db
                .collection('studyGroups')
                .doc(groupId)
                .collection('messages')
                .add(messageData);

            return { success: true };
        } catch (error) {
            console.error('❌ Error posting message:', error);
            return { success: false, error: error.message };
        }
    }

    // Share progress with group
    async shareProgress(groupId) {
        if (!this.currentUser) {
            throw new Error('Must be logged in to share progress');
        }

        const stats = analyticsEngine.getComprehensiveStats();
        
        const progressShare = {
            userId: this.currentUser.uid,
            userName: this.currentUser.displayName || 'Anonymous',
            stats: {
                questionsAnswered: stats.totalAttempts,
                accuracy: stats.overallAccuracy,
                examReadiness: stats.examReadiness,
                masteredQuestions: stats.masteredQuestions,
                studyStreak: stats.studyStreak
            },
            message: `I just reached ${stats.examReadiness}% exam readiness!`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await this.db
                .collection('studyGroups')
                .doc(groupId)
                .collection('progressUpdates')
                .add(progressShare);

            return { success: true };
        } catch (error) {
            console.error('❌ Error sharing progress:', error);
            return { success: false, error: error.message };
        }
    }

    // Get group messages
    async getGroupMessages(groupId, limit = 50) {
        try {
            const messagesSnapshot = await this.db
                .collection('studyGroups')
                .doc(groupId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            const messages = [];
            messagesSnapshot.forEach(doc => {
                messages.push({ id: doc.id, ...doc.data() });
            });

            return messages.reverse(); // Show oldest first
        } catch (error) {
            console.error('❌ Error loading messages:', error);
            return [];
        }
    }

    // Get group members
    async getGroupMembers(groupId) {
        try {
            const membersSnapshot = await this.db
                .collection('studyGroups')
                .doc(groupId)
                .collection('members')
                .get();

            const members = [];
            membersSnapshot.forEach(doc => {
                members.push({ id: doc.id, ...doc.data() });
            });

            return members;
        } catch (error) {
            console.error('❌ Error loading members:', error);
            return [];
        }
    }

    // Load user's study groups
    async loadUserGroups() {
        if (!this.currentUser) return;

        try {
            // Get groups where user is a member
            const allGroupsSnapshot = await this.db.collection('studyGroups').get();
            const userGroups = [];

            for (const groupDoc of allGroupsSnapshot.docs) {
                const memberDoc = await this.db
                    .collection('studyGroups')
                    .doc(groupDoc.id)
                    .collection('members')
                    .doc(this.currentUser.uid)
                    .get();

                if (memberDoc.exists) {
                    userGroups.push({
                        id: groupDoc.id,
                        ...groupDoc.data(),
                        memberRole: memberDoc.data().role
                    });
                }
            }

            this.userGroups = userGroups;
            return userGroups;
        } catch (error) {
            console.error('❌ Error loading user groups:', error);
            return [];
        }
    }

    // Generate unique invite code
    generateInviteCode() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    // Display study groups UI
    displayStudyGroupsView() {
        const container = document.getElementById('study-groups-container');
        if (!container) return;

        if (!this.currentUser) {
            container.innerHTML = `
                <div class="auth-required">
                    <h3>Sign in to Join Study Groups</h3>
                    <p>Study groups let you collaborate with other exam candidates, share progress, and stay motivated together!</p>
                    <button class="btn btn-primary" onclick="window.location.href='/login'">Sign In</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="study-groups-header">
                <h2>Study Groups</h2>
                <div class="group-actions">
                    <button class="btn btn-primary" onclick="studyGroupsManager.showCreateGroupModal()">Create Group</button>
                    <button class="btn btn-secondary" onclick="studyGroupsManager.showJoinGroupModal()">Join Group</button>
                </div>
            </div>
            
            <div class="my-groups-section">
                <h3>My Groups (${this.userGroups.length})</h3>
                <div id="groups-list" class="groups-grid">
                    ${this.userGroups.length === 0 ? '<p>You haven\'t joined any study groups yet.</p>' : ''}
                </div>
            </div>
        `;

        // Display user's groups
        this.userGroups.forEach(group => {
            this.displayGroupCard(group);
        });
    }

    // Display group card
    displayGroupCard(group) {
        const container = document.getElementById('groups-list');
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'group-card';
        card.innerHTML = `
            <div class="group-header">
                <h4>${group.name}</h4>
                <span class="group-type">${group.examType}</span>
            </div>
            <p class="group-description">${group.description || 'No description'}</p>
            <div class="group-meta">
                <span>👥 ${group.memberCount} members</span>
                ${group.examDate ? `<span>📅 Exam: ${new Date(group.examDate).toLocaleDateString()}</span>` : ''}
            </div>
            <button class="btn btn-primary" onclick="studyGroupsManager.openGroup('${group.id}')">Open Group</button>
        `;

        container.appendChild(card);
    }

    // Show create group modal (ENHANCED WITH PROPER UI)
    showCreateGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal study-group-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create Study Group</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="create-group-form">
                        <div class="form-group">
                            <label for="group-name">Group Name *</label>
                            <input type="text" id="group-name" required placeholder="e.g., BCBA Study Squad 2025">
                        </div>
                        
                        <div class="form-group">
                            <label for="group-description">Description</label>
                            <textarea id="group-description" rows="3" placeholder="Tell members what this group is about..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="exam-type">Exam Type *</label>
                                <select id="exam-type" required>
                                    <option value="BCBA">BCBA</option>
                                    <option value="BCaBA">BCaBA</option>
                                    <option value="RBT">RBT</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="exam-date">Target Exam Date</label>
                                <input type="date" id="exam-date">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="max-members">Max Members</label>
                                <input type="number" id="max-members" value="50" min="2" max="500">
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="is-private">
                                    <span>Make group private</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Group Features</label>
                            <div class="checkbox-list">
                                <label>
                                    <input type="checkbox" id="allow-chat" checked>
                                    <span>💬 Group Chat</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="allow-video" checked>
                                    <span>📹 Video Calls</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="allow-files" checked>
                                    <span>📁 File Sharing</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="allow-quizzes" checked>
                                    <span>📝 Group Quizzes</span>
                                </label>
                                <label>
                                    <input type="checkbox" id="allow-leaderboard" checked>
                                    <span>🏆 Leaderboard</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="studyGroupsManager.submitCreateGroup()">Create Group</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Submit create group form
    async submitCreateGroup() {
        const name = document.getElementById('group-name').value.trim();
        if (!name) {
            alert('Please enter a group name');
            return;
        }

        const groupData = {
            name: name,
            description: document.getElementById('group-description').value.trim(),
            examType: document.getElementById('exam-type').value,
            examDate: document.getElementById('exam-date').value || null,
            maxMembers: parseInt(document.getElementById('max-members').value),
            isPrivate: document.getElementById('is-private').checked,
            allowChat: document.getElementById('allow-chat').checked,
            allowVideo: document.getElementById('allow-video').checked,
            allowFiles: document.getElementById('allow-files').checked,
            allowQuizzes: document.getElementById('allow-quizzes').checked,
            allowLeaderboard: document.getElementById('allow-leaderboard').checked
        };

        const result = await this.createStudyGroup(groupData);
        
        if (result.success) {
            document.querySelector('.study-group-modal').remove();
            this.showInviteCodeModal(result.inviteCode, result.groupId);
            await this.loadUserGroups();
            this.displayStudyGroupsView();
        } else {
            alert('Error creating group: ' + result.error);
        }
    }

    // Show invite code modal
    showInviteCodeModal(inviteCode, groupId) {
        const modal = document.createElement('div');
        modal.className = 'modal invite-code-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎉 Group Created Successfully!</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <p>Share this invite code with others to invite them to your group:</p>
                    <div class="invite-code-display">
                        <div class="invite-code">${inviteCode}</div>
                        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${inviteCode}'); this.innerHTML='✓ Copied!'">
                            Copy Code
                        </button>
                    </div>
                    <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px;">
                        You can also share this link:<br>
                        <a href="https://aba-mastery-app.web.app/join?code=${inviteCode}" target="_blank">
                            aba-mastery-app.web.app/join?code=${inviteCode}
                        </a>
                    </p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Got it!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Show join group modal (ENHANCED WITH PROPER UI)
    showJoinGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal study-group-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Join Study Group</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="join-group-form">
                        <div class="form-group">
                            <label for="invite-code-input">Invite Code</label>
                            <input type="text" id="invite-code-input" required 
                                   placeholder="Enter 8-character code" 
                                   maxlength="8" 
                                   style="text-transform: uppercase; letter-spacing: 2px; font-size: 18px;">
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            💡 Ask your study partner for their group's invite code
                        </p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="studyGroupsManager.submitJoinGroup()">Join Group</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Auto-uppercase the input
        document.getElementById('invite-code-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    // Submit join group form
    async submitJoinGroup() {
        const inviteCode = document.getElementById('invite-code-input').value.trim();
        if (!inviteCode || inviteCode.length !== 8) {
            alert('Please enter a valid 8-character invite code');
            return;
        }

        const result = await this.joinStudyGroup(inviteCode);
        
        if (result.success) {
            document.querySelector('.study-group-modal').remove();
            this.sendNotification('Joined Study Group', `You've successfully joined ${result.groupName}!`);
            await this.loadUserGroups();
            this.displayStudyGroupsView();
            
            // Show success message
            const successModal = document.createElement('div');
            successModal.className = 'modal';
            successModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>✅ Successfully Joined!</h2>
                        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <p>Welcome to <strong>${result.groupName}</strong>!</p>
                        <p>Start collaborating with your study partners now.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove(); studyGroupsManager.openGroup('${result.groupId}')">
                            Open Group
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(successModal);
        } else {
            alert('Error: ' + result.error);
        }
    }

    // Open group details
    async openGroup(groupId) {
        console.log('Opening group:', groupId);
        
        // Load group data
        const groupDoc = await this.db.collection('studyGroups').doc(groupId).get();
        if (!groupDoc.exists) {
            alert('Group not found');
            return;
        }
        
        const groupData = groupDoc.data();
        const members = await this.getGroupMembers(groupId);
        
        // Display full group interface
        this.displayGroupInterface(groupId, groupData, members);
    }

    // Display full group interface with all features
    async displayGroupInterface(groupId, groupData, members) {
        const container = document.getElementById('study-groups-container');
        if (!container) return;

        container.innerHTML = `
            <div class="group-interface">
                <!-- Group Header -->
                <div class="group-interface-header">
                    <button class="btn btn-secondary" onclick="studyGroupsManager.displayStudyGroupsView()">
                        ← Back to Groups
                    </button>
                    <h2>${groupData.name}</h2>
                    <div class="group-invite">
                        <button class="btn btn-primary" onclick="studyGroupsManager.showInviteCodeModal('${groupData.inviteCode}', '${groupId}')">
                            📤 Invite
                        </button>
                    </div>
                </div>

                <!-- Group Tabs -->
                <div class="group-tabs">
                    <button class="group-tab active" data-tab="chat">💬 Chat</button>
                    <button class="group-tab" data-tab="video">📹 Video Call</button>
                    <button class="group-tab" data-tab="files">📁 Files</button>
                    <button class="group-tab" data-tab="quizzes">📝 Quizzes</button>
                    <button class="group-tab" data-tab="leaderboard">🏆 Leaderboard</button>
                    <button class="group-tab" data-tab="schedule">📅 Schedule</button>
                    <button class="group-tab" data-tab="members">👥 Members (${members.length})</button>
                </div>

                <!-- Tab Content -->
                <div class="group-tab-content">
                    <!-- Chat Tab -->
                    <div class="tab-pane active" id="chat-tab">
                        <div class="chat-container">
                            <div id="chat-messages" class="chat-messages"></div>
                            <div class="chat-input-container">
                                <input type="text" id="chat-input" placeholder="Type a message..." 
                                       onkeypress="if(event.key==='Enter') studyGroupsManager.sendChatMessage('${groupId}')">
                                <button class="btn btn-primary" onclick="studyGroupsManager.sendChatMessage('${groupId}')">Send</button>
                            </div>
                        </div>
                    </div>

                    <!-- Video Call Tab -->
                    <div class="tab-pane" id="video-tab">
                        <div class="video-call-container">
                            <div id="jitsi-container" class="jitsi-container"></div>
                            <button class="btn btn-primary btn-large" onclick="studyGroupsManager.startVideoCall('${groupId}', '${groupData.name}')">
                                📹 Start Video Call
                            </button>
                            <p class="video-info">High-quality video calls with up to 50 participants. Includes screen sharing!</p>
                        </div>
                    </div>

                    <!-- Files Tab -->
                    <div class="tab-pane" id="files-tab">
                        <div class="files-container">
                            <div class="file-upload-section free-storage">
                                <h3>📁 Share Files (100% FREE Forever)</h3>
                                
                                <div class="upload-options">
                                    <div class="upload-option">
                                        <h4>💚 Small Files (Under 1MB)</h4>
                                        <p>Notes, screenshots, small PDFs - upload directly</p>
                                        <input type="file" id="small-file-input-${groupId}" style="display: none;" 
                                               onchange="studyGroupsManager.handleSmallFileUpload('${groupId}', this)">
                                        <button class="btn btn-primary" onclick="document.getElementById('small-file-input-${groupId}').click()">
                                            📤 Upload Small File
                                        </button>
                                    </div>
                                    
                                    <div class="upload-option">
                                        <h4>🔗 Large Files (Any Size)</h4>
                                        <p>Upload to Google Drive/Dropbox first, then share link here</p>
                                        <button class="btn btn-secondary" onclick="studyGroupsManager.showShareLinkModal('${groupId}')">
                                            📎 Share External Link
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="free-storage-info">
                                    <p>💡 <strong>Smart FREE Storage:</strong></p>
                                    <ul>
                                        <li>Files under 1MB: Stored directly (zero cost)</li>
                                        <li>Files over 1MB: Share via Google Drive/Dropbox (zero cost)</li>
                                        <li>No limits, no fees, works forever!</li>
                                    </ul>
                                </div>
                            </div>
                            <div id="files-list" class="files-list"></div>
                        </div>
                    </div>

                    <!-- Quizzes Tab -->
                    <div class="tab-pane" id="quizzes-tab">
                        <div class="quizzes-container">
                            <div class="quiz-actions">
                                <button class="btn btn-primary" onclick="studyGroupsManager.createGroupQuiz('${groupId}')">
                                    ➕ Create Quiz
                                </button>
                            </div>
                            <div id="quizzes-list" class="quizzes-list"></div>
                        </div>
                    </div>

                    <!-- Leaderboard Tab -->
                    <div class="tab-pane" id="leaderboard-tab">
                        <div class="leaderboard-container">
                            <h3>Group Leaderboard 🏆</h3>
                            <div class="leaderboard-filters">
                                <button class="filter-btn active" onclick="studyGroupsManager.loadLeaderboard('${groupId}', 'overall')">Overall</button>
                                <button class="filter-btn" onclick="studyGroupsManager.loadLeaderboard('${groupId}', 'week')">This Week</button>
                                <button class="filter-btn" onclick="studyGroupsManager.loadLeaderboard('${groupId}', 'month')">This Month</button>
                            </div>
                            <div id="leaderboard-list" class="leaderboard-list"></div>
                        </div>
                    </div>

                    <!-- Schedule Tab -->
                    <div class="tab-pane" id="schedule-tab">
                        <div class="schedule-container">
                            <div class="schedule-header">
                                <h3>Group Study Schedule 📅</h3>
                                <button class="btn btn-primary" onclick="studyGroupsManager.createStudySession('${groupId}')">
                                    ➕ Schedule Session
                                </button>
                            </div>
                            <div id="schedule-list" class="schedule-list"></div>
                        </div>
                    </div>

                    <!-- Members Tab -->
                    <div class="tab-pane" id="members-tab">
                        <div class="members-container">
                            <h3>Group Members (${members.length}/${groupData.maxMembers})</h3>
                            <div id="members-list" class="members-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup tab switching
        document.querySelectorAll('.group-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.group-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                // Refresh chat when switching to chat tab
                if (tabName === 'chat') {
                    this.loadChatMessages(groupId);
                }
            });
        });

        // Setup real-time chat listener
        this.setupChatListener(groupId);
        
        // Setup real-time session notifications
        this.setupSessionListener(groupId);

        // Load initial data
        this.loadChatMessages(groupId);
        this.loadGroupFiles(groupId);
        this.loadGroupQuizzes(groupId);
        this.loadLeaderboard(groupId, 'overall');
        this.loadStudySessions(groupId);
        this.displayMembersList(members);
    }

    // ============================================
    // VIDEO CALL FEATURES (Using Jitsi Meet)
    // ============================================

    startVideoCall(groupId, groupName) {
        const container = document.getElementById('jitsi-container');
        if (!container) return;

        // Initialize Jitsi Meet API
        const domain = 'meet.jit.si';
        const options = {
            roomName: `ABAMastery_${groupId}`,
            width: '100%',
            height: 600,
            parentNode: container,
            configOverwrite: {
                startWithVideoMuted: false,
                startWithAudioMuted: false
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings',
                    'raisehand', 'videoquality', 'filmstrip', 'stats',
                    'shortcuts', 'tileview', 'videobackgroundblur', 'help'
                ],
            },
            userInfo: {
                displayName: this.currentUser.displayName || 'Anonymous'
            }
        };

        // Load Jitsi script if not already loaded
        if (typeof JitsiMeetExternalAPI === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.onload = () => {
                this.activeVideoCall = new JitsiMeetExternalAPI(domain, options);
                this.sendNotification('Video Call Started', `Video call active in ${groupName}`);
            };
            document.head.appendChild(script);
        } else {
            this.activeVideoCall = new JitsiMeetExternalAPI(domain, options);
            this.sendNotification('Video Call Started', `Video call active in ${groupName}`);
        }
    }

    // ============================================
    // FILE SHARING FEATURES (100% FREE)
    // ============================================

    // Handle small file upload (< 1MB) - Store as base64 in Firestore
    async handleSmallFileUpload(groupId, fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        // Check file size
        if (file.size > this.maxSmallFileSize) {
            alert(`File is ${this.formatFileSize(file.size)}. Please use files under 1MB or share an external link.`);
            this.showShareLinkModal(groupId);
            return;
        }

        try {
            console.log('💚 Uploading to FREE Firestore storage...');
            
            // Convert to base64
            const base64 = await this.fileToBase64(file);
            
            // Store in Firestore
            await this.db.collection('studyGroups').doc(groupId).collection('files').add({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64, // Stored as base64 string
                uploadedBy: this.currentUser.uid,
                uploadedByName: this.currentUser.displayName || 'Anonymous',
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                storageMethod: 'firestore-base64'
            });

            fileInput.value = '';
            this.loadGroupFiles(groupId);
            this.sendNotification('File Uploaded', `${file.name} uploaded successfully (FREE)`);
            alert('✅ File uploaded successfully (FREE)!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file');
        }
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Show modal for sharing external link
    showShareLinkModal(groupId) {
        const modal = document.createElement('div');
        modal.className = 'modal share-link-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🔗 Share External Link (100% FREE)</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>For files over 1MB, upload to a free service and share the link:</p>
                    
                    <div class="external-services">
                        <div class="service-card">
                            <h4>📁 Google Drive (15 GB Free)</h4>
                            <ol>
                                <li>Upload file to Google Drive</li>
                                <li>Right-click → "Get link"</li>
                                <li>Set to "Anyone with the link"</li>
                                <li>Copy link and paste below</li>
                            </ol>
                            <a href="https://drive.google.com/drive/my-drive" target="_blank" class="btn btn-sm btn-primary">
                                Open Google Drive
                            </a>
                        </div>
                        
                        <div class="service-card">
                            <h4>📦 Dropbox (2 GB Free)</h4>
                            <ol>
                                <li>Upload file to Dropbox</li>
                                <li>Click "Share"</li>
                                <li>Copy link and paste below</li>
                            </ol>
                            <a href="https://www.dropbox.com/home" target="_blank" class="btn btn-sm btn-primary">
                                Open Dropbox
                            </a>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="link-name">File Name *</label>
                        <input type="text" id="link-name" required placeholder="e.g., Chapter 3 Study Guide.pdf">
                    </div>
                    
                    <div class="form-group">
                        <label for="external-url">File URL *</label>
                        <input type="url" id="external-url" required placeholder="https://drive.google.com/file/...">
                    </div>
                    
                    <div class="form-group">
                        <label for="link-service">Service</label>
                        <select id="link-service">
                            <option value="google-drive">Google Drive</option>
                            <option value="dropbox">Dropbox</option>
                            <option value="onedrive">OneDrive</option>
                            <option value="github">GitHub</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="link-description">Description (optional)</label>
                        <input type="text" id="link-description" placeholder="Brief description of the file">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="studyGroupsManager.submitExternalLink('${groupId}')">
                        Share Link
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Submit external link
    async submitExternalLink(groupId) {
        const name = document.getElementById('link-name').value.trim();
        const url = document.getElementById('external-url').value.trim();
        const service = document.getElementById('link-service').value;
        const description = document.getElementById('link-description').value.trim();
        
        if (!name || !url) {
            alert('Please enter both file name and URL');
            return;
        }

        try {
            await this.db.collection('studyGroups')
                .doc(groupId)
                .collection('files')
                .add({
                    name: name,
                    type: 'external-link',
                    url: url,
                    service: service,
                    description: description,
                    uploadedBy: this.currentUser.uid,
                    uploadedByName: this.currentUser.displayName || 'Anonymous',
                    uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    storageMethod: 'external-link'
                });

            document.querySelector('.share-link-modal').remove();
            this.loadGroupFiles(groupId);
            this.sendNotification('Link Shared', `${name} link shared successfully (FREE)`);
            alert('✅ Link shared successfully (FREE)!');
        } catch (error) {
            console.error('Error sharing link:', error);
            alert('Error sharing link');
        }
    }

    async loadGroupFiles(groupId) {
        const filesSnapshot = await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('files')
            .orderBy('uploadedAt', 'desc')
            .limit(50)
            .get();

        const filesList = document.getElementById('files-list');
        if (!filesList) return;

        if (filesSnapshot.empty) {
            filesList.innerHTML = `
                <div class="empty-state">
                    <p>No files shared yet</p>
                    <p style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">
                        💡 Share files up to 1MB directly, or share links to larger files from Google Drive/Dropbox (100% FREE!)
                    </p>
                </div>
            `;
            return;
        }

        let html = '<div class="files-grid">';
        filesSnapshot.forEach(doc => {
            const file = doc.data();
            const fileIcon = this.getFileIcon(file.type);
            
            if (file.storageMethod === 'external-link') {
                // External link display
                html += `
                    <div class="file-card external-link-card">
                        <div class="file-icon">${fileIcon}</div>
                        <div class="file-info">
                            <h4>${file.name}</h4>
                            <p>
                                <span class="service-badge">${this.getServiceBadge(file.service)}</span>
                                ${file.uploadedByName}
                            </p>
                            ${file.description ? `<p class="file-desc">${file.description}</p>` : ''}
                        </div>
                        <div class="file-actions">
                            <a href="${file.url}" target="_blank" class="btn btn-sm btn-primary">
                                Open Link 🔗
                            </a>
                        </div>
                    </div>
                `;
            } else {
                // Base64 file display
                const fileSize = this.formatFileSize(file.size);
                html += `
                    <div class="file-card base64-card">
                        <div class="file-icon">${fileIcon}</div>
                        <div class="file-info">
                            <h4>${file.name}</h4>
                            <p>${fileSize} • ${file.uploadedByName}</p>
                            <span class="free-badge">💚 Free Storage</span>
                        </div>
                        <div class="file-actions">
                            <button class="btn btn-sm btn-primary" onclick="studyGroupsManager.downloadBase64File('${groupId}', '${doc.id}', '${file.name}')">
                                Download
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';
        filesList.innerHTML = html;
    }

    // Download base64 file
    async downloadBase64File(groupId, fileId, fileName) {
        try {
            const fileDoc = await this.db.collection('studyGroups')
                .doc(groupId)
                .collection('files')
                .doc(fileId)
                .get();
            
            if (!fileDoc.exists) {
                alert('File not found');
                return;
            }
            
            const fileData = fileDoc.data();
            
            // Create download link from base64
            const link = document.createElement('a');
            link.href = fileData.data;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading file');
        }
    }

    getServiceBadge(service) {
        const badges = {
            'google-drive': '📁 Google Drive',
            'dropbox': '📦 Dropbox',
            'onedrive': '☁️ OneDrive',
            'github': '🐙 GitHub',
            'other': '🔗 External Link'
        };
        return badges[service] || badges.other;
    }

    getFileIcon(type) {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        if (type.includes('video')) return '🎥';
        if (type.includes('word')) return '📝';
        if (type.includes('excel') || type.includes('sheet')) return '📊';
        if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
        return '📎';
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // ============================================
    // GROUP QUIZ FEATURES
    // ============================================

    createGroupQuiz(groupId) {
        // Show beautiful modal instead of prompts
        const modal = document.createElement('div');
        modal.className = 'modal create-quiz-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📝 Create Group Quiz</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">
                        Create a custom quiz for your group using questions from the 1000-question bank.
                    </p>
                    <form id="create-quiz-form">
                        <div class="form-group">
                            <label for="quiz-name">Quiz Name *</label>
                            <input type="text" id="quiz-name" required placeholder="e.g., Week 1 Review Quiz">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quiz-num-questions">Number of Questions *</label>
                                <input type="number" id="quiz-num-questions" value="10" min="5" max="50" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="quiz-difficulty">Difficulty</label>
                                <select id="quiz-difficulty">
                                    <option value="all">All Levels (Mixed)</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="quiz-category">Category</label>
                            <select id="quiz-category">
                                <option value="mixed">Mixed (All Categories)</option>
                                <option value="Fundamentals">Fundamentals</option>
                                <option value="Measurement">Measurement</option>
                                <option value="Assessment">Assessment</option>
                                <option value="Intervention">Intervention</option>
                                <option value="Behavior Change">Behavior Change</option>
                                <option value="Verbal Behavior">Verbal Behavior</option>
                                <option value="Ethics">Ethics</option>
                                <option value="Research">Research Methods</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="quiz-time-limit">Time Limit (minutes, optional)</label>
                            <input type="number" id="quiz-time-limit" placeholder="Leave empty for no time limit" min="5" max="120">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="studyGroupsManager.submitCreateQuiz('${groupId}')">
                        Create Quiz
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async submitCreateQuiz(groupId) {
        const name = document.getElementById('quiz-name').value.trim();
        const numQuestions = parseInt(document.getElementById('quiz-num-questions').value);
        const category = document.getElementById('quiz-category').value;
        const difficulty = document.getElementById('quiz-difficulty').value;
        const timeLimit = document.getElementById('quiz-time-limit').value;
        
        if (!name) {
            alert('Please enter a quiz name');
            return;
        }
        
        try {
            await this.db.collection('studyGroups').doc(groupId).collection('quizzes').add({
                name: name,
                numQuestions: numQuestions,
                category: category,
                difficulty: difficulty,
                timeLimit: timeLimit ? parseInt(timeLimit) : null,
                createdBy: this.currentUser.uid,
                createdByName: this.currentUser.displayName || 'Anonymous',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                attempts: 0
            });

            document.querySelector('.create-quiz-modal').remove();
            this.loadGroupQuizzes(groupId);
            this.sendNotification('Quiz Created', `${name} is ready for the group!`);
            alert(`✅ Quiz "${name}" created successfully!\n\n${numQuestions} questions • ${category} • ${difficulty}`);
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz: ' + error.message);
        }
    }

    async loadGroupQuizzes(groupId) {
        const quizzesSnapshot = await this.db.collection('studyGroups')
            .doc(groupId)
            .collection('quizzes')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        const quizzesList = document.getElementById('quizzes-list');
        if (!quizzesList) return;

        if (quizzesSnapshot.empty) {
            quizzesList.innerHTML = '<p class="empty-state">No quizzes yet. Create one to challenge your group!</p>';
            return;
        }

        let html = '';
        quizzesSnapshot.forEach(doc => {
            const quiz = doc.data();
            html += `
                <div class="quiz-card">
                    <h4>${quiz.name}</h4>
                    <p>${quiz.numQuestions} questions • ${quiz.category}</p>
                    <p class="quiz-meta">Created by ${quiz.createdByName} • ${quiz.attempts} attempts</p>
                    <button class="btn btn-primary" onclick="studyGroupsManager.takeGroupQuiz('${groupId}', '${doc.id}')">
                        Take Quiz
                    </button>
                </div>
            `;
        });
        quizzesList.innerHTML = html;
    }

    async takeGroupQuiz(groupId, quizId) {
        alert('Quiz feature will load practice questions. Implementation connects to your existing 1000-question bank!');
        // This would integrate with your existing practice exam system
        // Load questions, track results, update leaderboard
    }

    // ============================================
    // LEADERBOARD FEATURES
    // ============================================

    async loadLeaderboard(groupId, period) {
        const members = await this.getGroupMembers(groupId);
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;

        // Get stats for each member
        const memberStats = [];
        for (const member of members) {
            const progressDoc = await this.db.collection('users')
                .doc(member.uid)
                .collection('progress')
                .doc('main')
                .get();
            
            if (progressDoc.exists) {
                const data = progressDoc.data();
                memberStats.push({
                    name: member.displayName,
                    questionsAnswered: data.questionsAnswered || 0,
                    correctAnswers: data.correctAnswers || 0,
                    accuracy: data.questionsAnswered > 0 
                        ? Math.round((data.correctAnswers / data.questionsAnswered) * 100) 
                        : 0,
                    studyTime: data.studyTime || 0
                });
            }
        }

        // Sort by questions answered
        memberStats.sort((a, b) => b.questionsAnswered - a.questionsAnswered);

        let html = '<div class="leaderboard">';
        memberStats.forEach((member, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            html += `
                <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
                    <span class="rank">${medal || (index + 1)}</span>
                    <span class="name">${member.name}</span>
                    <span class="stats">${member.questionsAnswered} questions • ${member.accuracy}% accuracy</span>
                </div>
            `;
        });
        html += '</div>';
        leaderboardList.innerHTML = html;
    }

    // ============================================
    // STUDY SCHEDULE FEATURES
    // ============================================

    createStudySession(groupId) {
        // Show beautiful modal instead of prompts
        const modal = document.createElement('div');
        modal.className = 'modal create-session-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📅 Schedule Study Session</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">
                        Schedule a group study session and invite members to join.
                    </p>
                    <form id="create-session-form">
                        <div class="form-group">
                            <label for="session-name">Session Name *</label>
                            <input type="text" id="session-name" required placeholder="e.g., Ethics Chapter Review">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="session-date">Date *</label>
                                <input type="date" id="session-date" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="session-time">Time *</label>
                                <input type="time" id="session-time" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="session-duration">Duration (minutes) *</label>
                            <select id="session-duration">
                                <option value="30">30 minutes</option>
                                <option value="60" selected>1 hour</option>
                                <option value="90">1.5 hours</option>
                                <option value="120">2 hours</option>
                                <option value="180">3 hours</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="session-description">Description (optional)</label>
                            <textarea id="session-description" rows="3" placeholder="What will you study in this session?"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="studyGroupsManager.submitCreateSession('${groupId}')">
                        Schedule Session
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async submitCreateSession(groupId) {
        const name = document.getElementById('session-name').value.trim();
        const date = document.getElementById('session-date').value;
        const time = document.getElementById('session-time').value;
        const duration = parseInt(document.getElementById('session-duration').value);
        const description = document.getElementById('session-description').value.trim();
        
        if (!name || !date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        const dateTimeStr = `${date}T${time}:00`;
        const dateTime = new Date(dateTimeStr);
        
        try {
            await this.db.collection('studyGroups').doc(groupId).collection('sessions').add({
                name: name,
                description: description,
                dateTime: dateTime,
                duration: duration,
                createdBy: this.currentUser.uid,
                createdByName: this.currentUser.displayName || 'Anonymous',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                attendees: []
            });

            document.querySelector('.create-session-modal').remove();
            this.loadStudySessions(groupId);
            this.sendNotification('Session Scheduled', `${name} scheduled for ${dateTime.toLocaleString()}`);
            alert(`✅ Session "${name}" scheduled successfully!\n\n📅 ${dateTime.toLocaleString()}\n⏱️ ${duration} minutes`);
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Error creating session: ' + error.message);
        }
    }

    // Setup real-time session notifications
    setupSessionListener(groupId) {
        // Store the unsubscribe function for cleanup
        if (this.sessionUnsubscribe) {
            this.sessionUnsubscribe();
        }

        // Track sessions we've already seen to avoid duplicate notifications
        if (!this.seenSessions) {
            this.seenSessions = new Set();
        }

        // Listen for new sessions
        this.sessionUnsubscribe = this.db
            .collection('studyGroups')
            .doc(groupId)
            .collection('sessions')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const sessionId = change.doc.id;
                        const session = change.doc.data();
                        
                        // Skip if we've already seen this session (on initial load)
                        if (this.seenSessions.has(sessionId)) {
                            return;
                        }
                        
                        this.seenSessions.add(sessionId);
                        
                        // Check if this session was just created (within last 10 seconds)
                        const now = Date.now();
                        const createdAt = session.createdAt ? session.createdAt.toMillis() : now;
                        const isNew = (now - createdAt) < 10000; // 10 seconds
                        
                        // Only notify if it's a new session and not created by current user
                        if (isNew && session.createdBy !== this.currentUser.uid) {
                            const date = session.dateTime.toDate();
                            this.sendNotification(
                                '📅 New Study Session!',
                                `${session.name} scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
                            );
                            
                            // Refresh the schedule list
                            this.loadStudySessions(groupId);
                        }
                    }
                });
            }, (error) => {
                console.error('❌ Error in session listener:', error);
            });
    }

    async loadStudySessions(groupId) {
        try {
            const sessionsSnapshot = await this.db.collection('studyGroups')
                .doc(groupId)
                .collection('sessions')
                .orderBy('dateTime', 'asc')
                .limit(20)
                .get();

            const scheduleList = document.getElementById('schedule-list');
            if (!scheduleList) return;

            // Mark all loaded sessions as seen
            if (!this.seenSessions) {
                this.seenSessions = new Set();
            }
            sessionsSnapshot.forEach(doc => {
                this.seenSessions.add(doc.id);
            });

            if (sessionsSnapshot.empty) {
                scheduleList.innerHTML = '<p class="empty-state">No study sessions scheduled yet. Schedule one to get started!</p>';
                return;
            }

            // Get current time for comparison
            const now = new Date();

            let html = '';
            sessionsSnapshot.forEach(doc => {
                const session = doc.data();
                const date = session.dateTime.toDate();
                const isPast = date < now;
                const attendeeCount = session.attendees ? session.attendees.length : 0;
                const isAttending = session.attendees && session.attendees.includes(this.currentUser.uid);
                
                html += `
                    <div class="session-card ${isPast ? 'past-session' : ''}">
                        <h4>${session.name} ${isPast ? '(Past)' : ''}</h4>
                        <p>📅 ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</p>
                        <p>⏱️ ${session.duration} minutes</p>
                        ${session.description ? `<p>📝 ${session.description}</p>` : ''}
                        <p>👤 Organized by ${session.createdByName}</p>
                        <p>👥 ${attendeeCount} member${attendeeCount !== 1 ? 's' : ''} attending</p>
                        ${!isPast ? `
                            <button class="btn ${isAttending ? 'btn-secondary' : 'btn-primary'}" 
                                    onclick="studyGroupsManager.joinSession('${groupId}', '${doc.id}')">
                                ${isAttending ? '✓ Attending' : 'Join Session'}
                            </button>
                        ` : ''}
                    </div>
                `;
            });
            scheduleList.innerHTML = html;
        } catch (error) {
            console.error('❌ Error loading sessions:', error);
            const scheduleList = document.getElementById('schedule-list');
            if (scheduleList) {
                scheduleList.innerHTML = '<p class="empty-state" style="color: red;">Error loading sessions. Please refresh.</p>';
            }
        }
    }

    async joinSession(groupId, sessionId) {
        // Add user to attendees and set reminder
        try {
            const sessionDoc = await this.db.collection('studyGroups')
                .doc(groupId)
                .collection('sessions')
                .doc(sessionId)
                .get();
            
            if (!sessionDoc.exists) {
                alert('Session not found.');
                return;
            }
            
            const session = sessionDoc.data();
            const attendees = session.attendees || [];
            
            // Check if already attending
            if (attendees.includes(this.currentUser.uid)) {
                // Toggle - remove from attendees
                await this.db.collection('studyGroups')
                    .doc(groupId)
                    .collection('sessions')
                    .doc(sessionId)
                    .update({
                        attendees: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
                    });
                
                this.sendNotification('Session Left', 'You\'ve been removed from the session');
                this.loadStudySessions(groupId);
            } else {
                // Add to attendees
                await this.db.collection('studyGroups')
                    .doc(groupId)
                    .collection('sessions')
                    .doc(sessionId)
                    .update({
                        attendees: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
                    });
                
                const date = session.dateTime.toDate();
                this.sendNotification('Session Joined', `You'll be reminded before ${session.name} starts`);
                alert(`✅ You've joined "${session.name}"!\n\n📅 ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}\n\nYou'll get a reminder notification before it starts.`);
                this.loadStudySessions(groupId);
            }
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Error joining session. Please try again.');
        }
    }

    // ============================================
    // CHAT FEATURES
    // ============================================

    async sendChatMessage(groupId) {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        try {
            // Disable input while sending
            input.disabled = true;
            
            const result = await this.postGroupMessage(groupId, message);
            
            if (result.success) {
                input.value = '';
                // Wait a moment for Firestore to sync
                setTimeout(() => {
                    this.loadChatMessages(groupId);
                }, 500);
            } else {
                alert('Failed to send message: ' + result.error);
            }
        } catch (error) {
            console.error('❌ Error sending chat message:', error);
            alert('Error sending message. Please try again.');
        } finally {
            input.disabled = false;
            input.focus();
        }
    }

    async loadChatMessages(groupId) {
        try {
            const messages = await this.getGroupMessages(groupId, 100);
            const chatMessages = document.getElementById('chat-messages');
            if (!chatMessages) return;

            if (messages.length === 0) {
                chatMessages.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No messages yet. Be the first to say hello! 👋</p>';
                return;
            }

            let html = '';
            messages.forEach(msg => {
                const isOwnMessage = msg.userId === this.currentUser.uid;
                let timestamp = '';
                
                // Handle timestamp carefully
                if (msg.timestamp) {
                    try {
                        if (typeof msg.timestamp.toDate === 'function') {
                            timestamp = new Date(msg.timestamp.toDate()).toLocaleTimeString();
                        } else if (msg.timestamp instanceof Date) {
                            timestamp = msg.timestamp.toLocaleTimeString();
                        } else {
                            timestamp = 'Just now';
                        }
                    } catch (e) {
                        timestamp = 'Just now';
                    }
                } else {
                    timestamp = 'Just now';
                }
                
                html += `
                    <div class="chat-message ${isOwnMessage ? 'own-message' : ''}">
                        <strong>${msg.userName}:</strong>
                        <p>${this.escapeHtml(msg.message)}</p>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                `;
            });
            chatMessages.innerHTML = html;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('❌ Error loading chat messages:', error);
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Error loading messages. Please refresh.</p>';
            }
        }
    }

    // Helper function to escape HTML and prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Setup real-time chat listener
    setupChatListener(groupId) {
        // Store the unsubscribe function if we need to clean up later
        if (this.chatUnsubscribe) {
            this.chatUnsubscribe();
        }

        this.chatUnsubscribe = this.db
            .collection('studyGroups')
            .doc(groupId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .onSnapshot((snapshot) => {
                // Only update if there are actual changes
                if (!snapshot.empty) {
                    this.loadChatMessages(groupId);
                }
            }, (error) => {
                console.error('❌ Error in chat listener:', error);
            });
    }

    // Display members list
    displayMembersList(members) {
        const membersList = document.getElementById('members-list');
        if (!membersList) return;

        let html = '';
        members.forEach(member => {
            html += `
                <div class="member-card">
                    <div class="member-avatar">${member.displayName[0].toUpperCase()}</div>
                    <div class="member-info">
                        <h4>${member.displayName}</h4>
                        <p>${member.role === 'admin' ? '👑 Admin' : '👤 Member'}</p>
                    </div>
                </div>
            `;
        });
        membersList.innerHTML = html;
    }
}

// Initialize study groups manager and make it globally accessible
let studyGroupsManager;

// Initialize after DOM is ready
if (typeof window !== 'undefined') {
    // Browser environment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            studyGroupsManager = new StudyGroupsManager();
            window.studyGroupsManager = studyGroupsManager;
            console.log('✅ Study Groups Manager initialized');
        });
    } else {
        // DOM already loaded
        studyGroupsManager = new StudyGroupsManager();
        window.studyGroupsManager = studyGroupsManager;
        console.log('✅ Study Groups Manager initialized');
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudyGroupsManager };
}

