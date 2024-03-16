## ⚠️ 清单 

### window.URL.createObjectURL
该方法创建好的url不再使用时，需要调用 window.URL.revokeObjectURL 释放掉url，避免内存泄漏

> 来自于 react.dev 源码的 src/components/MDX/Sandpack/DownloadButton.tsx