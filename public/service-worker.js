const CACHE_NAME = 'zoonova-videos-cache-v1';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Garder seulement le cache vidéo actuel
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cacher les vidéos (mp4, webm, mkv, etc.)
  if (isVideoUrl(url)) {
    event.respondWith(cacheVideo(request));
  }
});

function isVideoUrl(url) {
  const videoExtensions = ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv', 'm4v'];
  const pathname = url.pathname.toLowerCase();
  return videoExtensions.some(ext => pathname.endsWith(`.${ext}`));
}

async function cacheVideo(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Chercher dans le cache d'abord
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Vérifier l'expiration (1 an)
    const cachedDate = cachedResponse.headers.get('sw-cached-at');
    if (cachedDate) {
      const cacheAge = Date.now() - parseInt(cachedDate);
      if (cacheAge < ONE_YEAR_MS) {
        return cachedResponse;
      } else {
        // Cache expiré, le supprimer
        await cache.delete(request);
      }
    }
  }

  // Sinon, aller chercher depuis le réseau
  try {
    const response = await fetch(request);
    
    if (response.ok && response.status === 200) {
      // Cloner la réponse et ajouter la date de cache
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const newResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, newResponse);
      return response;
    }
    
    return response;
  } catch (error) {
    // Si erreur réseau et pas de cache, retourner une erreur
    console.error('Erreur fetch vidéo:', error);
    throw error;
  }
}
