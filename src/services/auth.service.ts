import {
  BaseUserInfo,
  LoginParams,
  UserActionFactory,
  UserActions,
} from "../models/user.model";
import { Authority, LoginResult } from "../models/auth.model";
import { UserDao } from "../db/users/user.dao";
import {
  UserActionController,
  generateToken,
  parseUserFromToken,
} from "../utils";
import { AuthDao } from "../db/config/auth.dao";
import { BaseFailureResponse, BaseResponse } from "../models/response.model";
import { ErrorCode } from "../models/error.model";
import { Request } from "express";

const authService = {
  /**
   *
   * @param data 登录参数
   * @returns {LoginResult} 登录结果
   */
  async login(req: Request): Promise<LoginResult> {
    const data: LoginParams = req.body;
    if (!data.password || !data.username) {
      return new LoginResult(null);
    }
    const users = await UserDao.matchUser(data);
    const user = (users && users[0]) as any as BaseUserInfo;
    console.log("登录用户", user);

    if (user) {
      const { username, age, gender, authority = Authority.USER, _id } = user;
      const token = generateToken({ username, age, gender, authority, _id });
      // 记录用户的登录操作到数据库
      UserActionController.saveUserAction(req, UserActions.LOGIN, true, user);
      return new LoginResult({ token });
    }
    return new BaseFailureResponse(
      ErrorCode.LOGIN_RESULT,
      "Invalid username or password"
    );
  },
  async getAllAuthData() {
    const auths = await AuthDao.queryAuth();
    return new BaseResponse(auths);
  },
  async getCurrentInfo(token: string) {
    try {
      const tokenInfo = await parseUserFromToken(token);
      const users = await UserDao.findUser({ _id: tokenInfo._id });
      const user = users && users[0];
      if (user) {
        return new BaseResponse(user);
      }
      throw new Error();
    } catch (error) {
      return new BaseFailureResponse(
        ErrorCode.SERVER_ERROR,
        "get user info failed"
      );
    }
  },
};

export default authService;
