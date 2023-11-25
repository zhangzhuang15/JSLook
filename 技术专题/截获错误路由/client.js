const panel = document.getElementById("panel");

let cancel = false;

window.addEventListener("beforeunload", (ev) => {
    if (cancel) {
        cancel = false;
        ev.preventDefault();
    }
});

window.addEventListener("error", (ev) => {
    // 404 的问题，这里拦截不到？
});

// async function registerServiceWorker() {
//     if('serviceWorker' in navigator) {
//         const registry = await navigator.serviceWorker.register('/worker.js', { scope: '/'})
//         if(registry.installing) {
//             window.alert('service worker is installing')
//         } else if(registry.waiting) {
//             window.alert('service worker is installed')
//         } else if(registry.active) {
//             window.alert('service worker is active')
//         }

//         // receive message from service worker
//         navigator.serviceWorker.addEventListener("message", (ev) => {
//             const data = ev.data;
//             panel.innerText = data;
//             cancel = true;
//         });
//     }
// }

// registerServiceWorker()