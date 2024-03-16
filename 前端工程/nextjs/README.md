## Description
一个react全栈框架。

用该框架，你可以：
- 像编写 SPA 那样写客户端的 React 代码；
- 直接编写后端的接口服务；
- 支持SSR，static rendering；

用next编写的项目，就是一个前、后端聚合的项目。

前端代码静态生成，由 next build 完成。

后端接口服务、SSR渲染服务，由 next start 完成。

## Feature
- [x] support css modules natively
  > so easy, create `.module.css` file and import it

- [x] support scss natively 
  > remember to install sass locally

## Rendering
### Static Rendering 
next 会在编译的时候，生成静态html文件，这个就是 static rendering。
这个渲染方式主要用于博客、官网等类型网站，不需要和浏览者发生数据交互。

### Server Side Rendering 
next start 启动 SSR服务程序后，它会根据发送来的请求，动态生成对应的
html

### Dynamic Rendering 
当请求的路由没有命中一个html（next编译时创建的），next会为此生成一个
html文件，然后将它返回给请求方，这就是 dynamic rendering，也可以称之
为 按请求需要而渲染 。

## route 
### static route 
路由是明文固定的，比如 /intro 

### dynamic route 
路由中的一部分是动态的，比如 /product/a/intro 和 /product/b/intro, a 和 b 
就是动态的，`/product/<xxx>/intro` 这种路由就是动态路由

### api route 
next支持你写后端接口代码，比如一个接口path是 /a/c, 那么你就要在文件 `/app/a/c/route.ts`里编写http接口代码，而 /a/c这个路由就是 API route

## Deploy
next 是前端项目编译工具，也是服务程序。

以前用webpack+react开发一个SPA应用，会将生成的结果dist文件夹放到nginx
服务器中。 next build 做的事情就是生成 dist 文件夹。

但是next中支持SSR，想要SSR，必须要有SSR服务器才行，这个服务器就是由 next start 
支持。

综上，在部署的时候，只需要在服务器上执行 next build，然后执行 next start 即可，
之前的nginx代理，是代理到index.html页面，而现在，只需要代理到 next start 的服务 
进程。

## Create Project of Nextjs 
run `npx create-next-app@latest <project-directory-name>`

for example, in `/a/b/c`, run `npx create-next-app@latest hello-world`,
there will be `/a/b/c/hello-world`, open hello-world directory with 
vscode, start to code it.

you don't worry about any configs, create-next-app will help you.


## Reference
[Intro of Next from Bilibili Uper](https://www.bilibili.com/video/BV1B54y1g7dp/?spm_id_from=333.788&vd_source=8e22a21e39978743c185c338fa9b6d6d)

[style part of next](https://nextjs.org/docs/app/building-your-application/styling)

[image optimizing](https://nextjs.org/docs/app/building-your-application/optimizing/images)

[font optimizing](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

[improve web performance with images](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)

[what is web font](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)