// Service Worker für Währungsrechner PWA

const CACHE_NAME = 'currency-converter-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

// Installation - Cache Dateien
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache geöffnet');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Fehler beim Cachen:', error);
            })
    );
    self.skipWaiting();
});

// Aktivierung - Alte Caches löschen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Alter Cache gelöscht:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch - Cache First Strategie
self.addEventListener('fetch', (event) => {
    // Nur GET Requests cachen
    if (event.request.method !== 'GET') {
        return;
    }

    // API Requests nicht cachen (immer live)
    if (event.request.url.includes('api.exchangerate.host') || 
        event.request.url.includes('ipapi.co')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Bei Offline: keine API Response
                    return new Response(JSON.stringify({ error: 'Offline' }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }

    // Für andere Requests: Cache First
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit
                if (response) {
                    return response;
                }

                // Cache Miss - Fetch und Cache
                return fetch(event.request).then((response) => {
                    // Nur erfolgreiche Responses cachen
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Response klonen (Response kann nur einmal verwendet werden)
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Bei Offline: Fallback für Navigation
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});

// Message Handler für manuelle Cache-Updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

