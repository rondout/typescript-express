import { Router } from "express";
import authService from "../services/auth.service";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const result = await authService.login(req.body);
  res.send(result);
});

authRouter.get("/", async (req, res) => {
  const data = await authService.getAllAuthData();
  res.send(data);
});

export default authRouter;
