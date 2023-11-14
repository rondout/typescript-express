import { Router } from "express";
import userService from "../services/user.service";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const result = await userService.login(req.body);
  res.send(result);
});

export default authRouter;
