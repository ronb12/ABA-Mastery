// Profile Manager - Edit Name, Email, and User Settings
// A product of Bradley Virtual Solutions, LLC

class ProfileManager {
    constructor() {
        this.user = null;
        this.init();
    }
    
    init() {
        // Listen for auth state
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.user = user;
                    this.loadProfileData();
                }
            });
        }
    }
    
    // Load current profile data
    async loadProfileData() {
        if (!this.user) return;
        
        try {
            // Get current user data
            await this.user.reload();
            const currentUser = firebase.auth().currentUser;
            
            // Update form fields
            const displayNameInput = document.getElementById('profile-display-name');
            const emailDisplay = document.getElementById('profile-email-display');
            const currentEmailSpan = document.getElementById('current-email');
            
            if (displayNameInput) {
                displayNameInput.value = currentUser.displayName || '';
            }
            
            if (emailDisplay) {
                emailDisplay.textContent = currentUser.email || '';
            }
            
            if (currentEmailSpan) {
                currentEmailSpan.textContent = currentUser.email || '';
            }
            
            // Also get Firestore data
            const db = firebase.firestore();
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                console.log('Profile data loaded:', userData);
            }
            
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
    
    // Update display name
    async updateDisplayName(newName) {
        if (!this.user) {
            throw new Error('No user logged in');
        }
        
        if (!newName || newName.trim().length < 2) {
            throw new Error('Name must be at least 2 characters');
        }
        
        try {
            const trimmedName = newName.trim();
            
            // Update Firebase Auth profile
            await this.user.updateProfile({
                displayName: trimmedName
            });
            
            // Update Firestore
            const db = firebase.firestore();
            await db.collection('users').doc(this.user.uid).set({
                displayName: trimmedName,
                email: this.user.email,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            // Reload user
            await this.user.reload();
            
            // Update personalization system
            if (typeof personalization !== 'undefined') {
                personalization.loadUserInfo(firebase.auth().currentUser);
            }
            
            // Reload profile data
            await this.loadProfileData();
            
            return { success: true, message: 'Name updated successfully!' };
            
        } catch (error) {
            console.error('Error updating name:', error);
            throw error;
        }
    }
    
    // Update email
    async updateEmail(newEmail, currentPassword) {
        if (!this.user) {
            throw new Error('No user logged in');
        }
        
        if (!newEmail || !this.isValidEmail(newEmail)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (!currentPassword) {
            throw new Error('Current password is required to change email');
        }
        
        try {
            // Re-authenticate user first (required for sensitive operations)
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.user.email,
                currentPassword
            );
            
            await this.user.reauthenticateWithCredential(credential);
            
            // Update email
            await this.user.updateEmail(newEmail);
            
            // Update Firestore
            const db = firebase.firestore();
            await db.collection('users').doc(this.user.uid).update({
                email: newEmail,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Reload user
            await this.user.reload();
            
            // Reload profile data
            await this.loadProfileData();
            
            return { success: true, message: 'Email updated successfully!' };
            
        } catch (error) {
            console.error('Error updating email:', error);
            
            // User-friendly error messages
            if (error.code === 'auth/wrong-password') {
                throw new Error('Incorrect password. Please try again.');
            } else if (error.code === 'auth/email-already-in-use') {
                throw new Error('This email is already in use by another account.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Please enter a valid email address.');
            } else if (error.code === 'auth/requires-recent-login') {
                throw new Error('Please log out and log back in before changing your email.');
            }
            
            throw error;
        }
    }
    
    // Update password
    async updatePassword(currentPassword, newPassword) {
        if (!this.user) {
            throw new Error('No user logged in');
        }
        
        if (!currentPassword) {
            throw new Error('Current password is required');
        }
        
        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters');
        }
        
        try {
            // Re-authenticate user first
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.user.email,
                currentPassword
            );
            
            await this.user.reauthenticateWithCredential(credential);
            
            // Update password
            await this.user.updatePassword(newPassword);
            
            return { success: true, message: 'Password updated successfully!' };
            
        } catch (error) {
            console.error('Error updating password:', error);
            
            if (error.code === 'auth/wrong-password') {
                throw new Error('Current password is incorrect.');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('New password is too weak. Use at least 8 characters.');
            }
            
            throw error;
        }
    }
    
    // Helper: Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Get current user info
    getUserInfo() {
        if (!this.user) return null;
        
        return {
            uid: this.user.uid,
            email: this.user.email,
            displayName: this.user.displayName,
            emailVerified: this.user.emailVerified,
            createdAt: this.user.metadata.creationTime,
            lastSignIn: this.user.metadata.lastSignInTime
        };
    }
}

// Create global instance
const profileManager = new ProfileManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = profileManager;
}

