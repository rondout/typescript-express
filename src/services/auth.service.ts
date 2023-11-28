import { BaseUserInfo, LoginParams } from "../models/user.model";
import { Authority, LoginResult } from "../models/auth.model";
import { UserDao } from "../db/users/user.dao";
import { generateToken, parseUserFromToken } from "../utils";
import { AuthDao } from "../db/config/auth.dao";
import {
  BaseFailureResponse,
  BaseResponse,
  RespCode,
} from "../models/response.model";
import { ErrorCode } from "../models/error.model";

const authService = {
  /**
   *
   * @param data 登录参数
   * @returns {LoginResult} 登录结果
   */
  async login(data: LoginParams): Promise<LoginResult> {
    if (!data.password || !data.username) {
      return new LoginResult(null);
    }
    const users = await UserDao.matchUser(data);
    const user = (users && users[0]) as any as BaseUserInfo;
    if (user) {
      const { username, age, gender, authority = Authority.USER, _id } = user;
      const token = generateToken({ username, age, gender, authority, _id });
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
