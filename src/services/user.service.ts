import { UserFactory, BaseUserInfo } from "../models/user.model";
import { UserDao } from "../db/users/user.dao";
import { Authority } from "../models/auth.model";
import { BaseFailureResponse } from "../models/response.model";
import { ErrorCode } from "../models/error.model";

const userService = {
  async getUsers() {
    return UserDao.findUser();
  },
  async insertUser(data: BaseUserInfo) {
    const findResult = await UserDao.findUser({ username: data.username });
    // 这里在插入之前要判断用户名是否已经存在于数据库
    if (findResult?.length > 0) {
      return new BaseFailureResponse(
        ErrorCode.CEATE_USER_EXISTED,
        `user with username ${data.username} already existed in database`
      );
    }
    // 如果数据库没有这个名字的  就可以插入进去了
    return new UserFactory(
      data.username,
      data.age,
      data.gender,
      data.authority || Authority.USER,
      data._id,
      data.password
    ).insertToDb();
  },
  async updateUser(data: BaseUserInfo) {
    return UserDao.updateUser(data);
  },
  async deleteUser(_id: string) {
    return await UserDao.removeUser(_id);
  },
  async deleteUsers(_ids: string[]) {
    return await Promise.all(_ids.map((_id) => this.deleteUser(_id)));
  },
};

export default userService;
