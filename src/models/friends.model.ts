import { BaseTimeData, Id } from "./index.model";

export interface FriendRequestInfo extends BaseTimeData {
  from: string;
  to: string;
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
