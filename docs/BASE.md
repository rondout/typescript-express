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

## 错误处理

根据[官方文档](https://www.expressjs.com.cn/guide/error-handling.html)的描述，express 是自带错误处理的逻辑的。当然如果 express 的错误处理逻辑不满足我们的业务规范，我们可以通过自定义 errorHandler 来统一处理错误，比如：

```ts
export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res,
  next
) {
  try {
    res.status(500).send({ err: err.stack });
  } catch (error) {
    res.status(500).send(err);
  }
};

app.use(errorHandler);
```

**注意：**这里需要注意，我们自定义的错误处理 handler 需要放在其他的中间件和路由后面（You define error-handling middleware last, after other app.use() and routes calls;）

## 404 处理

编写 404 处理 handler 并且在其他的路由后面 use：

```ts
export const notFoundHandler: Router = Router().use((req, res) => {
  res.status(404).sendFile(resolve(__dirname, "../../public/404.html"));
});

app.use(mainHandler);
app.use(authHandler);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api", indexRouter);
// *
// *
// *
// *
app.use("*", notFoundHandler);
app.use(errorHandler);
```

## 问题记录

### 使用 `express-async-errors` 处理异步错误

描述：如果我们用 async 和 await 去拦截代码错误，需要使用 try catch 去拦截错误，每个接口都这样去做太麻烦了，因此使用 `express` 本身的错误处理加上第三方库 `express-async-errors` 来处理：
使用文档：[官方文档](https://www.npmjs.com/package/express-async-errors), [CSDN](https://blog.csdn.net/m0_51810668/article/details/131278861)

```ts
// app.ts
require("express-async-errors");
```
