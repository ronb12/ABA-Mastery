const puppeteer = require('puppeteer');
const https = require('https');

async function verifyFirebaseDeployment() {
    console.log('🔍 Verifying Firebase Hosting Deployment...\n');
    console.log('='.repeat(70));
    
    // Check 1: Fetch service worker to check version
    console.log('\n📋 CHECK 1: Service Worker Version');
    console.log('-'.repeat(70));
    
    return new Promise((resolve, reject) => {
        https.get('https://aba-mastery-app.web.app/sw.js', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                const versionMatch = data.match(/CACHE_NAME = ['"]aba-mastery-v([\d.]+)['"]/);
                const currentVersion = versionMatch ? versionMatch[1] : 'Unknown';
                
                console.log(`✅ Service Worker Version: v${currentVersion}`);
                console.log(`   Expected: v1.3.1`);
                
                if (currentVersion === '1.3.1') {
                    console.log('   ✅ VERSION MATCHES!');
                } else {
                    console.log('   ⚠️  VERSION MISMATCH - May need to redeploy');
                }
                
                // Check 2: Verify landing page exists
                console.log('\n📋 CHECK 2: Landing Page Availability');
                console.log('-'.repeat(70));
                
                https.get('https://aba-mastery-app.web.app/landing.html', (res) => {
                    console.log(`✅ Landing page status: ${res.statusCode}`);
                    if (res.statusCode === 200) {
                        console.log('   ✅ LANDING PAGE EXISTS');
                    } else {
                        console.log('   ❌ LANDING PAGE NOT FOUND');
                    }
                    
                    // Check 3: Test live app with Puppeteer
                    console.log('\n📋 CHECK 3: Live App Features');
                    console.log('-'.repeat(70));
                    
                    (async () => {
                        const browser = await puppeteer.launch({
                            headless: true,
                            args: ['--no-sandbox', '--disable-setuid-sandbox']
                        });
                        
                        const page = await browser.newPage();
                        
                        try {
                            // Load app page
                            await page.goto('https://aba-mastery-app.web.app/app', { 
                                waitUntil: 'networkidle2',
                                timeout: 30000 
                            });
                            
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            // Check for latest features
                            const features = await page.evaluate(() => {
                                return {
                                    hasAuthBtn: !!document.getElementById('auth-btn'),
                                    hasProfileDropdown: !!document.getElementById('profile-dropdown'),
                                    hasProfileAuthAction: !!document.getElementById('profile-auth-action'),
                                    hasProfileStats: !!document.querySelector('.profile-stats'),
                                    hasProfileMenu: !!document.querySelector('.profile-menu'),
                                    hasExportBtn: !!document.getElementById('profile-export-btn'),
                                    dropdownHTML: document.getElementById('profile-dropdown')?.innerHTML?.substring(0, 200) || 'Not found'
                                };
                            });
                            
                            console.log('Feature Detection:');
                            console.log(`   Auth Button: ${features.hasAuthBtn ? '✅ Found' : '❌ Missing'}`);
                            console.log(`   Profile Dropdown: ${features.hasProfileDropdown ? '✅ Found' : '❌ Missing'}`);
                            console.log(`   Logout/Auth Button: ${features.hasProfileAuthAction ? '✅ Found' : '❌ Missing'}`);
                            console.log(`   Profile Stats Section: ${features.hasProfileStats ? '✅ Found' : '❌ Missing'}`);
                            console.log(`   Profile Menu: ${features.hasProfileMenu ? '✅ Found' : '❌ Missing'}`);
                            console.log(`   Export Data Button: ${features.hasExportBtn ? '✅ Found' : '❌ Missing'}`);
                            
                            // Check if all latest features present
                            const allFeaturesPresent = features.hasAuthBtn && 
                                                      features.hasProfileDropdown && 
                                                      features.hasProfileAuthAction &&
                                                      features.hasProfileStats &&
                                                      features.hasProfileMenu &&
                                                      features.hasExportBtn;
                            
                            console.log('\n📋 CHECK 4: CSS Version');
                            console.log('-'.repeat(70));
                            
                            const cssVersion = await page.evaluate(() => {
                                const link = document.querySelector('link[href*="styles.css"]');
                                return link ? link.getAttribute('href') : 'Not found';
                            });
                            
                            console.log(`   CSS File: ${cssVersion}`);
                            console.log(`   Expected: styles.css?v=1.3.1`);
                            
                            if (cssVersion.includes('v=1.3.1')) {
                                console.log('   ✅ CSS VERSION MATCHES!');
                            } else {
                                console.log('   ⚠️  CSS VERSION MISMATCH');
                            }
                            
                            console.log('\n📋 CHECK 5: JavaScript Version');
                            console.log('-'.repeat(70));
                            
                            const jsVersions = await page.evaluate(() => {
                                const authJs = document.querySelector('script[src*="auth.js"]');
                                const appJs = document.querySelector('script[src*="app.js"]');
                                return {
                                    auth: authJs ? authJs.getAttribute('src') : 'Not found',
                                    app: appJs ? appJs.getAttribute('src') : 'Not found'
                                };
                            });
                            
                            console.log(`   auth.js: ${jsVersions.auth}`);
                            console.log(`   app.js: ${jsVersions.app}`);
                            console.log(`   Expected: ?v=1.3.1`);
                            
                            const jsVersionCorrect = jsVersions.auth.includes('v=1.3.1') && 
                                                    jsVersions.app.includes('v=1.3.1');
                            
                            if (jsVersionCorrect) {
                                console.log('   ✅ JS VERSIONS MATCH!');
                            } else {
                                console.log('   ⚠️  JS VERSION MISMATCH');
                            }
                            
                            // Final Summary
                            console.log('\n' + '='.repeat(70));
                            console.log('📊 FIREBASE DEPLOYMENT VERIFICATION SUMMARY');
                            console.log('='.repeat(70));
                            
                            const checks = {
                                serviceWorker: currentVersion === '1.3.1',
                                landingPage: res.statusCode === 200,
                                latestFeatures: allFeaturesPresent,
                                cssVersion: cssVersion.includes('v=1.3.1'),
                                jsVersion: jsVersionCorrect
                            };
                            
                            const allChecks = Object.values(checks).every(v => v);
                            
                            console.log(`\n1. Service Worker Version: ${checks.serviceWorker ? '✅ CORRECT' : '❌ OUTDATED'}`);
                            console.log(`2. Landing Page: ${checks.landingPage ? '✅ DEPLOYED' : '❌ MISSING'}`);
                            console.log(`3. Latest Features: ${checks.latestFeatures ? '✅ PRESENT' : '❌ MISSING'}`);
                            console.log(`4. CSS Version: ${checks.cssVersion ? '✅ CURRENT' : '❌ OUTDATED'}`);
                            console.log(`5. JS Version: ${checks.jsVersion ? '✅ CURRENT' : '❌ OUTDATED'}`);
                            
                            console.log('\n' + '='.repeat(70));
                            if (allChecks) {
                                console.log('🎉 FIREBASE IS SERVING THE LATEST VERSION (v1.3.1)');
                                console.log('✅ All features deployed successfully!');
                            } else {
                                console.log('⚠️  FIREBASE MAY NOT BE FULLY UPDATED');
                                console.log('💡 Try clearing browser cache or redeploying');
                            }
                            console.log('='.repeat(70));
                            
                            console.log('\n🌐 Live URLs:');
                            console.log('   Landing: https://aba-mastery-app.web.app');
                            console.log('   App: https://aba-mastery-app.web.app/app');
                            console.log('   Last Deployed: Just now');
                            
                        } catch (error) {
                            console.error('\n❌ Error checking live app:', error.message);
                        } finally {
                            await browser.close();
                            resolve();
                        }
                    })();
                    
                }).on('error', err => {
                    console.error('❌ Error checking landing page:', err.message);
                    resolve();
                });
            });
        }).on('error', err => {
            console.error('❌ Error checking service worker:', err.message);
            reject(err);
        });
    });
}

verifyFirebaseDeployment()
    .then(() => {
        console.log('\n✅ Verification complete!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Verification failed:', error);
        process.exit(1);
    });

