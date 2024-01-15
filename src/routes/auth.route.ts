import { Router } from "express";
import authService from "../services/auth.service";
import cookie from "cookie";
import { BaseFailureResponse, BaseResponse } from "../models/response.model";
import { ErrorCode } from "../models/error.model";
import { UserActionController } from "../utils";
import { UserActions } from "../models/user.model";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const result = await authService.login(req);
  try {
    const cookieResp = cookie.serialize("token", result.data.token, {
      maxAge: 2 * 24 * 60 * 60, // 过期时间（单位：秒）为两天
      sameSite: "none",
      secure: true,
    });
    res.setHeader("Set-Cookie", cookieResp);
  } catch (error) {}
  res.send(result);
});

authRouter.get("/logout", async (req, res) => {
  try {
    UserActionController.saveUserAction(req, UserActions.LOG_OUT, true);
    res.clearCookie("token").send(new BaseResponse(true));
  } catch (error) {
    res.send(new BaseFailureResponse(ErrorCode.LOGOUT_RESULT));
  }
});

authRouter.get("/", async (req, res) => {
  const data = await authService.getAllAuthData();
  res.send(data);
});

authRouter.get("/current", async (req, res) => {
  const result = await authService.getCurrentInfo(req);
  res.send(result);
});

export default authRouter;
