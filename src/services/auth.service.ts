import { LoginParams } from "../models/user.model";
import { LoginResult } from "../models/auth.model";
import { UserDao } from "../db/users/user.dao";
import { generateToken } from "../utils";
import { AuthDao } from "../db/config/auth.dao";
import { BaseResponse } from "../models/response.model";

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
    if (users && users[0]) {
      const { username, age, gender } = users[0];
      const token = generateToken({ username, age, gender });
      return new LoginResult({ token });
    }
    return new LoginResult(null);
  },
  async getAllAuthData() {
    const auths = await AuthDao.queryAuth();
    return new BaseResponse(auths);
  },
};

export default authService;
