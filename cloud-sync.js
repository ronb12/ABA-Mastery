// Cloud Sync Module for ABA Mastery
// A product of Bradley Virtual Solutions, LLC
// Efficient cross-device data synchronization using Firebase Firestore

class CloudSync {
    constructor() {
        this.currentUser = null;
        this.isSyncing = false;
        this.lastSyncTime = null;
        this.syncQueue = [];
        
        // Initialize when auth state changes
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(user => {
                this.currentUser = user;
                if (user) {
                    this.initSync();
                }
            });
        }
    }
    
    // Initialize sync for logged-in user
    async initSync() {
        if (!this.currentUser) return;
        
        console.log('🔄 Initializing cloud sync for user:', this.currentUser.uid);
        
        // Load latest data from cloud on startup
        await this.pullFromCloud();
        
        // Setup visibility change listener
        this.setupVisibilityListener();
        
        // Setup beforeunload listener to sync before page close
        this.setupBeforeUnloadListener();
    }
    
    // Pull latest data from Firestore
    async pullFromCloud() {
        if (!this.currentUser || !firebase.firestore) {
            return null;
        }
        
        try {
            const db = firebase.firestore();
            const docSnap = await db.collection('users')
                .doc(this.currentUser.uid)
                .collection('progress')
                .doc('main')
                .get();
            
            if (docSnap.exists) {
                const cloudData = docSnap.data();
                const localData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
                
                // Intelligent merge: use most recent data
                const mergedData = this.mergeData(localData, cloudData);
                
                // Save merged data locally
                localStorage.setItem('abaUserData', JSON.stringify(mergedData));
                
                // Update app UI if loadUserData function exists
                if (typeof loadUserData === 'function') {
                    loadUserData();
                }
                
                // Update stats display if function exists
                if (typeof updateStats === 'function') {
                    updateStats();
                }
                
                this.lastSyncTime = new Date();
                console.log('✅ Data pulled from cloud:', {
                    questionsAnswered: mergedData.questionsAnswered || 0,
                    accuracy: mergedData.correctAnswers && mergedData.questionsAnswered 
                        ? Math.round((mergedData.correctAnswers / mergedData.questionsAnswered) * 100) + '%'
                        : '0%',
                    studyTime: mergedData.studyTime || 0
                });
                
                return mergedData;
            } else {
                console.log('ℹ️ No cloud data found, using local data');
                return null;
            }
        } catch (error) {
            console.error('❌ Error pulling from cloud:', error);
            return null;
        }
    }
    
    // Push local data to Firestore
    async pushToCloud(source = 'manual') {
        if (!this.currentUser || !firebase.firestore) {
            return false;
        }
        
        // Prevent concurrent syncs
        if (this.isSyncing) {
            console.log('⏳ Sync already in progress, skipping...');
            return false;
        }
        
        this.isSyncing = true;
        this.showSyncIndicator();
        
        try {
            const db = firebase.firestore();
            const localData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
            
            if (!localData || Object.keys(localData).length === 0) {
                console.log('ℹ️ No local data to sync');
                this.isSyncing = false;
                return false;
            }
            
            // Prepare data for Firestore
            const dataToSync = {
                questionsAnswered: localData.questionsAnswered || 0,
                correctAnswers: localData.correctAnswers || 0,
                studyTime: localData.studyTime || 0,
                topicsStudied: localData.topicsStudied || [],
                categoryProgress: localData.categoryProgress || {},
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                syncSource: source
            };
            
            // Upload to Firestore
            await db.collection('users')
                .doc(this.currentUser.uid)
                .collection('progress')
                .doc('main')
                .set(dataToSync, { merge: true });
            
            // Save recent activity if exists
            if (localData.recentActivity && localData.recentActivity.length > 0) {
                const batch = db.batch();
                const recentActivities = localData.recentActivity.slice(-10); // Only sync last 10
                
                recentActivities.forEach((activity, index) => {
                    const docRef = db.collection('users')
                        .doc(this.currentUser.uid)
                        .collection('quizResults')
                        .doc(`quiz-${Date.now()}-${index}`);
                    batch.set(docRef, activity);
                });
                
                await batch.commit();
            }
            
            this.lastSyncTime = new Date();
            console.log('✅ Data pushed to cloud:', {
                source,
                questionsAnswered: dataToSync.questionsAnswered,
                accuracy: dataToSync.questionsAnswered > 0 
                    ? Math.round((dataToSync.correctAnswers / dataToSync.questionsAnswered) * 100) + '%'
                    : '0%'
            });
            
            this.hideSyncIndicator(true);
            return true;
            
        } catch (error) {
            console.error('❌ Error pushing to cloud:', error);
            this.hideSyncIndicator(false);
            return false;
        } finally {
            this.isSyncing = false;
        }
    }
    
    // Intelligent data merge (prefer most recent, higher values)
    mergeData(localData, cloudData) {
        const merged = { ...localData };
        
        // If cloud has more questions answered, use cloud data
        if ((cloudData.questionsAnswered || 0) > (localData.questionsAnswered || 0)) {
            merged.questionsAnswered = cloudData.questionsAnswered;
            merged.correctAnswers = cloudData.correctAnswers;
            merged.studyTime = cloudData.studyTime;
        } else if ((cloudData.questionsAnswered || 0) === (localData.questionsAnswered || 0)) {
            // Same questions answered, use higher study time
            merged.studyTime = Math.max(cloudData.studyTime || 0, localData.studyTime || 0);
        }
        
        // Merge topics studied (union of both)
        const localTopics = new Set(localData.topicsStudied || []);
        const cloudTopics = cloudData.topicsStudied || [];
        cloudTopics.forEach(topic => localTopics.add(topic));
        merged.topicsStudied = Array.from(localTopics);
        
        // Merge category progress (use highest progress for each category)
        merged.categoryProgress = {
            ...(localData.categoryProgress || {}),
            ...(cloudData.categoryProgress || {})
        };
        
        // Merge both progress objects, keeping highest values
        Object.keys(merged.categoryProgress).forEach(category => {
            const localProgress = (localData.categoryProgress || {})[category] || {};
            const cloudProgress = (cloudData.categoryProgress || {})[category] || {};
            
            merged.categoryProgress[category] = {
                correct: Math.max(localProgress.correct || 0, cloudProgress.correct || 0),
                total: Math.max(localProgress.total || 0, cloudProgress.total || 0),
                mastered: localProgress.mastered || cloudProgress.mastered || false
            };
        });
        
        return merged;
    }
    
    // Setup visibility change listener
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden && this.currentUser) {
                console.log('👀 App became visible, checking for updates...');
                await this.pullFromCloud();
            }
        });
    }
    
    // Setup beforeunload listener
    setupBeforeUnloadListener() {
        window.addEventListener('beforeunload', () => {
            if (this.currentUser && !this.isSyncing) {
                // Use navigator.sendBeacon for reliable background sync
                const localData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
                if (localData && Object.keys(localData).length > 0) {
                    // Quick sync before page unload
                    this.pushToCloud('beforeunload');
                }
            }
        });
    }
    
    // Show sync indicator in UI
    showSyncIndicator() {
        let indicator = document.getElementById('sync-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'sync-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(37, 99, 235, 0.95);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: slideInUp 0.3s ease-out;
            `;
            indicator.innerHTML = '<span class="sync-spinner">🔄</span> Syncing...';
            document.body.appendChild(indicator);
            
            // Add spinner animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .sync-spinner {
                    display: inline-block;
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }
        indicator.style.display = 'flex';
    }
    
    // Hide sync indicator
    hideSyncIndicator(success = true) {
        const indicator = document.getElementById('sync-indicator');
        if (indicator) {
            if (success) {
                indicator.style.background = 'rgba(16, 185, 129, 0.95)';
                indicator.innerHTML = '<span>✅</span> Synced';
            } else {
                indicator.style.background = 'rgba(239, 68, 68, 0.95)';
                indicator.innerHTML = '<span>⚠️</span> Sync failed';
            }
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.style.animation = 'slideInUp 0.3s ease-in reverse';
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.style.display = 'none';
                        }
                    }, 300);
                }
            }, 2000);
        }
    }
    
    // Get sync status
    getSyncStatus() {
        return {
            isEnabled: !!this.currentUser,
            isSyncing: this.isSyncing,
            lastSyncTime: this.lastSyncTime,
            timeSinceLastSync: this.lastSyncTime 
                ? Math.floor((Date.now() - this.lastSyncTime) / 1000) 
                : null
        };
    }
}

// Create global instance
const cloudSync = new CloudSync();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cloudSync;
}

