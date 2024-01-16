import { friendsDao } from "../db/friends/friends.dao";
import {
  FriendsListFactory,
  FriendsRelationInfo,
  FriendsRelationPopulatedInfo,
} from "../models/friends.model";
import { BaseResponse } from "../models/response.model";
import { Id } from "../models/index.model";
import authService from "./auth.service";
import { Request } from "express";
import { UserDao } from "../db/users/user.dao";

const friendsService = {
  // 获取所有的朋友
  async getAllFriends(req: Request) {
    const currentUser = await authService.getCurrentInfo(req);
    const data = await friendsDao.findAllFriends(currentUser.data._id);
    // data[0].$clone
    return new BaseResponse(
      data.map(
        (v) =>
          new FriendsListFactory(
            v as any as FriendsRelationPopulatedInfo,
            currentUser.data._id
          )
      )
    );
  },
  // 插入朋友关系
  async insertFriend(friendRelation: FriendsRelationInfo) {
    return await friendsDao.insertFriend([friendRelation]);
  },
  // 获取某个朋友详情
  async getFriendDetailById(_id: Id) {
    const data =  await UserDao.findById(_id);
    // return new BaseResponse(new FriendsListFactory(data))  
    return new BaseResponse(data)  
  },
};

export default friendsService;
