import { BaseObject } from "./index.model";
import { MAX_SAFE_PAGE_SIZE, PageLinkInterface } from "./response.model";

export interface PageParamsInterface<T extends BaseObject = BaseObject> extends PageLinkInterface {
  queryArgs: T;
}

export class PageParams<T extends BaseObject = BaseObject> implements PageParamsInterface<T> {
  public page: number = 0;
  public size: number = 0;
  public skip: number = 0;
  public limit: number = 0;
  public queryArgs: T = {} as T;
  constructor(pageLink: PageLinkInterface) {
    this.page = pageLink.page - 1 > 0 ? pageLink.page - 1 : 0;
    this.size = pageLink.size - 0 > 0 ? pageLink.size - 0 : MAX_SAFE_PAGE_SIZE;
    this.skip = this.page * this.size;
    this.limit = this.size;
    Object.entries(pageLink).forEach(([k, v]) => {
      if (["page", "size"].includes(k)) return;
      // @ts-ignore
      this.queryArgs[k] = v;
    });
  }
}
