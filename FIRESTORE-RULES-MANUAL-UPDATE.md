# 🔧 Manual Firestore Rules Update

## ⚠️ **PROBLEM:**
The rating system is getting "Missing or insufficient permissions" error because the Firestore rules haven't been deployed yet.

## ✅ **SOLUTION: Manually Update Rules in Firebase Console**

### **Step 1: Open Firebase Console**

Go to: https://console.firebase.google.com/u/0/project/aba-mastery-app/firestore/rules

### **Step 2: Add Rating Rules**

Find the line that says:
```javascript
// Default deny all other paths
match /{document=**} {
  allow read, write: if false;
}
```

**BEFORE that line**, add these two sections:

```javascript
// App Ratings
match /ratings/{ratingId} {
  allow read: if false; // Keep individual ratings private
  allow create: if true; // Anyone can submit (authenticated or anonymous)
  allow update, delete: if false; // Can't modify after submission
}

// App Stats (aggregate ratings)
match /appStats/{statId} {
  allow read: if true; // Anyone can see aggregate stats
  allow write: if false; // Updated via transactions only
}
```

### **Step 3: Your Complete Rules Should Look Like This:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // User profiles - users can only read/write their own data
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
      
      // User progress data
      match /progress/{progressId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }
      
      // User quiz results
      match /quizResults/{quizId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }
      
      // User study sessions
      match /studySessions/{sessionId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }
      
      // User flashcard progress
      match /flashcardProgress/{cardId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }
    }
    
    // Public content - read-only for all users
    match /content/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Categories - read-only for all users
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Topics - read-only for all users
    match /topics/{topicId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Practice questions - read-only for all users
    match /practiceQuestions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Flashcards - read-only for all users
    match /flashcards/{cardId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Global statistics
    match /statistics/{statId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Leaderboard
    match /leaderboard/{entryId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // Community features
    match /community/{postId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() 
        && request.auth.uid == resource.data.authorId;
    }
    
    // Study Groups
    match /studyGroups/{groupId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated();
      
      match /members/{memberId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }
      
      match /messages/{messageId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update, delete: if isAuthenticated();
      }
      
      match /files/{fileId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow delete: if isAuthenticated();
      }
      
      match /quizzes/{quizId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update: if isAuthenticated();
      }
      
      match /sessions/{sessionId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update: if isAuthenticated();
      }
      
      match /progressUpdates/{updateId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
      }
    }
    
    // Exam pass tracking
    match /examResults/{resultId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // ⭐ ADD THESE TWO SECTIONS ⭐
    
    // App Ratings - NEW
    match /ratings/{ratingId} {
      allow read: if false; // Keep individual ratings private
      allow create: if true; // Anyone can submit (authenticated or anonymous)
      allow update, delete: if false; // Can't modify after submission
    }
    
    // App Stats (aggregate ratings) - NEW
    match /appStats/{statId} {
      allow read: if true; // Anyone can see aggregate stats
      allow write: if false; // Updated via transactions only
    }
    
    // Default deny all other paths
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **Step 4: Publish Rules**

1. Click **"Publish"** button in Firebase Console
2. Wait for confirmation message
3. Rules are now live! ✅

---

## 🧪 **TEST AFTER UPDATE:**

1. Go back to: https://aba-mastery-app.web.app/app
2. Click **"⭐ Rate This App"** in Settings
3. Select stars and submit
4. **Should work now!** 🎉

---

## 📊 **VERIFY DATA SAVED:**

After submitting a rating, check Firebase Console:

**Ratings Collection:**
https://console.firebase.google.com/u/0/project/aba-mastery-app/firestore/data/~2Fratings

**App Stats:**
https://console.firebase.google.com/u/0/project/aba-mastery-app/firestore/data/~2FappStats~2Fratings

---

**The key rules to add are:**
```javascript
// App Ratings
match /ratings/{ratingId} {
  allow create: if true; // ← This allows anyone to submit ratings
}

// App Stats
match /appStats/{statId} {
  allow read: if true; // ← This allows anyone to see aggregate stats
}
```

