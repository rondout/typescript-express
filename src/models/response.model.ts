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
    public data: T,
    public success: boolean = true,
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
    // 如果成功删除的数目等于需要删除的数目  则代表全部删除成功了  返回的success就是true 否则返回false
    const success = deleteCount.deletedCount === totalNumber;
    super(deleteCount, success, RespCode.SUCCESS);
  }
  // 递归（迭代）计算一下删除的数目
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
    return new BaseResponse(data, success, code);
  }
}
