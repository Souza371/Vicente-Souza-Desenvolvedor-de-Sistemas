const CACHE_NAME = 'vicente-portfolio-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/favicon.svg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event - Cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Install Event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All resources cached');
        return self.skipWaiting();
      })
      .catch(err => {
        console.log('Service Worker: Cache failed', err);
      })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate Event');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip GitHub API requests (always fetch fresh)
  if (event.request.url.includes('api.github.com')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Check if valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Clone response for caching
            const responseToCache = fetchResponse.clone();
            
            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return fetchResponse;
          })
          .catch(err => {
            console.log('Service Worker: Fetch failed', err);
            
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background Sync (for future contact form functionality)
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(
      syncContactForm()
    );
  }
});

async function syncContactForm() {
  // Future implementation for offline contact form submission
  console.log('Service Worker: Syncing contact form data');
}

// Push Notifications (for future blog updates)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Novo conteúdo disponível!',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Conteúdo',
        icon: '/assets/images/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/images/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Vicente Souza Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic Background Sync (for updating GitHub data)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'github-sync') {
    event.waitUntil(
      updateGitHubData()
    );
  }
});

async function updateGitHubData() {
  // Future implementation for periodic GitHub data updates
  console.log('Service Worker: Updating GitHub data in background');
}