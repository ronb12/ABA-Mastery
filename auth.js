// Authentication Module for ABA Mastery
// A product of Bradley Virtual Solutions, LLC

// Firebase Auth integration (when enabled)
let currentUser = null;

// Initialize auth state
function initAuth() {
    // Initialize profile dropdown
    initProfileDropdown();
    
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        // Listen to auth state changes
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                onUserLoggedIn(user);
            } else {
                currentUser = null;
                onUserLoggedOut();
            }
        });
    } else {
        // No Firebase auth, use guest mode
        console.log('Running in guest mode (no authentication)');
    }
}

// Handle user logged in
function onUserLoggedIn(user) {
    console.log('User logged in:', user.uid);
    
    // Show user info in UI
    updateUIForLoggedInUser(user);
    
    // Sync localStorage data to Firestore
    syncLocalDataToCloud(user.uid);
}

// Handle user logged out
function onUserLoggedOut() {
    console.log('User logged out');
    
    // Update UI for guest mode
    updateUIForGuestUser();
}

// Initialize profile dropdown
function initProfileDropdown() {
    const authBtn = document.getElementById('auth-btn');
    const dropdown = document.getElementById('profile-dropdown');
    const exportBtn = document.getElementById('profile-export-btn');
    const authAction = document.getElementById('profile-auth-action');
    
    if (!authBtn || !dropdown) return;
    
    // Toggle dropdown
    authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            updateProfileStats();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== authBtn) {
            dropdown.style.display = 'none';
        }
    });
    
    // Export data functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportUserData();
            dropdown.style.display = 'none';
        });
    }
    
    // Auth action (guest mode info or sign out)
    if (authAction) {
        authAction.addEventListener('click', () => {
            if (currentUser) {
                signOut();
            } else {
                showGuestModeInfo();
            }
            dropdown.style.display = 'none';
        });
    }
}

// Update profile stats in dropdown
function updateProfileStats() {
    const userData = JSON.parse(localStorage.getItem('abaUserData') || '{}');
    
    document.getElementById('profile-questions').textContent = userData.questionsAnswered || 0;
    
    const accuracy = userData.questionsAnswered > 0 
        ? Math.round((userData.correctAnswers / userData.questionsAnswered) * 100) 
        : 0;
    document.getElementById('profile-accuracy').textContent = accuracy + '%';
    
    const hours = Math.floor((userData.studyTime || 0) / 60);
    const minutes = (userData.studyTime || 0) % 60;
    const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    document.getElementById('profile-time').textContent = timeText;
}

// Export user data
function exportUserData() {
    const userData = localStorage.getItem('abaUserData');
    if (!userData) {
        alert('No data to export.');
        return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(userData);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aba-mastery-data-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    alert('✅ Your study data has been exported!');
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.title = 'Profile';
        authBtn.style.background = 'rgba(239, 68, 68, 0.1)';
        authBtn.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    }
    
    // Update profile dropdown info
    document.getElementById('profile-name').textContent = user.displayName || 'Signed In User';
    document.getElementById('profile-email').textContent = user.email;
    
    const authAction = document.getElementById('profile-auth-action');
    if (authAction) {
        authAction.innerHTML = '<span class="menu-icon">🚪</span><span>Sign Out</span>';
        authAction.classList.add('signed-in');
    }
    
    console.log(`✅ User logged in: ${user.email}`);
}

// Update UI for guest user
function updateUIForGuestUser() {
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.title = 'Profile';
        authBtn.style.background = '';
        authBtn.style.border = '';
        authBtn.style.opacity = '0.7';
    }
    
    // Update profile dropdown info
    document.getElementById('profile-name').textContent = 'Guest User';
    document.getElementById('profile-email').textContent = 'Not signed in';
    
    const authAction = document.getElementById('profile-auth-action');
    if (authAction) {
        authAction.innerHTML = '<span class="menu-icon">🔓</span><span>Guest Mode</span>';
        authAction.classList.remove('signed-in');
    }
    
    console.log('ℹ️ Guest mode - Sign in for cloud sync');
}

// Show guest mode information
function showGuestModeInfo() {
    alert('📱 Guest Mode Active\n\n' +
          '✅ You can use all features of ABA Mastery\n' +
          '✅ Your progress is saved locally on this device\n\n' +
          '💡 Note: Cloud sync and sign-in features are not currently available.\n\n' +
          'Your study progress, quiz results, and settings are saved in your browser\'s local storage.');
}

// Sign in with email and password
async function signInWithEmail(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign up with email and password
async function signUpWithEmail(email, password, displayName) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Update profile with display name
        await userCredential.user.updateProfile({
            displayName: displayName
        });
        
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

// Sign in with Google (temporarily disabled - not configured in Firebase Console)
async function signInWithGoogle() {
    console.warn('Google Sign-In is not currently enabled in Firebase Console');
    alert('Google Sign-In is temporarily unavailable.\n\nPlease use email/password authentication or continue in Guest Mode.');
    return { success: false, error: 'Google Sign-In not enabled' };
    
    /* Uncomment when Google Sign-In is enabled in Firebase Console
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
    }
    */
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS animations if not already present
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Sign out
async function signOut() {
    try {
        // Set logout flag to prevent redirect loop
        sessionStorage.setItem('justLoggedOut', 'true');
        
        // Sync data to cloud before signing out
        if (typeof cloudSync !== 'undefined' && currentUser) {
            await cloudSync.pushToCloud('logout');
        }
        
        await firebase.auth().signOut();
        // Clear local data
        localStorage.removeItem('abaUserData');
        
        // Show success notification
        showNotification('✅ Successfully signed out!', 'success');
        
        // Redirect to landing page after a brief delay
        setTimeout(() => {
            window.location.href = '/landing';
        }, 1500);
        
    } catch (error) {
        console.error('Sign out error:', error);
        showNotification('❌ Error signing out. Please try again.', 'error');
    }
}

// Sync local data to cloud
async function syncLocalDataToCloud(userId) {
    // Get local storage data
    const localData = localStorage.getItem('abaUserData');
    
    if (!localData) return;
    
    const userData = JSON.parse(localData);
    
    // Check if Firebase Firestore is available
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        console.log('Firestore not available, keeping data in localStorage');
        return;
    }
    
    try {
        const db = firebase.firestore();
        
        // Save user progress to Firestore
        await db.collection('users').doc(userId).collection('progress').doc('main').set({
            questionsAnswered: userData.questionsAnswered || 0,
            correctAnswers: userData.correctAnswers || 0,
            studyTime: userData.studyTime || 0,
            topicsStudied: userData.topicsStudied || [],
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Save recent activity
        if (userData.recentActivity && userData.recentActivity.length > 0) {
            const batch = db.batch();
            userData.recentActivity.forEach((activity, index) => {
                const docRef = db.collection('users').doc(userId).collection('quizResults').doc(`quiz-${Date.now()}-${index}`);
                batch.set(docRef, activity);
            });
            await batch.commit();
        }
        
        console.log('Data synced to cloud successfully');
    } catch (error) {
        console.error('Error syncing data:', error);
    }
}

// Load user data from cloud
async function loadUserDataFromCloud(userId) {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        return null;
    }
    
    try {
        const db = firebase.firestore();
        const docSnap = await db.collection('users').doc(userId).collection('progress').doc('main').get();
        
        if (docSnap.exists) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAuth,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        isAuthenticated,
        getCurrentUser
    };
}

