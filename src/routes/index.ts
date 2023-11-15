import {
  ErrorRequestHandler,
  Express,
  Handler,
  RequestHandler,
  Router,
} from "express";
import { resolve } from "path";
import userRouter from "./user.route";
import indexRouter from "./index.route";
import authRouter from "./auth.route";
import { HEADER_TOKEN_KEY, isWhiteList } from "../models/auth.model";
import { BaseResponse, RespCode } from "../models/response.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils";
import { version } from "../config/config.json";

export const notFoundHandler: Router = Router().use((req, res) => {
  res.status(404).sendFile(resolve(__dirname, "../../public/404.html"));
});

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

export const registRoute = (app: Express) => {
  app.use(mainHandler);
  app.use(authHandler);
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api", indexRouter);
  app.use("*", notFoundHandler);
  app.use(errorHandler);
};
