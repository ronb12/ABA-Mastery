/**
 * Google AdSense Configuration for ABA Mastery
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up at https://www.google.com/adsense
 * 2. Add your site URL (e.g., your Firebase hosting domain) and get approved
 * 3. In AdSense: Ads > By ad unit > Display ads > Create "Responsive" units
 * 4. Replace in app.html and landing.html:
 *    - ca-pub-0000000000000000 → your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 *    - data-ad-slot="0000000000" → your ad unit slot IDs (each placement can have its own)
 * 5. Deploy and verify ads appear (approval can take 24-48 hours)
 * 
 * Note: AdMob is for native iOS/Android apps. For web apps like ABA Mastery,
 * Google AdSense is the correct ad platform.
 */
window.ABA_ADS_CONFIG = {
    // Your AdSense publisher ID (format: ca-pub-XXXXXXXXXXXXXXXX)
    publisherId: 'ca-pub-3565666509316178',
    
    // Ad unit slot IDs - create these in your AdSense dashboard
    slots: {
        // Responsive banner - shown in app header/footer area
        banner: '0000000000',
        // In-feed or in-article ad (optional)
        content: '0000000000',
        // Sidebar or rectangle (optional)
        sidebar: '0000000000'
    },
    
    // Set to true to enable ads (set false during development)
    enabled: true
};

// Hide ad containers when using placeholder (avoids empty blocks during setup)
(function() {
    if (window.ABA_ADS_CONFIG.publisherId === 'ca-pub-PLACEHOLDER') {
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.ads-container, .ads-section, .ads-in-content').forEach(function(el) {
                el.style.display = 'none';
            });
        });
    }
})();
