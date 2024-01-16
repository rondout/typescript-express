import { Schema, model } from "mongoose";
import { Id, BaseData } from "../../models/index.model";
import { PageParams } from "../../models/db.model";
import {
  FriendRequestInfo,
  MakeFriendsRequestParams,
} from "../../models/friends.model";

export const FriendRequestSchema = new Schema(
  {
    // 发起者
    from: { type: Schema.Types.ObjectId, ref: "users" },
    // 添加谁为好友
    to: { type: Schema.Types.ObjectId, ref: "users" },
    // 是否被接受
    accept: { type: Boolean, default: false },
    // 是否完成
    done: { type: Boolean, default: false },
    // 附加信息
    msg: String,
  },
  { timestamps: true, versionKey: false }
);

export const friendRequestModel = model<FriendRequestInfo>(
  "friend_requests",
  FriendRequestSchema
);

// export interface

export const friendRequestDao = {
  async findRequestById(_id: Id) {
    return await friendRequestModel.findById(_id);
  },
  async findAllFriendRequest() {
    // return friendRequestModel.find({
    //   $or: [{ from: params?.from }, { to: params?.to }],
    // });
    return await friendRequestModel.find().populate({
      path: "from",
      select: ["username", "age", "gender", "authority"],
    });
  },
  async findRequestByParams<T = any>(params: T) {
    return await friendRequestModel.find(params).populate({
      path: "from",
      select: ["username", "age", "gender", "authority"],
    });
  },
  // 查询跟某用户相关联的请求
  async findRequestAboutUserId(params: { id: Id }) {
    return await friendRequestModel
      .find({
        $or: [{ to: params.id }, { from: params.id }],
      })
      .populate({
        path: "from",
        select: ["username", "age", "gender", "authority"],
      })
      .populate({
        path: "to",
        select: ["username", "age", "gender", "authority"],
      });
  },
  async findAllFriendByPage(params: PageParams<{ id: Id }>) {
    return await friendRequestModel.find({ from: params.queryArgs.id });
  },
  // 创建申请
  async insertRequest(params: MakeFriendsRequestParams) {
    return await friendRequestModel.insertMany([params]);
  },
  // 修改
  async updateRequest(params: BaseData) {
    return await friendRequestModel.updateOne({_id:params._id}, params);
  },
};
