import { UserActionDao } from "../db/userActions/userActions.dao";
import { UserActionInfo } from "../models/user.model";
import {
  BaseResponse,
  PageLink,
  TableDataResponse,
  PageLinkInterface,
  BaseFailureResponse,
  RespCode,
} from "../models/response.model";
import { Id } from "../models/index.model";
import { ErrorCode } from "../models/error.model";
import { PageParams, PageParamsInterface } from "../models/db.model";

const userActionService = {
  async saveAction(action: UserActionInfo) {
    const result = await UserActionDao.insertUserAction(action);
    return new BaseResponse(true);
  },
  async getActions(action: UserActionInfo = {}, currentUserId: Id) {
    if (action.user_id) {
      const result = await UserActionDao.findUserAction(action);
      return new BaseResponse(result);
    }
    return await this.getOwnActions(action, currentUserId);
  },
  async getActionsByPageLink(
    params: PageLinkInterface = new PageLink(),
    currentUserId: Id
  ) {
    if (!params.user_id) {
      params.user_id = currentUserId;
    }
    const pageParams: PageParamsInterface = new PageParams(params);
    try {
      const data = await UserActionDao.findUserActionList(pageParams);
      return new TableDataResponse(
        pageParams.page,
        pageParams.size,
        data.total,
        data.actions
      );
    } catch (error) {
      return new BaseFailureResponse(
        ErrorCode.SERVER_ERROR,
        error?.toString(),
        RespCode.SYSTEM_ERROR
      );
    }
  },
  async getOwnActions(action: UserActionInfo = {}, currentUserId: Id) {
    const result = await UserActionDao.findUserAction({
      ...action,
      user_id: currentUserId,
    });
    return new BaseResponse(result);
  },
};

export default userActionService;
