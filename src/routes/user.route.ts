import { Router } from "express";
import userService from "../services/user.service";
const userRouter = Router();

userRouter.get("/", async (req, res) => {
  // res.send("get users");
  const users = await userService.getUsers();
  res.send(users);
});

userRouter.post("/", async (req, res) => {
  const result = await userService.insertUser(req.body);
  res.send(result);
});

userRouter.use("/err", (_, res) => {
  throw new Error("User Router Error");
});

userRouter.get("/:id", (req, res) => {
  res.json({ messages: "你传的ID是" + req.params.id });
});

export default userRouter;
