importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

const CACHE_NAME = 'tiizi-shell-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest'];

firebase.initializeApp({
  apiKey: 'AIzaSyAx-mUKo15u1F1-MXCQllxg2LuOkkuTWBA',
  authDomain: 'tiizi-235d4.firebaseapp.com',
  projectId: 'tiizi-235d4',
  storageBucket: 'tiizi-235d4.firebasestorage.app',
  messagingSenderId: '98964120859',
  appId: '1:98964120859:web:2ce4326fbac3d0f2055fbe',
  measurementId: 'G-PGGTN6NKWP'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'Tiizi';
  const options = {
    body: payload?.notification?.body || 'You have a new request.',
    icon: '/favicon.ico'
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
