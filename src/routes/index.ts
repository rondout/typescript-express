import { Express } from "express";
import userRouter from "./user.route";
import indexRouter from "./index.route";
import authRouter from "./auth.route";
import {
  authHandler,
  errorHandler,
  mainHandler,
  notFoundHandler,
} from "./handlers";

export const registRoute = (app: Express) => {
  app.use(mainHandler);
  app.use(authHandler);
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api", indexRouter);
  app.use("*", notFoundHandler);
  app.use(errorHandler);
};
