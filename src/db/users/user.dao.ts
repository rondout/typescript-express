import { BaseUserInfo } from "../../models/user.model";
import { Schema, model } from "mongoose";

export const UserSchema = new Schema({
  username: { type: String, require: true },
  password: String,
  age: Number,
  gender: String,
});

export const userModel = model("users", UserSchema);

export class UserDao {
  static findUser = async () => {
    const user = await userModel.find({});
    return user;
  };
  public static insertUser = async (user: BaseUserInfo) => {
    const result = await userModel.insertMany([user]);
    return result;
  };
}
