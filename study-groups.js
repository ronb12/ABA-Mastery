// Study Groups Feature for ABA Mastery
// Enables collaborative learning and peer support

class StudyGroupsManager {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUser = null;
        this.userGroups = [];
        
        // Listen for auth changes
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            if (user) {
                this.loadUserGroups();
            }
        });
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

    // Show create group modal
    showCreateGroupModal() {
        // Implementation would show a modal with form to create group
        const name = prompt('Enter group name:');
        if (!name) return;

        const description = prompt('Enter description (optional):');
        const examDate = prompt('Enter exam date (YYYY-MM-DD) (optional):');

        this.createStudyGroup({
            name,
            description,
            examDate: examDate || null,
            examType: 'BCBA'
        }).then(result => {
            if (result.success) {
                alert(`Group created! Invite code: ${result.inviteCode}\nShare this code with others to invite them.`);
                this.loadUserGroups().then(() => this.displayStudyGroupsView());
            } else {
                alert('Error creating group: ' + result.error);
            }
        });
    }

    // Show join group modal
    showJoinGroupModal() {
        const inviteCode = prompt('Enter invite code:');
        if (!inviteCode) return;

        this.joinStudyGroup(inviteCode).then(result => {
            if (result.success) {
                alert(`Successfully joined ${result.groupName}!`);
                this.loadUserGroups().then(() => this.displayStudyGroupsView());
            } else {
                alert('Error joining group: ' + result.error);
            }
        });
    }

    // Open group details
    async openGroup(groupId) {
        // This would navigate to a detailed group view with chat, members, etc.
        console.log('Opening group:', groupId);
        window.location.href = `/study-group?id=${groupId}`;
    }
}

// Initialize study groups manager
const studyGroupsManager = new StudyGroupsManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudyGroupsManager, studyGroupsManager };
}

