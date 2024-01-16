import { Schema, model } from "mongoose";
import { Id } from "../../models/index.model";
import { PageParams } from "../../models/db.model";
import { FriendsRelationInfo } from "../../models/friends.model";

export const FriendsSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "users" },
    to: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true, versionKey: false }
);

export const friendsModel = model<FriendsRelationInfo>(
  "friends",
  FriendsSchema
);

export const friendsDao = {
  // 通过Id获取所有的朋友关系
  async findAllFriends(_id: Id) {
    return friendsModel
      .find({ $or: [{ from: _id }, { to: _id }] })
      .populate({
        path: "from",
        select: ["username", "age", "gender", "authority"],
      })
      .populate({
        path: "to",
        select: ["username", "age", "gender", "authority"],
      });
  },
  // 通过Id 分页 获取所有的朋友关系
  async findAllFriendByPage(params: PageParams<{ id: Id }>) {
    return friendsModel.find({ from: params.queryArgs.id });
  },
  // 创建朋友关系
  async insertFriend(params: FriendsRelationInfo[]) {
    return friendsModel.insertMany(params);
  },
};
