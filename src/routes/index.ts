import { Express, Router } from "express";
import { resolve } from "path";
import userRouter from "./user.route";
import indexRouter from "./index.route";

export const notFoundHandler: Router = Router().use((req, res) => {
  res.status(404).sendFile(resolve(__dirname, "../../public/404.html"));
});

// @ts-ignore
export const errorHandler = function (err, req, res, next) {
  try {
    res.status(501).send({ err: err.stack });
  } catch (error) {
    res.status(501).send(err);
  }
};

export const registRoute = (app: Express) => {
  app.use("/api/user", userRouter);
  app.use("/api", indexRouter);
  app.use("*", notFoundHandler);
  app.use(errorHandler);
};
