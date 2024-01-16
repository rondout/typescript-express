import { BaseUserInfo } from "../../models/user.model";
import { Schema, model } from "mongoose";
import { BaseObject, Id } from "../../models/index.model";

export const UserSchema = new Schema(
  {
    // 用户名
    username: { type: String, require: true },
    // 密码
    password: String,
    // 年龄
    age: Number,
    // 性别
    gender: String,
    // 权限角色
    authority: String,
  },
  // 数据库日期记录
  { timestamps: true }
);

export const userModel = model<BaseUserInfo>("users", UserSchema);

export const UserDao = {
  async findUser(data: BaseUserInfo = {} as BaseUserInfo) {
    // 查询的时候肯定不能查询出密码字段的  需要过滤掉
    const user = await userModel.find(data).select(["-password"]);
    return user;
  },
  async insertUser(user: BaseUserInfo) {
    const result = await userModel.insertMany([user]);
    return result;
  },
  async updateUser(user: BaseUserInfo) {
    const result = await userModel.updateOne({ _id: user._id }, user);
    return result;
  },
  async removeUser(_id: string) {
    const result = await userModel.deleteOne({ _id });
    return result;
  },
  async matchUser<T extends BaseObject = any>(query: T) {
    return await userModel.find(query);
  },
  async findById(_id: Id) {
    return await userModel.findById(_id);
  },
};
