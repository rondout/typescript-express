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
};

export default userService;
