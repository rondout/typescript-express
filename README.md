# 使用 typescript + express 创建 NodeJs 后端服务

## 初始化 NodeJs 程序

```bash
npm init -y
```

## 安装依赖

```bash
pnpm add express
pnpm add ts-node nodemon @types/node @types/express -D
```

## 配置 nodemon

在根目录创建`nodemon.json`来配置 nodemon:

```json
{
  "watch": ["./"],
  "ext": ".ts,",
  "exec": "ts-node app.ts"
}
```

## 配置启动脚本

在 `package.json` 中配置启动脚本：

```json
{
  // /
  "scripts": {
    "dev": "nodemon"
  }
  ///
}
```

由此，一个 `typescript` 版本的 `NodeJs` 工程就搭建好了。然后就开始安装 `express` 等依赖，来写业务代码了。

## 问题记录

### 使用 `express-async-errors` 处理异步错误

描述：如果我们用 async 和 await 去拦截代码错误，需要使用 try catch 去拦截错误，每个接口都这样去做太麻烦了，因此使用 `express` 本身的错误处理加上第三方库 `express-async-errors` 来处理：
使用文档：[官方文档](https://www.npmjs.com/package/express-async-errors), [CSDN](https://blog.csdn.net/m0_51810668/article/details/131278861)

```ts
// app.ts
require("express-async-errors");
```
