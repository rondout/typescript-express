import { UserActionInfo } from "../../models/user.model";
import { Schema, model } from "mongoose";
import { PageLink } from "../../models/response.model";
import { PageParamsInterface } from "../../models/db.model";

export const UserActionSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    action: String,
  },
  // { timestamps: { createdAt: true } }
  { timestamps: true }
);

export const userActionModel = model("user_actions", UserActionSchema);

export const UserActionDao = {
  async findUserAction(data: UserActionInfo = {} as UserActionInfo) {
    const actions = await userActionModel.find(data).populate({
      path: "user_id",
      select: "-password",
    });
    return actions;
  },
  async findUserActionList(params: PageParamsInterface) {
    const queryFn = userActionModel
      .find(params.queryArgs)
      .populate("user_id", ["-password"])
      .skip(params.skip)
      .sort({ createdAt: -1 })
      .limit(params.limit);
    const actions = await queryFn;
    const total = await userActionModel.find(params.queryArgs).countDocuments();
    return { actions, total };
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
