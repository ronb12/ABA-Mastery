#!/usr/bin/env node

/**
 * Add Test Users to Firebase
 * A product of Bradley Virtual Solutions, LLC
 * 
 * This script creates test users in Firebase Authentication
 * and adds their progress data to Firestore
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// Note: You'll need to download service account key from Firebase Console
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'aba-mastery-app'
});

const auth = admin.auth();
const db = admin.firestore();

// Test users data
const testUsers = [
    {
        email: 'sarah.johnson@abamastery.test',
        password: 'Test123456!',
        displayName: 'Sarah Johnson',
        role: 'student',
        progress: {
            questionsAnswered: 45,
            correctAnswers: 38,
            studyTime: 120,
            topicsStudied: [
                'foundations-1',
                'foundations-2',
                'assessment-1',
                'assessment-2',
                'intervention-1',
                'verbal-1'
            ],
            categoryProgress: {
                foundations: 100,
                assessment: 75,
                intervention: 60,
                'verbal-behavior': 25,
                ethics: 40,
                research: 0,
                'skill-acquisition': 20,
                autism: 50,
                systems: 30
            },
            recentActivity: [
                {
                    type: 'quiz',
                    date: new Date('2025-10-16').toISOString(),
                    score: 85,
                    questions: 20,
                    category: 'foundations'
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-15').toISOString(),
                    score: 78,
                    questions: 15,
                    category: 'assessment'
                }
            ],
            lastVisit: new Date().toISOString()
        }
    },
    {
        email: 'michael.chen@abamastery.test',
        password: 'Test123456!',
        displayName: 'Michael Chen',
        role: 'student',
        progress: {
            questionsAnswered: 120,
            correctAnswers: 98,
            studyTime: 350,
            topicsStudied: [
                'foundations-1', 'foundations-2',
                'assessment-1', 'assessment-2', 'assessment-3', 'assessment-4',
                'intervention-1', 'intervention-2', 'intervention-3',
                'verbal-1', 'verbal-2', 'verbal-3',
                'ethics-1', 'ethics-2', 'ethics-3',
                'research-1', 'research-2'
            ],
            categoryProgress: {
                foundations: 100,
                assessment: 100,
                intervention: 85,
                'verbal-behavior': 90,
                ethics: 75,
                research: 60,
                'skill-acquisition': 50,
                autism: 70,
                systems: 45
            },
            recentActivity: [
                {
                    type: 'quiz',
                    date: new Date('2025-10-17').toISOString(),
                    score: 95,
                    questions: 25,
                    category: 'all'
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-16').toISOString(),
                    score: 88,
                    questions: 20,
                    category: 'verbal-behavior'
                }
            ],
            lastVisit: new Date().toISOString()
        }
    },
    {
        email: 'emily.rodriguez@abamastery.test',
        password: 'Test123456!',
        displayName: 'Emily Rodriguez',
        role: 'student',
        progress: {
            questionsAnswered: 15,
            correctAnswers: 10,
            studyTime: 45,
            topicsStudied: [
                'foundations-1',
                'assessment-1'
            ],
            categoryProgress: {
                foundations: 50,
                assessment: 25,
                intervention: 0,
                'verbal-behavior': 0,
                ethics: 0,
                research: 0,
                'skill-acquisition': 0,
                autism: 0,
                systems: 0
            },
            recentActivity: [
                {
                    type: 'quiz',
                    date: new Date('2025-10-17').toISOString(),
                    score: 70,
                    questions: 10,
                    category: 'foundations'
                }
            ],
            lastVisit: new Date().toISOString()
        }
    }
];

async function createTestUsers() {
    console.log('🔥 Starting Firebase Test User Creation...\n');
    
    let created = 0;
    let failed = 0;
    
    for (const userData of testUsers) {
        try {
            console.log(`\n📝 Creating user: ${userData.displayName} (${userData.email})`);
            
            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.displayName,
                emailVerified: true
            });
            
            console.log(`✅ User created in Firebase Auth`);
            console.log(`   UID: ${userRecord.uid}`);
            
            // Add user profile to Firestore
            await db.collection('users').doc(userRecord.uid).set({
                displayName: userData.displayName,
                email: userData.email,
                role: userData.role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastVisit: admin.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ User profile saved to Firestore`);
            
            // Add progress data
            await db.collection('users').doc(userRecord.uid).collection('progress').doc('main').set({
                questionsAnswered: userData.progress.questionsAnswered,
                correctAnswers: userData.progress.correctAnswers,
                studyTime: userData.progress.studyTime,
                topicsStudied: userData.progress.topicsStudied,
                categoryProgress: userData.progress.categoryProgress,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ Progress data saved`);
            
            // Add quiz results
            if (userData.progress.recentActivity) {
                const batch = db.batch();
                userData.progress.recentActivity.forEach((activity, index) => {
                    const docRef = db.collection('users')
                        .doc(userRecord.uid)
                        .collection('quizResults')
                        .doc(`quiz-${Date.now()}-${index}`);
                    batch.set(docRef, {
                        ...activity,
                        timestamp: admin.firestore.Timestamp.fromDate(new Date(activity.date))
                    });
                });
                await batch.commit();
                console.log(`✅ Quiz results saved (${userData.progress.recentActivity.length} quizzes)`);
            }
            
            console.log(`\n🎉 Successfully created: ${userData.displayName}`);
            console.log(`   Email: ${userData.email}`);
            console.log(`   Password: ${userData.password}`);
            console.log(`   Accuracy: ${Math.round((userData.progress.correctAnswers / userData.progress.questionsAnswered) * 100)}%`);
            
            created++;
            
        } catch (error) {
            console.error(`\n❌ Error creating ${userData.displayName}:`, error.message);
            failed++;
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Users Created: ${created}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📧 Total Attempted: ${testUsers.length}`);
    console.log('='.repeat(70));
    
    if (created > 0) {
        console.log('\n📝 Test User Credentials:');
        testUsers.forEach((user, index) => {
            if (index < created) {
                console.log(`\n${index + 1}. ${user.displayName}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Password: ${user.password}`);
            }
        });
    }
    
    console.log('\n✅ Firebase test user creation complete!\n');
}

// Run the script
createTestUsers()
    .then(() => {
        console.log('🎉 All done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });

