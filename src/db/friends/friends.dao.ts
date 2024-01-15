import { Schema, model } from "mongoose";
import { Id } from "../../models/index.model";
import { PageParams } from "../../models/db.model";

export const FriendsSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "users" },
    to: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true, versionKey: false }
);

export const friendsModel = model("friends", FriendsSchema);

export const friendsDao = {
  async findAllFriends(params: { id: Id }) {
    return friendsModel.find({ $or: [{ from: params.id }, { to: params.id }] });
  },
  async findAllFriendByPage(params: PageParams<{ id: Id }>) {
    return friendsModel.find({ from: params.queryArgs.id });
  },
};
