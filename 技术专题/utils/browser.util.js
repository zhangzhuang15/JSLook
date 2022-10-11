// NOTE: 浏览器的一些工具函数

// Tag: 兼容篇
// 浏览器环境
const isBrowser = () => window !== undefined

// 判断google浏览器
const isChrome = () => navigator.userAgent.indexOf('Chrome') > -1

// 判断Safari浏览器
const isSafari = () => navigator.userAgent.indexOf('Safari') > -1

// 判断火狐浏览器
const isFirefox = () => navigator.userAgent.indexOf('Firefox') > -1

// 判断edge浏览器
const isEdge = () => navigator.userAgent.indexOf('Edg') > -1

// 判断Opera浏览器
const isOpera = () => ['OPR', 'Opera'].some(key => navigator.userAgent.indexOf(key) > -1)

// 判断IE浏览器
// NOTE: IE is dead
const isIE = () => !isOpera() && ( navigator.userAgent.indexOf('.Net') > -1 || userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 )

// NOTICE: navigator.userAgent 对应于浏览器请求头中的 User-Agent 字段，服务器发送代理请求时，会修改User-Agent字段，所以该字段严格意义上并不能判断
// 请求是来自浏览器，一台服务器，还是爬虫程序

// 判断移动端(手机， Pad)
const isMobile = () => ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'].some(key => navigator.userAgent.indexOf(key) > -1)

// 系统为黑暗模式
const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches




// Tag: 缓存篇
// 获取cookie
const getCookie = (key) => {
    const result = new RegExp(`(?:^|\\s)${key}=(.*?);`).exec(key)
    return result && result[1] || null
}

// 设置cookie
// NOTICE: 不指定 expires， 按照会话周期计算。
//         cookie的 Domain字段不包括 端口号信息，只是代表域名信息，因此同源策略中，端口号不同对 cookie 不起作用。
//         域名A种下的cookie，在域名B中无法访问；
//         同域名下， /user/data 种下的cookie，在 /user/age、/user/data/main 都可以访问，在 /user无法访问；
//         跨域名发送cookie， 后端要指定 Access-Control-Allow-Credentials, Access-Control-Allow-Origin,
//         前端要指定 withCredentials
const setCookie = (key, value, options) => {
    const { path = null, httponly = false, expires = null } = options

    let cookie = `${key}=${value};`

    if (path) {
        cookie += `path=${path};`
    }

    if (httponly) {
        cookie += `httponly=true`;
    }

    if (expires && expires instanceof Date) {
        cookie += `expires=${expires.toUTCString()}`
    }

    document.cookie = cookie
}

// 清除cookie
// NOTE: 设置一个过去的时间就可以删除了
const removeCookie = (key, value) => {
    const now = new Date()
    const past = new Date( now.getTime() - 60 * 1000)
    setCookie(key, value, { expires: past })
}

/**
  * 在localStorage存储数据
  * @param {string} key 
  * @param {*} value 
  * @returns 
  * @NOTICE 存储是按照域名来管理的
  */
 const saveInLocal = (key, value) => localStorage.setItem(key, value)

 /**
  * 从localStorage读取数据
  * @param {string} key 
  * @returns 
  */
 const getInLocal = (key) => localStorage.getItem(key)

 /**
  * 在sessionStorage存储数据
  * @param {string} key 
  * @param {*} value 
  * @returns 
  */
 const saveInSession = (key, value) => sessionStorage.setItem(key, value)

 /**
  * 从sessionStorage读取数据
  * @param {string} key 
  * @returns 
  */
 const getInSession = (key) => sessionStorage.getItem(key)

 // NOTICE: localStorage sessionStorage的区别见 /面径/javascript/localStorage和sessionStorage/README.md




// Tag: 路由篇
// 获取当前网页url
const getCurrentURL = () => location.href

// 获取当前网页域名
const getCurrentPath = () => location.hostname || location.host

// 获取当前网页端口号
const getCurrentPort = () => location.port

// 获取当前网页协议+域名
const getCurrentOrigin = () => location.origin

// 获取当前网页协议
const getCurrentProtocol = () => location.protocol

// 获取当前网页路由
// NOTE: 不包含协议名、域名，`?`,   query, hash
const getCurrentRoute = () => location.pathname

// 获取当前网页query
// NOTE: query首字符是`?`
const getCurrentQuery = () => location.search
const getCurrentQueryObj = () => {
    let obj = {}
    location.search && 
    location.search
            .slice(1)
            .split('&')
            .forEach( query => {
                const [key, value] = query.split('=')
                if (obj[key] && obj[key].length) obj[key] = obj[key].concat(value)
                else if (obj[key]) obj[key] = [obj[key], value]
                else obj[key] = value
            })
    return obj
}
// 另一种实现: 将url中的query参数直接转化为对象
const getCurrentQueryObjInline = url => JSON.parse(`{ "${decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)

// 获取当前网页hash
// NOTE: 不包含 `#`
const getCurrentHash = () => location.hash

// 刷新网页
const reloadWebsite = () => location.reload()

// 加载指定网页
// NOTE: 上一页的记录会被替代，无法返回到上一页; 如果需要后续可以回到上一页，使用 loadWebsite;
const replaceWebsite = (url) => location.replace(url)

// 在新的标签页打开网页
const openWebsite = (url) => window.open(url, '_blank')

// 在当前标签页打开网页
const loadWebsite = (url) => window.open(url, '_self')
/**
 * 在新的浏览器窗口打开网页
 * @param {string} url 
 * @param {number} width 
 * @param {number} height 
 * @param {number} left 
 * @param {number} top 
 * @description width height left top 单位都是px
 */
const openWebsiteInWindow = (url, width, height, left, top) => {
    let feature = ''
    if (width) feature += `width=${width},`
    if (height) feature += `height=${height},`
    if (left) feature += `left=${left},`
    if (top) feature += `top=${top}`
    if (feature.length === 0) {
        window.open(url, '_blank', 'popup')
    } else {
        window.open(url, '_blank', feature)
    }
 }

 // 浏览器前进
 const forward = () => history.forward()

 // 浏览器后退
 const back = () => history.back()

 /**
  * 浏览器前进或者后退n步
  * @param {number} n 
  * @returns 
  */
 const go = (n) => history.go(n)
 
 /**
  * 跳转到前端路由
  * @param {string} url 
  * @param {object} state
  * @returns 
  * @description url 可以是http绝对路径，也可以是http URL的 path; state是自定义的状态信息，用history.state访问
  * @NOTICE 只是路由变化，不会发送http请求；正如Push的含义，会新增一条访问记录
  */
 const goWithPush = (url, state) => history.pushState(state, '', url)

 /**
  * 替换前端路由
  * @param {string} url 
  * @param {object} state 
  * @returns 
  * @NOTICE 只是路由变化，不会发送http请求；正如Replace的含义，不会新增访问记录，而是替换访问记录
  */
 const goWithReplace = (url, state) => history.replaceState(state, '', url)

 
 // Tag: 浏览器样式篇
 // 获取浏览器窗口尺寸
 const getNavigatorSize = () => ({ width: window.outerWidth, height: window.outerHeight })
 
 // 获取浏览器窗口内部尺寸
 const getNavigatorInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight })

 // 获取可视窗口尺寸
 const getViewportSize = () => ({ 
    width: window.innerWidth,
    height: window.innerHeight
 })

 // 获取不带滚动条的可视窗口尺寸
 const getNoScrollBarViewportSize = () => ({
    width: document.documentElement.clientWidth || document.body.clientWidth,
    height: document.documentElement.clientHeight || document.body.clientHeight
 })

 // 获取垂直滚动条的宽度
 const getYScrollBarWidth = () => window.innerWidth - document.documentElement.clientWidth

 // 获取水平滚动条高度
 const getXScrollBarHeight = () => window.innerHeight - document.documentElement.clientHeight

 // 获取浏览器垂直滚动条滚动距离
 const getYScrollOffset = () => window.scrollY || window.pageYOffset || document.documentElement.scrollTop

 // 获取浏览器水平滚动条滚动距离
 const getXScrollOffset = () => window.scrollX || window.pageXOffset || document.documentElement.scrollLeft

 // 获取浏览器窗口左边界距离计算机屏幕左边界的间距
 const getNavigatorLeftOffset = () => window.screenLeft

 const getNavigatorTopOffset = () => window.screenTop

 // 获取浏览器窗口所在屏幕的高度
 const getScreenHeight = () => screen.height

 const getScreenWidth = () => screen.width

 // 获取浏览器所在屏幕左边界到主屏幕左边界的距离
 // NOTE: 多屏幕下才能看到效果，否则值为 0
 const getScreenLeftOffset = () => screen.availWidth

 const getScreenTopOffset = () => screen.availHeight

 // 获取浏览器所在屏幕的像素深度
 const getScreenPixelDepth = () => screen.pixelDepth