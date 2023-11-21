import { UserDao } from "../db/users/user.dao";
import { Authority } from "./auth.model";
import { BaseData, BaseObject, Id } from "./index.model";

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface BaseUserInfo extends BaseData<Id> {
  username: string;
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
    const { username, password, age, gender, _id, authority } = this;
    return { username, password, age, gender, _id, authority };
  }

  public async insertToDb() {
    const insertResult = await UserDao.insertUser(this.userInfo);
    console.log("user插入到数据库成功", insertResult);
  }
}

export interface LoginParams extends BaseObject {
  username: string;
  password: string;
}
