import { UserActionInfo } from "../../models/user.model";
import { Schema, model } from "mongoose";
import { BaseObject } from "../../models/index.model";
import { ObjectId, Timestamp } from "mongodb";
import { BaseResponse } from "models/response.model";

export const UserActionSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    action: String,
    // date: Date,
  },
  // { timestamps: { createdAt: true } }
  { timestamps: true }
);

export const userActionModel = model("user_actions", UserActionSchema);

export const UserActionDao = {
  async findUserAction(data: UserActionInfo = {} as UserActionInfo) {
    const action = await userActionModel.find(data).populate({
      path: "user_id",
      select: "-password",
    });
    return new BaseResponse();
  },
  async insertUserAction(action: UserActionInfo) {
    const result = await userActionModel.insertMany([action]);
    return result;
  },
  async updateUserAction(action: UserActionInfo) {
    const result = await userActionModel.updateOne({ _id: action._id }, action);
    return result;
  },
  async removeUserAction(_id: string) {
    const result = await userActionModel.deleteOne({ _id });
    return result;
  },
};
