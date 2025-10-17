// Firebase Configuration for ABA Mastery
// A product of Bradley Virtual Solutions, LLC

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp2jOcQm7w8X9OJuHZZqQHdRrIw65lZPI",
  authDomain: "aba-mastery-app.firebaseapp.com",
  projectId: "aba-mastery-app",
  storageBucket: "aba-mastery-app.firebasestorage.app",
  messagingSenderId: "304782196897",
  appId: "1:304782196897:web:db023c75da94b0546430e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export for use in other modules if needed
export { app, firebaseConfig };

// Note: This configuration is currently for future features
// The app uses Firebase Hosting only at this time
// Add Firebase services as needed:
// - Authentication: import { getAuth } from "firebase/auth";
// - Firestore: import { getFirestore } from "firebase/firestore";
// - Analytics: import { getAnalytics } from "firebase/analytics";

