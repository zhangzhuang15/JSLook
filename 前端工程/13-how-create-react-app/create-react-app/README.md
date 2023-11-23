[toc]

## npx 
```shell
$ npx create-react-app react-app
```
搭建好的react项目将放在 react-app 文件夹下;

默认状态下，它：
- 安装react相关库，令你直接使用react框架
- 支持直接 import css文件
- 支持 css modules
- 手动安装sass后，自动支持 import scss文件
- 支持直接 import 图片 font file 
- 支持 code splitting, 只需采用 import()
- 没有安装前端路由工具库, 需要手动安装
- 没有安装状态管理工具库，需要手动安装
- 不支持 ts tsx 

### 支持 ts 
```shell 
$ npx create-react-app react-app --template typescript
```

### 支持前端路由
```shell 
$ npm install --save react-router-dom
```

### 支持 ts + react-redux
```shell
$ npx create-react-app react-app --template redux-typescript
```

### 支持 js + react-redux 
```shell 
$ npx create-react-app react-app --template redux
```

### 支持 ts + react-redux + redux-saga
```shell 
$ npx create-react-app react-app --template redux-saga-typescript
```

react-redux 将redux和react框架绑定；
redux-saga 是redux的一个中间件，支持异步改变state；

## npm 
```shell 
$ npm create react-app react-app
```

## pnpm
```shell 
$ pnpm create react-app react-app
```

## yarn 
```shell 
$ yarn create react-app react-app
```

