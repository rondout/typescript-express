import { UserFactory, BaseUserInfo, LoginParams } from "../models/user.model";
import { UserDao } from "../db/users/user.dao";
import { LoginResult } from "../models/auth.model";

const userService = {
  async getUsers() {
    return UserDao.findUser();
  },
  async insertUser(data: BaseUserInfo) {
    return new UserFactory(
      data.username,
      data.age,
      data.gender,
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
  async login(data: LoginParams) {
    if (!data.password || !data.username) {
      return new LoginResult(null);
    }
    const users = await UserDao.matchUser(data);
    console.log({ users });

    if (users && users[0]) {
      // @ts-ignore
      return new LoginResult(users[0]);
    }
    return new LoginResult(null);
  },
};

export default userService;
