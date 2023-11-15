import jwt from "jsonwebtoken";
import { BaseObject } from "../models/index.model";

export const SECRET_KEY = "hanshufei_secret_key";

// token 有效期
export const TOKEN_INVALID_TIME = 24 * 60 * 60;

/**
 *
 * @param payload token的载荷
 * @returns {string} token
 * @description 生成token
 */
export function generateToken(payload: BaseObject) {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_INVALID_TIME,
  });
  return token;
}
