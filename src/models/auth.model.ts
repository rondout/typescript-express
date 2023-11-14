import { BaseResponse, RespCode } from "./response.model";
import { BaseUserInfo } from "./user.model";

export class LoginResult extends BaseResponse {
  constructor(user: BaseUserInfo) {
    const code = user ? RespCode.SUCCESS : RespCode.FAILED;
    super(!!user, user, code);
  }
}
