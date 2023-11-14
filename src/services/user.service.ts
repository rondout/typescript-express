import { UserFactory, BaseUserInfo } from "../models/user.model";
import { UserDao } from "../db/users/user.dao";

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
};

export default userService;
