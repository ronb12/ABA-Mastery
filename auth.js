// Authentication Module for ABA Mastery
// A product of Bradley Virtual Solutions, LLC

// Firebase Auth integration (when enabled)
let currentUser = null;

// Initialize auth state
function initAuth() {
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

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userSection = document.getElementById('user-section');
    if (userSection) {
        userSection.innerHTML = `
            <div class="user-info">
                <span>Welcome, ${user.displayName || user.email}</span>
                <button onclick="signOut()" class="btn btn-secondary">Sign Out</button>
            </div>
        `;
    }
}

// Update UI for guest user
function updateUIForGuestUser() {
    const userSection = document.getElementById('user-section');
    if (userSection) {
        userSection.innerHTML = `
            <a href="landing.html" class="btn btn-primary">Sign In for Cloud Sync</a>
        `;
    }
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

// Sign in with Google
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'landing.html';
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Error signing out. Please try again.');
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

