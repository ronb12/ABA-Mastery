// Create Test Users for ABA Mastery
// Simulates realistic user data and interactions

const testUsers = [
    {
        id: 'test-user-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'student',
        progress: {
            questionsAnswered: 45,
            correctAnswers: 38,
            studyTime: 120, // minutes
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
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-14').toISOString(),
                    score: 90,
                    questions: 10,
                    category: 'intervention'
                }
            ]
        }
    },
    {
        id: 'test-user-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
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
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-16').toISOString(),
                    score: 82,
                    questions: 15,
                    category: 'ethics'
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-15').toISOString(),
                    score: 90,
                    questions: 20,
                    category: 'assessment'
                }
            ]
        }
    },
    {
        id: 'test-user-3',
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
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
                },
                {
                    type: 'quiz',
                    date: new Date('2025-10-17').toISOString(),
                    score: 60,
                    questions: 5,
                    category: 'assessment'
                }
            ]
        }
    }
];

// Function to load test user data into localStorage
function loadTestUser(userIndex) {
    const user = testUsers[userIndex];
    if (!user) {
        console.error('Test user not found');
        return;
    }

    localStorage.setItem('abaUserData', JSON.stringify(user.progress));
    console.log(`✅ Loaded test user: ${user.name}`);
    console.log(`   Questions answered: ${user.progress.questionsAnswered}`);
    console.log(`   Accuracy: ${Math.round((user.progress.correctAnswers / user.progress.questionsAnswered) * 100)}%`);
    console.log(`   Study time: ${user.progress.studyTime} minutes`);
    console.log(`   Topics studied: ${user.progress.topicsStudied.length}`);
    
    // Reload page to reflect new data
    window.location.reload();
}

// Function to create a custom test user
function createCustomTestUser(options = {}) {
    const customUser = {
        questionsAnswered: options.questionsAnswered || 0,
        correctAnswers: options.correctAnswers || 0,
        studyTime: options.studyTime || 0,
        topicsStudied: options.topicsStudied || [],
        categoryProgress: options.categoryProgress || {},
        recentActivity: options.recentActivity || [],
        lastVisit: new Date().toISOString()
    };

    localStorage.setItem('abaUserData', JSON.stringify(customUser));
    console.log('✅ Custom test user created');
    window.location.reload();
}

// Function to clear test user data
function clearTestUser() {
    localStorage.removeItem('abaUserData');
    console.log('✅ Test user data cleared');
    window.location.reload();
}

// Function to export current user data
function exportUserData() {
    const userData = localStorage.getItem('abaUserData');
    if (userData) {
        console.log('Current user data:', JSON.parse(userData));
        return JSON.parse(userData);
    } else {
        console.log('No user data found');
        return null;
    }
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
    window.testUsers = testUsers;
    window.loadTestUser = loadTestUser;
    window.createCustomTestUser = createCustomTestUser;
    window.clearTestUser = clearTestUser;
    window.exportUserData = exportUserData;
    
    console.log('🧪 Test Users Module Loaded');
    console.log('📋 Available commands:');
    console.log('   loadTestUser(0)  - Load Sarah Johnson (moderate progress)');
    console.log('   loadTestUser(1)  - Load Michael Chen (advanced user)');
    console.log('   loadTestUser(2)  - Load Emily Rodriguez (beginner)');
    console.log('   createCustomTestUser({ questionsAnswered: 50, ... })');
    console.log('   clearTestUser()  - Clear all test data');
    console.log('   exportUserData() - View current user data');
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testUsers,
        loadTestUser,
        createCustomTestUser,
        clearTestUser,
        exportUserData
    };
}

