// ABA Mastery - Google AdSense configuration
// Auto Ads can run from the publisher ID alone once enabled in AdSense.
// Manual in-page ad units below need real slot IDs from the AdSense account.

(function initABAMasteryAds() {
    const ADS_CONFIG = {
        publisherId: 'ca-pub-3565666509316178',
        slots: {
            homeBanner: '',
            footerBanner: ''
        }
    };

    function hasValidPublisherId(value) {
        return typeof value === 'string' && /^ca-pub-\d{16}$/.test(value);
    }

    function hasValidSlot(value) {
        return typeof value === 'string' && /^\d{10,}$/.test(value) && !/^0+$/.test(value);
    }

    function isLocalHost() {
        return ['localhost', '127.0.0.1'].includes(window.location.hostname);
    }

    function loadAdSenseScript() {
        if (!hasValidPublisherId(ADS_CONFIG.publisherId) || isLocalHost()) {
            return;
        }

        const existing = document.querySelector('script[data-aba-adsense-script="true"]');
        if (existing) {
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.dataset.abaAdsenseScript = 'true';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}`;
        document.head.appendChild(script);
    }

    function hideAdContainer(adElement) {
        const container = adElement.closest('.ads-container, .ad-slot-shell, .ad-slot-shell-home, .ad-slot-shell-footer');
        if (container) {
            container.style.display = 'none';
        }
    }

    function isAdConfigured(slotId) {
        return hasValidPublisherId(ADS_CONFIG.publisherId) && hasValidSlot(slotId) && !isLocalHost();
    }

    function getElementWidth(adElement) {
        const rect = adElement.getBoundingClientRect();
        return rect?.width || 0;
    }

    function initializeAdUnits() {
        const adUnits = document.querySelectorAll('ins.adsbygoogle[data-aba-ad-unit]');
        if (!adUnits.length) {
            return;
        }

        adUnits.forEach((adElement) => {
            const unitName = adElement.dataset.abaAdUnit;
            const slotId = ADS_CONFIG.slots[unitName];

            // If not configured (missing slot IDs, localhost, invalid pub), hide the container.
            // If configured but the slot is currently 0px wide (e.g. app hidden / view not laid out),
            // defer initialization and let refresh/reflow try again later.
            if (!isAdConfigured(slotId)) {
                hideAdContainer(adElement);
                return;
            }

            const width = getElementWidth(adElement);
            if (width <= 0) {
                return;
            }

            if (adElement.dataset.adsInitialized === 'true') {
                return;
            }

            adElement.dataset.adClient = ADS_CONFIG.publisherId;
            adElement.dataset.adSlot = slotId;
            adElement.dataset.adFormat = adElement.dataset.adFormat || 'auto';
            adElement.dataset.fullWidthResponsive = adElement.dataset.fullWidthResponsive || 'true';
            adElement.dataset.adsInitialized = 'true';

            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                adElement.dataset.adsInitialized = 'error';
                console.warn(`AdSense ad unit "${unitName}" could not initialize yet.`, error);
            }
        });
    }

    function setupDeferredAdInitialization() {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const adUnits = document.querySelectorAll('ins.adsbygoogle[data-aba-ad-unit]');
        if (!adUnits.length) {
            return;
        }

        const observer = new ResizeObserver(() => {
            initializeAdUnits();
        });

        adUnits.forEach((adElement) => {
            const container = adElement.closest('.ads-container, .ad-slot-shell, .ad-slot-shell-home, .ad-slot-shell-footer') || adElement;
            observer.observe(container);
        });
    }

    function refreshAds() {
        if (isLocalHost()) {
            return;
        }
        initializeAdUnits();
    }

    function startAds() {
        loadAdSenseScript();
        initializeAdUnits();
        setupDeferredAdInitialization();
    }

    ADS_CONFIG.refreshAds = refreshAds;
    window.ABA_ADS_CONFIG = ADS_CONFIG;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAds);
    } else {
        startAds();
    }

    window.addEventListener('load', initializeAdUnits);
})();
