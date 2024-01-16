import { friendRequestDao } from "../db/friends/friendRequest.dao";
import { ErrorCode } from "../models/error.model";
import {
  MakeFriendsRequestParams,
  HandleFriendsRequestParams,
} from "../models/friends.model";
import { Id } from "../models/index.model";
import { BaseFailureResponse, BaseResponse } from "../models/response.model";
import friendsService from "./friends.service";

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
  // 通过Id获取
  async getRequestById(_id: Id) {
    return await friendRequestDao.findRequestById(_id);
  },
  // 处理好友申请
  async handleRequest(params: HandleFriendsRequestParams) {
    try {
      await friendRequestDao.updateRequest({
        ...params,
        done: true,
      });
      // 如果接受了请求  就应该在数据库里存下这条朋友关系数据
      if (params.accept) {
        const relationData = await this.getRequestById(params._id);
        const { to, from, _id } = relationData;
        await friendsService.insertFriend({ to, from, _id });
      }
      return new BaseResponse(true);
    } catch (error) {
      console.log(error)
      return new BaseFailureResponse(ErrorCode.SERVER_ERROR, error?.toString());
    }
  },
};

export default friendRequestService;
