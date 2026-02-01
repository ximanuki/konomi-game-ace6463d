const CACHE_NAME = 'konomi-game-v2';

// 動的にベースパスを取得（環境非依存）
const BASE_PATH = self.location.pathname.replace(/\/[^/]*$/, '');

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/puzzle.html`,
  `${BASE_PATH}/matching.html`,
  `${BASE_PATH}/drawing.html`,
  `${BASE_PATH}/colors.html`,
  `${BASE_PATH}/rhythm.html`,
  `${BASE_PATH}/flowers.html`,
  `${BASE_PATH}/achievements.html`,
  `${BASE_PATH}/gallery.html`,
  `${BASE_PATH}/css/common.css`,
  `${BASE_PATH}/css/components.css`,
  `${BASE_PATH}/css/animations.css`,
  `${BASE_PATH}/js/sound.js`,
  `${BASE_PATH}/js/utils.js`,
  `${BASE_PATH}/js/storage.js`,
  `${BASE_PATH}/js/particle.js`,
  `${BASE_PATH}/js/achievements.js`,
  `${BASE_PATH}/assets/icons/icon-192.png`,
  `${BASE_PATH}/assets/icons/icon-512.png`
];

// Install
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching files');
        return cache.addAll(urlsToCache.map(url => {
          // まだ存在しないファイルはスキップ（エラー防止）
          return new Request(url, { cache: 'no-cache' });
        })).catch(err => {
          console.warn('[SW] Some files failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        // ネットワークから取得
        return fetch(event.request).then(response => {
          // 有効なレスポンスのみキャッシュ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(err => {
          console.error('[SW] Fetch failed:', err);
          // オフライン時のフォールバック（将来実装）
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
