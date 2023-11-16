import {
  All_AUTHORITY,
  Authority,
  HEADER_TOKEN_KEY,
  TokenParams,
  isWhiteList,
} from "../models/auth.model";
import { BaseResponse, RespCode } from "../models/response.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils";
import { version } from "../config/config.json";
import {
  ErrorRequestHandler,
  PermissionHandler,
  RequestHandler,
  Router,
} from "express";
import { resolve } from "path";
import { BaseObject } from "models/index.model";

export const notFoundHandler: Router = Router().use((req, res) => {
  res.status(404).sendFile(resolve(__dirname, "../../public/404.html"));
});

export const errorHandler: ErrorRequestHandler = function (
  err,
  req,
  res
  //   next
) {
  try {
    res.status(500).send({ err: err.stack });
  } catch (error) {
    res.status(500).send(err);
  }
};

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
      if (err) {
        res
          .status(RespCode.UNAUTHORIZED)
          .send(new BaseResponse(err.message, false, RespCode.UNAUTHORIZED));
      } else {
        next();
      }
    });
  }
};

export const mainHandler: RequestHandler = (req, res, next) => {
  res.setHeader("x-version", version);
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

/**
 *
 * @param {Authority[]} authorities 该接口需要的权限
 * @returns {RequestHandler} 返回express的handler
 */
export const PermissionRequire = (
  authorities: Authority[] = All_AUTHORITY
): RequestHandler => {
  const handler: RequestHandler = (req, _res, next) =>
    permissionHandler(req, _res, next, authorities);
  return handler;
};
