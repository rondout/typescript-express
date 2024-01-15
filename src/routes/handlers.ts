import {
  All_AUTHORITY,
  Authority,
  HEADER_TOKEN_KEY,
  TokenParams,
  isWhiteList,
} from "../models/auth.model";
import {
  BaseFailureResponse,
  BaseResponse,
  RespCode,
} from "../models/response.model";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { SECRET_KEY, parseUserFromToken } from "../utils";
import { version } from "../config/config.json";
import {
  ErrorRequestHandler,
  PermissionHandler,
  RequestHandler,
  Router,
  Express,
  Request,
} from "express";
import { resolve } from "path";
import { BaseObject } from "../models/index.model";
import cors from "cors";
import cookie from "cookie";

export const registCors = (app: Express) => {
  app.use(
    // cors({
    //   origin: [
    //     // "http://localhost:3000",
    //     "http://127.0.0.1:3000",
    //     // "http://192.168.31.150:3000",
    //     "http://47.109.68.234:3000",
    //   ],
    //   // origin: "*",
    //   credentials: true,
    // })
    cors({
      origin: new RegExp("^http"),
      // origin(requestOrigin, callback) {
      //   console.log(requestOrigin, callback);
      //   callback(null, true);
      // },
      // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      // preflightContinue: false,
      // optionsSuccessStatus: 204,
      credentials: true,
    })
  );
};

/**
 * @description 404 handler
 */
export const notFoundHandler: Router = Router().use((req, res) => {
  res.status(404).sendFile(resolve(__dirname, "../../public/404.html"));
});

/**
 *
 * @param err
 * @param req
 * @param res
 * @description 错误处理handler
 */
export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res
  //   next
) {
  try {
    res.status(500).send({ err: err.stack });
  } catch (error) {
    console.log({ error });

    res.status(500).send(err);
  }
};

export function getTokenFromRequest(req: Request) {
  try {
    // 这里我们从两个地方获取token  一个是cookie   另一个是header带来的 （因为服务端渲染暂时只能从header里面把cookie带过来）
    const parsedCookie = cookie.parse(req.headers.cookie);
    const token =
      parsedCookie.token ||
      (req.headers[HEADER_TOKEN_KEY.toLowerCase()] as string);
    return token;
  } catch (error) {
    const token = req.headers.token as string;
    return token;
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 * @description 登录认证handler
 */
export const authHandler: RequestHandler = async (req, res, next) => {
  if (isWhiteList(req.url)) {
    console.log("yes");
    next();
    return;
  }
  const token = getTokenFromRequest(req);
  if (!token) {
    res
      .status(RespCode.UNAUTHORIZED)
      .send(
        new BaseResponse(
          { errMsg: "Unauthorized" },
          false,
          RespCode.UNAUTHORIZED
        )
      );
  } else {
    try {
      await parseUserFromToken(token);
      next();
    } catch (error: any) {
      console.log({ error });

      res
        .status(RespCode.UNAUTHORIZED)
        .send(
          new BaseResponse(
            (error as VerifyErrors).message,
            false,
            RespCode.UNAUTHORIZED
          )
        );
    }
  }
};

export const mainHandler: RequestHandler = (req, res, next) => {
  res.setHeader("x-version", version);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
};

declare module "express" {
  interface Query {
    [key: string]: undefined | string | string[] | Query | Query[];
  }
  interface PermissionHandler<
    P = BaseObject,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = Record<string, any>
  > {
    (
      req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
      res: Response<ResBody, Locals>,
      next: NextFunction,
      authorities: Authority[]
    ): void;
  }
}

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
  const token = getTokenFromRequest(req);
  //  req.headers[HEADER_TOKEN_KEY.toLowerCase()] as string;
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
