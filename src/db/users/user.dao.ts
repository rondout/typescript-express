import { BaseUserInfo } from "../../models/user.model";
import { Schema, model } from "mongoose";
import { BaseObject } from "../../models/index.model";

export const UserSchema = new Schema(
  {
    username: { type: String, require: true },
    password: String,
    age: Number,
    gender: String,
    authority: String,
  },
  { timestamps: true }
);

export const userModel = model("users", UserSchema);

export const UserDao = {
  async findUser(data: BaseUserInfo = {} as BaseUserInfo) {
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
};
