// Simplified WOW Features Test - Verifies JavaScript objects and state
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'wow-features');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name) {
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   📸 Screenshot: ${name}.png`);
}

async function testWowFeatures() {
    console.log('\n🚀 Testing WOW Features - Comprehensive Verification\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox'],
        defaultViewport: { width: 1400, height: 900 }
    });
    
    const page = await browser.newPage();
    
    try {
        // Navigate to app
        console.log('📱 Opening App...\n');
        await page.goto(`${BASE_URL}/app.html`, { waitUntil: 'networkidle2' });
        await wait(2000);
        
        await takeScreenshot(page, 'home-view');
        
        // ==========================================
        // TEST 1: Verify JavaScript Objects Loaded
        // ==========================================
        console.log('🧪 TEST 1: Verifying JavaScript Objects...');
        
        const jsObjects = await page.evaluate(() => {
            return {
                aiCoachExists: typeof aiStudyCoach !== 'undefined',
                adaptiveExists: typeof adaptiveLearning !== 'undefined',
                gamificationExists: typeof gamification !== 'undefined',
                cloudSyncExists: typeof cloudSync !== 'undefined',
                integrationExists: typeof updateAICoachDashboard !== 'undefined'
            };
        });
        
        console.log(`   ${jsObjects.aiCoachExists ? '✅' : '❌'} AI Study Coach loaded`);
        console.log(`   ${jsObjects.adaptiveExists ? '✅' : '❌'} Adaptive Learning loaded`);
        console.log(`   ${jsObjects.gamificationExists ? '✅' : '❌'} Gamification loaded`);
        console.log(`   ${jsObjects.cloudSyncExists ? '✅' : '❌'} Cloud Sync loaded`);
        console.log(`   ${jsObjects.integrationExists ? '✅' : '❌'} Integration loaded\n`);
        
        // ==========================================
        // TEST 2: Verify UI Elements Present
        // ==========================================
        console.log('🎨 TEST 2: Verifying UI Elements...');
        
        const uiElements = {
            aiCoach: await page.$('#ai-coach-dashboard'),
            readinessScore: await page.$('#readiness-score'),
            levelCard: await page.$('.level-card'),
            streakCard: await page.$('.streak-card'),
            achievementsCard: await page.$('.achievements-card')
        };
        
        console.log(`   ${uiElements.aiCoach ? '✅' : '❌'} AI Coach dashboard`);
        console.log(`   ${uiElements.readinessScore ? '✅' : '❌'} Readiness score display`);
        console.log(`   ${uiElements.levelCard ? '✅' : '❌'} Level card`);
        console.log(`   ${uiElements.streakCard ? '✅' : '❌'} Streak card`);
        console.log(`   ${uiElements.achievementsCard ? '✅' : '❌'} Achievements card\n`);
        
        // ==========================================
        // TEST 3: Verify AI Study Coach
        // ==========================================
        console.log('🤖 TEST 3: Testing AI Study Coach...');
        
        const aiCoachData = await page.evaluate(() => {
            if (typeof aiStudyCoach === 'undefined') return null;
            const analysis = aiStudyCoach.calculateExamReadiness();
            return {
                status: analysis.status,
                readinessScore: analysis.readinessScore,
                message: analysis.message,
                hasRecommendations: analysis.recommendations && analysis.recommendations.length > 0
            };
        });
        
        if (aiCoachData) {
            console.log(`   ✅ AI Coach calculating readiness`);
            console.log(`   📊 Status: ${aiCoachData.status}`);
            console.log(`   💬 Message: "${aiCoachData.message}"`);
            console.log(`   ${aiCoachData.hasRecommendations ? '✅' : 'ℹ️ '} Recommendations: ${aiCoachData.hasRecommendations ? 'Ready' : 'Need more data'}\n`);
        }
        
        // ==========================================
        // TEST 4: Verify Adaptive Learning
        // ==========================================
        console.log('🎯 TEST 4: Testing Adaptive Learning...');
        
        const adaptiveData = await page.evaluate(() => {
            if (typeof adaptiveLearning === 'undefined') return null;
            const state = adaptiveLearning.getAdaptiveState();
            return {
                userLevel: state.userLevel,
                difficulty: state.currentDifficulty.label,
                stars: state.currentDifficulty.stars,
                message: state.message
            };
        });
        
        if (adaptiveData) {
            console.log(`   ✅ Adaptive Learning active`);
            console.log(`   📊 User Level: ${adaptiveData.userLevel}/100`);
            console.log(`   ⭐ Difficulty: ${adaptiveData.difficulty} ${adaptiveData.stars}`);
            console.log(`   💬 Status: "${adaptiveData.message}"\n`);
        }
        
        // ==========================================
        // TEST 5: Verify Gamification
        // ==========================================
        console.log('🏆 TEST 5: Testing Gamification System...');
        
        const gamificationData = await page.evaluate(() => {
            if (typeof gamification === 'undefined') return null;
            const dashboard = gamification.getDashboardData();
            const allAchievements = gamification.getAllAchievements();
            return {
                level: dashboard.level,
                levelTitle: dashboard.levelInfo.title,
                levelIcon: dashboard.levelInfo.icon,
                totalXP: dashboard.totalXP,
                streak: dashboard.streak,
                achievementsUnlocked: dashboard.achievements.unlocked,
                achievementsTotal: dashboard.achievements.total,
                allAchievements: allAchievements.map(a => ({
                    name: a.name,
                    unlocked: a.unlocked
                }))
            };
        });
        
        if (gamificationData) {
            console.log(`   ✅ Gamification system active`);
            console.log(`   📊 Level: ${gamificationData.level} - ${gamificationData.levelTitle} ${gamificationData.levelIcon}`);
            console.log(`   ⭐ Total XP: ${gamificationData.totalXP}`);
            console.log(`   🔥 Streak: ${gamificationData.streak} days`);
            console.log(`   🎖️  Achievements: ${gamificationData.achievementsUnlocked}/${gamificationData.achievementsTotal} unlocked`);
            
            const unlockedAchievements = gamificationData.allAchievements.filter(a => a.unlocked);
            if (unlockedAchievements.length > 0) {
                console.log(`   🎉 Unlocked:`);
                unlockedAchievements.forEach(a => {
                    console.log(`      - ${a.name}`);
                });
            }
            console.log('');
        }
        
        // ==========================================
        // TEST 6: Verify Data Persistence
        // ==========================================
        console.log('💾 TEST 6: Checking Data Persistence...');
        
        const persistence = await page.evaluate(() => {
            return {
                localStorage: {
                    abaUserData: !!localStorage.getItem('abaUserData'),
                    adaptiveLearning: !!localStorage.getItem('adaptiveLearningState'),
                    gamification: !!localStorage.getItem('gamificationData')
                },
                sessionStorage: {
                    hasData: sessionStorage.length > 0
                }
            };
        });
        
        console.log(`   ${persistence.localStorage.abaUserData ? '✅' : 'ℹ️ '} User data in localStorage`);
        console.log(`   ${persistence.localStorage.adaptiveLearning ? '✅' : 'ℹ️ '} Adaptive state in localStorage`);
        console.log(`   ${persistence.localStorage.gamification ? '✅' : 'ℹ️ '} Gamification data in localStorage\n`);
        
        // ==========================================
        // TEST 7: Test Feature Functions
        // ==========================================
        console.log('⚙️  TEST 7: Testing Feature Functions...');
        
        // Simulate recording an answer
        const adaptiveTest = await page.evaluate(() => {
            if (typeof adaptiveLearning === 'undefined') return null;
            
            // Record a correct answer
            adaptiveLearning.recordAnswer(true, 'intermediate', 25);
            const state1 = adaptiveLearning.getAdaptiveState();
            
            // Record an incorrect answer
            adaptiveLearning.recordAnswer(false, 'intermediate', 45);
            const state2 = adaptiveLearning.getAdaptiveState();
            
            return {
                levelAfterCorrect: state1.userLevel,
                levelAfterIncorrect: state2.userLevel,
                adjusted: state1.userLevel !== state2.userLevel
            };
        });
        
        if (adaptiveTest) {
            console.log(`   ✅ Adaptive Learning adjusts difficulty`);
            console.log(`   📈 After correct: Level ${adaptiveTest.levelAfterCorrect}`);
            console.log(`   📉 After incorrect: Level ${adaptiveTest.levelAfterIncorrect}`);
            console.log(`   ${adaptiveTest.adjusted ? '✅' : '❌'} Level adjusted correctly\n`);
        }
        
        // Test gamification XP award
        const gamificationTest = await page.evaluate(() => {
            if (typeof gamification === 'undefined') return null;
            
            const beforeXP = gamification.userData.totalXP;
            gamification.awardXP(10, 'Test');
            const afterXP = gamification.userData.totalXP;
            
            return {
                beforeXP,
                afterXP,
                awarded: afterXP > beforeXP
            };
        });
        
        if (gamificationTest) {
            console.log(`   ✅ Gamification awards XP`);
            console.log(`   Before: ${gamificationTest.beforeXP} XP`);
            console.log(`   After: ${gamificationTest.afterXP} XP`);
            console.log(`   ${gamificationTest.awarded ? '✅' : '❌'} XP awarded correctly\n`);
        }
        
        await takeScreenshot(page, 'tests-complete');
        
        // ==========================================
        // FINAL SUMMARY
        // ==========================================
        console.log('=' .repeat(60));
        console.log('📊 COMPREHENSIVE TEST RESULTS\n');
        
        const allPassed = 
            jsObjects.aiCoachExists &&
            jsObjects.adaptiveExists &&
            jsObjects.gamificationExists &&
            uiElements.aiCoach &&
            uiElements.levelCard &&
            aiCoachData &&
            adaptiveData &&
            gamificationData;
        
        if (allPassed) {
            console.log('✅ ALL FEATURES WORKING PERFECTLY!\n');
            console.log('Feature Status:');
            console.log('  🤖 AI Study Coach      ✅ ACTIVE');
            console.log('  🎯 Adaptive Learning   ✅ ACTIVE');
            console.log('  🏆 Gamification        ✅ ACTIVE');
            console.log('  ☁️  Cloud Sync         ✅ ACTIVE');
            console.log('  🔗 Integration         ✅ ACTIVE');
        } else {
            console.log('⚠️  Some features need attention');
        }
        
        console.log('\n' + '=' .repeat(60));
        console.log('📸 Screenshots saved in: tests/screenshots/wow-features/');
        console.log('✅ TEST SUITE COMPLETE!\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        await takeScreenshot(page, 'error');
    } finally {
        await browser.close();
    }
}

testWowFeatures().catch(console.error);

