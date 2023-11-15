# express 登录鉴权

## 理解 handler

目前来说我的理解就是，`express`每次收到`http请求`都会暂时拦截，我们编写的这些 handler 就是在处理这些请求，handler 通常会有以下参数：

- req：数据类型为 `Request`，这里包含了请求的完整信息，包括请求体，请求头部等等，我们可以在这里获取用户带的请求头，比如 `token` 等等。
- res：响应对象，这个对象包含了非常多的方法，我们可以在响应之前做一些操作，比如查询数据库、设置响应头等等。
- next：这是一个方法，这个方法如果调用，则会进入下一个 handler。
- err：这个参数只会出现在 `ErrorRequestHandler` 里面，也就是说当我们自定义了错误处理 `errorHandler` 并且代码运行确实到了这里，那么 express 会把这个错误信息传递出来。

## 拦截请求

在理解了 `express handler` 之后，我们就可以自定义一个 `handler` 放在所有 handler 之前，把这个 `handler` 作为整个系统的请求拦截器，在这里我们可以通过是否调用 `handler` 的 `next` 方法来决定是否继续进入后面的 handler 里面（思考：这是不是和 `vue-router` 的路由守卫很类似呢？）。

## jsonwebtoken 使用

我们可以使用常见的 token 来做登录鉴权，可以使用 [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)这个第三方库。

### 安装

我们需要安装 `jsonwebtoken` 这个库以及它对应的 `ts` 类型声明包 `@types/jsonwebtoken`

```shell
pnpm add jsonwebtoken
pnpm add @types/jsonwebtoken -D
```

### 生成 token

```ts
import jwt from "jsonwebtoken";
import { BaseObject } from "models/index.model";

export const SECRET_KEY = "hanshufei_secret_key";

// token 有效期
export const TOKEN_INVALID_TIME = 24 * 60 * 60;

/**
 *
 * @param payload token的载荷
 * @returns {string} token
 * @description 生成token
 */
export function generateToken(payload: BaseObject) {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_INVALID_TIME,
  });
  return token;
}
```

我们生成 token 后就可以在用户登录后发给用户，然后用户可以每次请求的时候带上 token 用来鉴权就好。

### 拦截请求实现

按照前面说的，我们可以自己定义 `handler` 来拦截请求：

```ts
export const authHandler: RequestHandler = (req, res, next) => {
  const token = req.headers[HEADER_TOKEN_KEY.toLowerCase()] as string;
  if (isWhiteList(req.url)) {
    next();
    return;
  }
  if (!token) {
    res.status(RespCode.UNAUTHORIZED).send("Unauthorized");
  } else {
    jwt.verify(token, SECRET_KEY, function (err, decoded) {
      console.log({ decoded, err });
      if (err) {
        res
          .status(RespCode.UNAUTHORIZED)
          .send(new BaseResponse(false, err.message, RespCode.UNAUTHORIZED));
      } else {
        next();
      }
    });
  }
};
```

比如上面的这个 `handler`， 我们可以使用 `jtw.verify` 方法来判断用户传来的 `token` 是否合法，只有携带合法的 `token` 才会进入下一个 handler，如果 token 不合法，就返回 `401` 状态并且返回失败的请求。
我们还可以再一进来的时候先判断白名单（毕竟不是所有的路由都需要权限的）。

## 总结

按照上述的方式，我们就完成了 `express` 搭建的后台应用的登录和接口鉴权操作。
