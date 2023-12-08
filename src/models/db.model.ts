import { BaseObject } from "./index.model";
import { MAX_SAFE_PAGE_SIZE, PageLinkInterface } from "./response.model";

export interface PageParamsInterface extends PageLinkInterface {
  queryArgs: BaseObject;
}

export class PageParams implements PageParamsInterface {
  public page: number = 0;
  public size: number = 0;
  public skip: number = 0;
  public limit: number = 0;
  public queryArgs: BaseObject = {};
  constructor(pageLink: PageLinkInterface) {
    this.page = pageLink.page - 1 > 0 ? pageLink.page - 1 : 0;
    this.size = pageLink.size - 0 > 0 ? pageLink.size - 0 : MAX_SAFE_PAGE_SIZE;
    this.skip = this.page * this.size;
    this.limit = this.size;
    Object.entries(pageLink).forEach(([k, v]) => {
      if (["page", "size"].includes(k)) return;
      this.queryArgs[k] = v;
    });
  }
}
