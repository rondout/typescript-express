import { UserDao } from "../db/users/user.dao";
import { Authority } from "./auth.model";
import { BaseData, BaseObject, Id } from "./index.model";

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface BaseUserInfo extends BaseData<Id> {
  username?: string;
  password?: string;
  age?: number;
  gender?: UserGender;
  authority?: Authority;
}

export class UserFactory implements BaseUserInfo {
  constructor(
    public username: string,
    public age: number,
    public gender: UserGender,
    public authority: Authority,
    public _id?: Id,
    public password?: string
  ) {}

  public get userInfo(): BaseUserInfo {
    const { username, password, age, gender, _id = null, authority } = this;
    return { username, password, age, gender, _id, authority };
  }

  public async insertToDb() {
    try {
      const insertResult = await UserDao.insertUser(this.userInfo);
      console.log("user插入到数据库成功", insertResult);
    } catch (error) {
      console.log("插入用户失败", this.userInfo, error);
    }
  }
}

export interface LoginParams extends BaseObject {
  username: string;
  password: string;
}

// 用户动态枚举
export enum UserActions {
  PUBLIC_ARTICLE = "PUBLIC_ARTICLE",
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
  LOG_OUT = "LOG_OUT",
}
// 用户action 数据结构
export interface UserActionInfo extends BaseData {
  action?: UserActions;
  success?: boolean;
  user_id?: Id;
}

export class UserActionFactory implements UserActionInfo {
  constructor(
    public action: UserActions,
    public success = true,
    public user_id: Id
  ) {}
}
