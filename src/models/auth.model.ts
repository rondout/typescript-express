import authService from "../services/auth.service";
import { BaseData, Id } from "./index.model";
import { BaseResponse, RespCode } from "./response.model";
import { UserGender } from "./user.model";

export const HEADER_TOKEN_KEY = "Authorization";

export interface AuthConfigInfo extends BaseData<Id> {
  route: string;
  authorities?: Authority[];
}

export class LoginResult<T = any> extends BaseResponse<T> {
  constructor(data: T) {
    const code = data ? RespCode.SUCCESS : RespCode.FAILED;
    super(data, !!data, code);
  }
}

export const WHITE_LIST_ROUTES = ["/api/auth/login"];

export const isWhiteList = (route: string) => {
  // 应该用path-to-regexp来匹配路由才对，后续加上
  return WHITE_LIST_ROUTES.includes(route);
};

// 权限枚举
export enum Authority {
  // 管理员
  ADMIN = "ADMIN",
  // 用户
  USER = "USER",
}

export const All_AUTHORITY = [Authority.ADMIN, Authority.USER];

export interface TokenParams {
  username: string;
  age: number;
  gender: UserGender;
  authority: Authority;
}
/**
 * @param {boolean} initFinish 表示是否初始化完成，一般来说，应用已启动就需要把auth配置从数据库读取到内存，以避免重复读取数据库带来的性能问题
 * @description 路由权限管理
 */

export class AuthConfig {
  public authRouteMap = new Map<string, Authority[]>([]);
  public initFinish = false;
  // 这边准备把权限和接口的映射存在数据库里面
  constructor() {
    this.init();
  }

  private async init() {
    this.initFinish = false;
    await this.getAuthConfig();
    this.initFinish = true;
  }

  public async getAuthConfig() {
    const authList = await authService.getAllAuthData();
    authList.data.forEach((auth) => {
      this.authRouteMap.set(auth.route, auth.authorities);
    });
  }
}
