self.addEventListener('fetch', e => {
    const req = e.request;
    const urlObj = new URL(req.url);
    if (urlObj.pathname !== "/index.html") {
        self.postMessage("wrong url: " + urlObj.pathname);
        return;
    }
    
    e.respondWith(fetch(req));
})