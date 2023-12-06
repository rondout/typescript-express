import { UserActionDao } from "../db/userActions/userActions.dao";
import { UserActionInfo } from "../models/user.model";
import { BaseResponse } from "../models/response.model";
import { Id } from "../models/index.model";

const userActionService = {
  async saveAction(action: UserActionInfo) {
    const result = await UserActionDao.insertUserAction(action);
    // if()
    return new BaseResponse(true);
  },
  async getActions(action: UserActionInfo = {}, currentUserId: Id) {
    if (action.user_id) {
      const result = await UserActionDao.findUserAction(action);
      return new BaseResponse(result);
    }
    return await this.getOwnActions(action, currentUserId);
  },
  async getOwnActions(action: UserActionInfo = {}, currentUserId: Id) {
    const result = await UserActionDao.findUserAction({
      ...action,
      _id: currentUserId,
    });
    return new BaseResponse(result);
  },
};

export default userActionService;
