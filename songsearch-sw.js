self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('csscolourgame-v8').then(cache => {
      return cache.addAll([
        '/songsearch/index.html',
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

  var cacheWhitelist = ['songsearch-v1'];

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