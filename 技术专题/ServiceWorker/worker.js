async function getResponse(url) {
    if(url.indexOf('baidu') > -1) {

        return new Response( "good request" , { status: 200 })
    }
    return new Response( "bad request" , { status: 200})
}

this.addEventListener('fetch', e => {
    console.log("fetch invoke")
    e.respondWith(getResponse(e.request.url))
})