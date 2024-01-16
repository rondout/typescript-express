import { Authority } from "./auth.model";
import { BaseData, BaseTimeData, Id } from "./index.model";
import { BaseUserInfo, UserGender } from "./user.model";

export interface FriendRequestInfo extends BaseTimeData {
  from: Id;
  to: Id;
  accept: boolean;
  done: boolean;
  msg?: string;
}

// 添加好友的请求体信息
export interface MakeFriendsRequestParams {
  from: Id;
  to: Id;
  msg?: string;
}

// 处理好友申请的请求体格式
export interface HandleFriendsRequestParams extends BaseData {
  accept: boolean;
}

// 朋友关系数据结构信息
export interface FriendsRelationInfo extends BaseData {
  from: Id;
  to: Id;
}

export interface FriendsRelationPopulatedInfo extends BaseData {
  from: BaseUserInfo;
  to: BaseUserInfo;
}

export interface FriendsRequestItem extends BaseData, BaseUserInfo {
  // userInfo: BaseUserInfo;
  createdAt: string;
  userId: Id;
}

// 将数据库查到的朋友信息转换为接口发送的数据格式
export class FriendsListFactory implements FriendsRequestItem {
  // public userInfo: BaseUserInfo;
  public createdAt: string;
  public _id?: Id;
  public userId: Id;
  public username?: string;
  public age?: number;
  public gender?: UserGender;
  public authority?: Authority;
  constructor(friendRelation: FriendsRelationPopulatedInfo, currentUserId: Id) {
    let userInfo: BaseUserInfo;
    if (friendRelation.to._id.toString() === currentUserId.toString()) {
      userInfo = friendRelation.from;
    } else {
      userInfo = friendRelation.to;
    }
    this.username = userInfo.username;
    this.userId = userInfo._id;
    this.age = userInfo.age;
    this.gender = userInfo.gender;
    this.authority = userInfo.authority;
    this.createdAt = friendRelation.createdAt;
    this._id = friendRelation._id;
  }
}
