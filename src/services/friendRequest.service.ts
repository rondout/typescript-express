import { friendRequestDao } from "../db/friends/friendRequest.dao";
import { MakeFriendsRequestParams } from "../models/friends.model";
import { Id } from "../models/index.model";
import { BaseResponse } from "../models/response.model";

const friendRequestService = {
  // 查询所有的请求（ADMIN）
  async findAllRequest() {
    const data = await friendRequestDao.findAllFriendRequest();
    return new BaseResponse(data);
  },
  // 查询自己发起的
  async findOwnRequest(params: { from: Id }) {
    const result = await friendRequestDao.findRequestByParams(params);
    return new BaseResponse(result);
  },
  // 查询别人添加自己的请求
  async findRequestToMe(params: { to: Id }) {
    const result = await friendRequestDao.findRequestByParams(params);
    return new BaseResponse(result);
  },
  // 查询别人添加自己的请求或者自己创建的请求
  async findRequestAboutMe(params: { id: Id }) {
    const result = await friendRequestDao.findRequestAboutUserId(params);
    return new BaseResponse(result);
  },
  // 创建
  async postFriendRequest(params: MakeFriendsRequestParams) {
    await friendRequestDao.insertRequest(params);
    return new BaseResponse("success");
  },
};

export default friendRequestService;
