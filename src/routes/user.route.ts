import { Router } from "express";
import userService from "../services/user.service";
import { DeleteResponse } from "../models/response.model";
import { PermissionRequire } from "./handlers";
import { Authority } from "../models/auth.model";
const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await userService.getUsers();
  res.send(users);
});

userRouter.post("/", async (req, res) => {
  const result = await userService.insertUser(req.body);
  res.send(result);
});

userRouter.put("/", async (req, res) => {
  const result = await userService.updateUser(req.body);
  res.send(result);
});

userRouter.delete(
  "/:_id",
  PermissionRequire([Authority.ADMIN]),
  async (req, res) => {
    const result = await userService.deleteUsers([req.params._id]);
    res.send(new DeleteResponse(result, 1).response);
  }
);

userRouter.use("/err", async (_, res) => {
  throw new Error("User Router Error ");
});

userRouter.get("/:id", (req, res) => {
  res.json({ messages: "你传的ID是" + req.params.id });
});

export default userRouter;
