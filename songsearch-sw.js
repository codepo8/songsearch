self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('songsearch-v5').then(cache => {
      return cache.addAll([
        '/songsearch/',
        '/songsearch/index.html',
        '/songsearch/manifest.json',
        '/songsearch/songsearch.css',
        '/songsearch/songs.csv',
        '/songsearch/songsearch.js',
        '/songsearch/songsearchworker.js'
      ])
      .then(() => self.skipWaiting());
    })
  )
});
 
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['songsearch-v5'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});