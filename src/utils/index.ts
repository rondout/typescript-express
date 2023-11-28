import jwt from "jsonwebtoken";
import { TokenParams } from "../models/auth.model";

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
