import { DB_PATH } from "../models/config.model";
import mongoose, { Mongoose } from "mongoose";
import { UserDao } from "./users/user.dao";
import { UserFactory, UserGender } from "../models/user.model";

export class DbConnection {
  public mongoose: Mongoose;
  constructor(private dbPath = DB_PATH) {
    this.init();
  }

  private async init() {
    try {
      await this.connectDb();
      await this.checkDefaultUser();
    } catch (error) {}
  }

  private async connectDb() {
    try {
      this.mongoose = await mongoose.connect(this.dbPath);
      console.log("数据库连接成功");
    } catch (err) {
      try {
        console.log("数据库连接失败", err?.toString());
      } catch (error) {
        console.log("数据库连接失败", err);
      }
    }
  }

  private async checkDefaultUser() {
    const findUserResult = await UserDao.findUser();
    if (!findUserResult?.length) {
      // 如果没有初始化用户，就需要添加初始化用户
      new UserFactory(
        "root",
        18,
        UserGender.MALE,
        undefined,
        "123"
      ).insertToDb();
    }
  }
}
