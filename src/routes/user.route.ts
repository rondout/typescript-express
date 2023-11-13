import { Router } from "express";
import userService from "../services/user.service";
import { send } from "process";
import { userModel } from "../db/users/user.dao";
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

userRouter.put("/", async (req, res) => {
  // try {
  const result = await userService.updateUser(req.body);
  res.send(result);
  // } catch (error) {
  //   console.log("ERRORED");
  // }
  //   .catch((err) => {
  //     res.send(err);
  //     throw new Error(err);
  //   });
});

userRouter.use("/err", async (_, res) => {
  throw new Error("User Router Error ");
});

userRouter.get("/:id", (req, res) => {
  res.json({ messages: "你传的ID是" + req.params.id });
});

export default userRouter;
