// CYF Service Worker – macht die Seite als echte App installierbar (eigenes Fenster statt Browser-Tab).
// Bewusst ohne Cache: alles kommt immer frisch vom Server (ohne Internet zählt eh nichts).
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{if(e.request.mode==="navigate")e.respondWith(fetch(e.request))});
