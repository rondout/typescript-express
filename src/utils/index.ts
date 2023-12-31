import jwt from "jsonwebtoken";
import { TokenParams } from "../models/auth.model";
import { Request } from "express";
import {
  BaseUserInfo,
  UserActionFactory,
  UserActions,
} from "../models/user.model";
import { getTokenFromRequest } from "../routes/handlers";
import userActionService from "../services/userAction.service";

export const SECRET_KEY = "hanshufei_secret_key";

// token 有效期
export const TOKEN_INVALID_TIME = 24 * 60 * 60;

/**
 *
 * @param payload token的载荷
 * @returns {string} token
 * @description 生成token
 */
export function generateToken(payload: TokenParams): string {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_INVALID_TIME,
  });
  return token;
}

export function parseUserFromToken(token: string): Promise<TokenParams> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as TokenParams);
      }
    });
  });
}

// 处理用户操作
export class UserActionController {
  public static async saveUserAction(
    req: Request,
    action: UserActions,
    success = true,
    user?: BaseUserInfo
  ) {
    try {
      const token = getTokenFromRequest(req);
      console.log("保存用户操作", token, req.headers.cookie, req.headers.token);
      if (!user) {
        try {
          user = await parseUserFromToken(token);
        } catch (error) {}
      }
      return await userActionService.saveAction(
        new UserActionFactory(action, success, user?._id)
      );
    } catch (error) {
      console.log("保存用户操作失败", error);
    }
  }
}
