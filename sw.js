// Service Worker for ABA Mastery
// A product of Bradley Virtual Solutions, LLC

const CACHE_NAME = 'aba-mastery-v2.0.0';
const urlsToCache = [
    '/',
    '/landing.html',
    '/login.html',
    '/app.html',
    '/styles.css?v=1.3.4',
    '/app.js?v=1.3.4',
    '/auth.js?v=1.3.4',
    '/content.json?v=1.3.4',
    '/manifest.json',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-144.png',
    '/icons/icon-152.png',
    '/icons/icon-192.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip service worker for authentication and navigation redirects
    // This allows logout redirects to work properly
    if (event.request.mode === 'navigate' || 
        event.request.url.includes('/landing') ||
        event.request.url.includes('/login') ||
        event.request.url.includes('/signup') ||
        event.request.url.includes('firebase')) {
        // Let the browser handle navigation and auth naturally
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request with redirect mode set to follow
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest, { redirect: 'follow' }).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    
                    // Don't cache redirects or opaque responses
                    if (response.type === 'opaque' || response.redirected) {
                        return response;
                    }
                    
                    // Only cache GET requests (POST/PUT/DELETE cannot be cached)
                    if (event.request.method !== 'GET') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache the new resource
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(error => {
                    console.error('Fetch failed:', error);
                    // Return a custom offline page if available
                    return caches.match('/app.html');
                });
            })
    );
});

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Placeholder for syncing user data when back online
    console.log('Syncing data...');
}

// Push notification support (for future features)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('ABA Mastery', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

