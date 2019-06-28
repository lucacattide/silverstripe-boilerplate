'use strict';

// Service Worker Configuration - Development
// Workbox checking
if (workbox) {
  self.addEventListener('install', function(e) {
    /* var urls = [
      '/php/offline.php',
      '/php/error.php',
    ];

    // Runtime Caching
    e.waitUntil(caches.open('service-assets').then(function(cache) {
      cache.addAll(urls)
    })); */

    // TODO: Enable here only with push notifications
    // self.skipWaiting();

    // Debug mode
    workbox.setConfig({
      // TODO: In production must be set to false
      debug: true
    });
    // Cache names
    workbox.core.setCacheNameDetails({
      // TODO: Rename
      prefix: '',
      suffix: 'v1',
      precache: '-precache',
      runtime: '-runtime',
      googleAnalytics: 'ga',
    });
    // Files precaching
    workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
    // Route Requests
    // CDN Resources
    workbox.routing.registerRoute(
      /.*(?:googleapis|gstatic|jquery|cloudflare|googletagmanager|google|google-analytics|doubleclick)\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'resources',
      })
    );
    // Fonts - CSS
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.googleapis\.com/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
      })
    );
    // Fonts - Webfonts
    workbox.routing.registerRoute(
      /^https:\/\/fonts\.gstatic\.com/,
      new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
          }),
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 30,
          }),
        ],
      })
    );
    // Images
    workbox.routing.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            // 1 month
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      })
    );
    // Audio
    // TODO: HTML tags must have the crossOrigin attribute
    workbox.routing.registerRoute(
      /.*\.(?:mp3|ogg)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'audio',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [200]
          }),
          new workbox.rangeRequest.Plugin(),
        ],
      }),
    );
    // Video
    // TODO: HTML tags must have the crossOrigin attribute
    workbox.routing.registerRoute(
      /.*\.(?:mp4|webm)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'video',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [200]
          }),
          new workbox.rangeRequest.Plugin(),
        ],
      }),
    );
    // CSS
    workbox.routing.registerRoute(
      new RegExp('.+\\.css$'),
      new workbox.strategies.CacheFirst({
        cacheName: 'css',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 50,
            // 1 month
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      })
    );
    // JS
    workbox.routing.registerRoute(
      new RegExp('.+\\.js$'),
      new workbox.strategies.NetworkFirst({
        networkTimeoutSeconds: 3,
        cacheName: 'js',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 50,
            // 1 month
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      })
    );

    // HTML - Sections
    var htmlSectionHandler = new workbox.strategies.NetworkFirst({
      networkTimeoutSeconds: 3,
      cacheName: 'html-sections-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // 1 month
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    });

    workbox.routing.registerRoute(/(.*)\.html/, function(args) {
      return htmlSectionHandler.handle(args)
        .then(function(response) {
          if (!response) {
            // TODO: Fallback page
            return caches.match('html/offline.html');
          } else if (response.status === 404) {
            // TODO: Error page
            return caches.match('html/error.html');
          }

          return response;
        });
    });

    // PHP - Sections
    var phpSectionHandler = new workbox.strategies.NetworkFirst({
      networkTimeoutSeconds: 3,
      cacheName: 'php-sections-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // 1 month
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    });

    workbox.routing.registerRoute(/(.*)\.php/, function(args) {
      return phpSectionHandler.handle(args)
        .then(function(response) {
          if (!response) {
            // TODO: Set fallback page
            return caches.match('php/offline.php');
          } else if (response.status === 404) {
            // TODO: Set error page
            return caches.match('php/error.php');
          }

          return response;
        });
    });

    // Google Analytics
    workbox.googleAnalytics.initialize();
  });
  self.addEventListener('activate', function(e) {
    var cacheWhiteList = [
      // TODO: Uncomment only if runtime caching is enabled
      //'service-assets',
      'resources',
      'google-fonts-stylesheets',
      'google-fonts-webfonts',
      'images',
      'audio',
      'video',
      'css',
      'js',
      'html-sections-cache',
      'php-sections-cache',
    ];
    // Old cache deletion
    e.waitUntil(caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhiteList.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    }).then(function() {
      self.clients.claim();
    }));
  });
  self.addEventListener('fetch', function(e) {
    e.respondWith(caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(e.request)
        .then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          // TODO: Rename with one set in setCacheNameDetails
          caches.open('')
            .then(function(cache) {
              cache.put(e.request, responseToCache);
            });

          return response;
        });
    }));
  });
  self.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
}
// Service Worker End
