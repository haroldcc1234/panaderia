const CACHE_NAME = 'panaderia-delicia-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/nosotros.html',
    '/productos.html',
    '/visitanos.html',
    '/contacto.html',
    '/carrito.html',
    '/css/styles.css',
    '/js/main.js',
    '/manifest.json',
    // Fuentes principales
    'https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
    // Imágenes principales (puedes añadir más)
    '/img/hero1.jpg',
    '/img/hero2.jpg',
    '/img/hero3.jpg',
    // Iconos de la App
    '/img/icons/icon-192x192.png', // Asegúrate de que este archivo exista
    '/img/icons/icon-512x512.png'  // Asegúrate de que este archivo exista
];

// Evento 'install': se dispara cuando el Service Worker se instala.
// Aquí es donde guardamos en caché los archivos principales de la app.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache abierto');
            return cache.addAll(urlsToCache);
        })
    );
});

// Evento 'fetch': se dispara cada vez que la página solicita un recurso (una imagen, un script, etc.).
// Aquí interceptamos la solicitud y servimos desde el caché si está disponible.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Si el recurso está en el caché, lo devolvemos.
            // Si no, hacemos la petición a la red.
            return response || fetch(event.request);
        })
    );
});