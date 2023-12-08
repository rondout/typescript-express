import { DeleteResult } from "mongodb";
import { ErrorCode } from "./error.model";
import { BaseData, Id } from "./index.model";

export const MAX_SAFE_PAGE_SIZE = 2147483647;

// 分页查询参数
export interface PageLinkInterface {
  page: number;
  size: number;
  [propName: string]: any;
}

// 分页查询类
export class PageLink<T extends Record<string, any> = Record<string, any>>
  implements PageLinkInterface
{
  constructor(
    public page: number = 1,
    public size: number = MAX_SAFE_PAGE_SIZE,
    rest?: T
  ) {
    try {
      // 如果有传入其它参数  也挂载为实例的属性
      if (rest && typeof rest === "object")
        Object.entries(rest).forEach(([key, value]) => {
          this[key] = value === value;
        });
    } catch (error) {}
  }

  public resetPage(page = 1) {
    this.page = page;
  }
}

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
 * @description 失败的业务返回格式
 */
export class BaseFailureResponse extends BaseResponse<{
  errCode: ErrorCode;
  errMsg: string;
}> {
  constructor(errCode: ErrorCode, errMsg?: string, respCode = RespCode.FAILED) {
    super({ errCode, errMsg }, false, respCode);
  }
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

export interface TableListData<T extends BaseData<Id>> {
  current: number;
  size: number;
  total: number;
  records: T[];
}
export class TableDataResponse<
  T extends BaseData = BaseData
> extends BaseResponse<TableListData<T>> {
  constructor(
    current: number,
    size: number,
    total: number,
    records: T[],
    public success: boolean = true,
    public code = RespCode.SUCCESS
  ) {
    super({ current: current + 1, size, total, records }, success, code);
  }
}
