import { DeleteResult } from "mongodb";

export enum RespCode {
  SUCCESS = 200,
  FAILED = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  NO_ACCESS = 403,
  SYSTEM_ERROR = 500,
}

export class BaseResponse<T = any> {
  constructor(
    public success: boolean,
    public data: T,
    public code = RespCode.SUCCESS
  ) {}
}

/**
 * @description 删除操作的通用返回体 继承自基本通用返回体
 */
export class DeleteResponse extends BaseResponse<{ deletedCount: number }> {
  constructor(
    deleteResult: DeleteResult | DeleteResult[],
    totalNumber: number
  ) {
    const deleteCount = DeleteResponse.calcDeleteCount(deleteResult);
    const success = deleteCount.deletedCount === totalNumber;
    super(success, deleteCount, RespCode.SUCCESS);
  }

  private static calcDeleteCount(deleteResult: DeleteResult | DeleteResult[]) {
    if (deleteResult instanceof Array) {
      const deletedCount = deleteResult.reduce((prev, current) => {
        return prev + current.deletedCount;
      }, 0);
      return { deletedCount };
    } else {
      return { deletedCount: deleteResult.deletedCount };
    }
  }

  /**
   * @returns {BaseResponse} 最终的返回数据
   */
  public get response(): BaseResponse {
    const { success, data, code } = this;
    return new BaseResponse(success, data, code);
  }
}
