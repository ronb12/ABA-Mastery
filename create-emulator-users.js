// Create test users in Firebase Emulator
// Run this after starting emulators

async function createTestUsers() {
    console.log('Creating test users in Firebase Auth Emulator...\n');
    
    const users = [
        {
            email: 'test123@aba.com',
            password: 'Test123!',
            displayName: 'Test User One'
        },
        {
            email: 'test456@aba.com',
            password: 'Test456!',
            displayName: 'Test User Two'
        }
    ];

    for (const user of users) {
        try {
            const response = await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    displayName: user.displayName,
                    returnSecureToken: true
                })
            });
            
            const data = await response.json();
            
            if (data.localId) {
                console.log(`✅ Created: ${user.email} (${user.displayName})`);
                console.log(`   User ID: ${data.localId}`);
            } else if (data.error && data.error.message.includes('EMAIL_EXISTS')) {
                console.log(`ℹ️  Already exists: ${user.email}`);
            } else {
                console.log(`❌ Error creating ${user.email}:`, data.error?.message || data);
            }
        } catch (error) {
            console.error(`❌ Failed to create ${user.email}:`, error.message);
        }
    }
    
    console.log('\n✅ Test users ready!');
    console.log('View them at: http://localhost:4000/auth\n');
}

if (require.main === module) {
    createTestUsers().catch(console.error);
}

module.exports = createTestUsers;

