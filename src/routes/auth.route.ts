import { Router } from "express";
import authService from "../services/auth.service";
import { HEADER_TOKEN_KEY } from "../models/auth.model";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const result = await authService.login(req.body);
  res.send(result);
});

authRouter.get("/", async (req, res) => {
  const data = await authService.getAllAuthData();
  res.send(data);
});

authRouter.get("/current", async (req, res) => {
  const token = req.headers[HEADER_TOKEN_KEY.toLowerCase()] as string;
  console.log(req.cookies);
  const result = await authService.getCurrentInfo(token);
  res.send(result);
});

export default authRouter;
