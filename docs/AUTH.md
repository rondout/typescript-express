# express 登录鉴权以及不同级别的权限控制

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

## 不同级别的权限控制

通过上面的内容，我们现在可以实现接口的登录拦截，但是如果我们系统中的不同操作需要涉及到不同级别的权限，我们就需要更加精细的去控制每个接口的权限级别，然而如果我们在每个接口的业务逻辑里面去重复的写判断权限的逻辑是非常繁琐且不好统一控制的。因此，同样的，利用 `express` 的 `handler`，我们可以在每个需要特殊控制权限接口的路由里面增加一个`handler`，比如下面的这个例子：

```ts
userRouter.delete(
  "/:_id",
  PermissionRequire(Authority.ADMIN),
  async (req, res) => {
    const result = await userService.deleteUsers([req.params._id]);
    res.send(new DeleteResponse(result, 1).response);
  }
);
```

**注意：PermissionRequire 方法这里的参数是通过剩余参数（...rest）的方式接受的，因此这里并非传入数组而是依次传入就好**

在上面这个接口中，我们可以看出这应该是一个删除用户的操作，在这个系统中，删除用户是一个敏感且需要高级别权限的操作，因此我们通过加入 `PermissionRequire`这个方法返回的 `handler` 并传入需要的权限的列表，来控制该接口，我们再这个 handler 里面去统一做权限判断的逻辑，以及统一处理权限不足的错误。该方法和对应返回的`handler`示例如下：

```ts
// PermissionRequire 方法
/**
 *
 * @param {Authority[]} authorities 该接口需要的权限，默认（不传或传undefined）是全部用户
 * @returns {RequestHandler} 返回express的handler
 */
export const PermissionRequire = (
  ...authorities: Authority[]
): RequestHandler => {
  const handler: RequestHandler = (req, _res, next) =>
    permissionHandler(req, _res, next, authorities);
  return handler;
};
```

下面是 handler 的具体实现：

```ts
/**
 *
 * @param {Authority[]} authorities 该接口需要的权限，默认是全部用户
 * @description 权限控制handler
 */
export const permissionHandler: PermissionHandler = (
  req,
  res,
  next,
  authorities = All_AUTHORITY
) => {
  const token = req.headers[HEADER_TOKEN_KEY.toLowerCase()] as string;
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    const tokenParams = decoded as TokenParams;
    if (authorities.includes(tokenParams.authority)) {
      next();
    } else {
      res
        .status(RespCode.NO_ACCESS)
        .send(new BaseResponse("No access", false, RespCode.NO_ACCESS));
    }
  });
};
```

## 总结

按照上述的方式，我们就完成了 `express` 搭建的后台应用的登录和接口鉴权操作，以及做到了接口级别的权限控制。
