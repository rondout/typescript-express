import { Router } from "express";
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("Hellow World!");
});

indexRouter.get("/:id", (req, res) => {
  res.send("你传的ID是" + req.params.id);
});

export default indexRouter;
