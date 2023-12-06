import { Router } from "express";
import authService from "../services/auth.service";
import { getTokenFromRequest } from "./handlers";
import cookie from "cookie";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const result = await authService.login(req.body);
  try {
    const cookieResp = cookie.serialize("token", result.data.token, {
      expires: new Date("9999-12-30"),
      sameSite: "none",
      secure: true,
    });
    res.setHeader("Set-Cookie", cookieResp);
  } catch (error) {}
  res.send(result);
});

authRouter.get("/", async (req, res) => {
  const data = await authService.getAllAuthData();
  res.send(data);
});

authRouter.get("/current", async (req, res) => {
  const token = getTokenFromRequest(req);
  const result = await authService.getCurrentInfo(token, req.query.a);
  res.send(result);
});

export default authRouter;
