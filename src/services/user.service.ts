import { UserFactory, BaseUserInfo } from "../models/user.model";
import { UserDao } from "../db/users/user.dao";

const userService = {
  async getUsers() {
    return UserDao.findUser();
  },
  async insertUser(data: BaseUserInfo) {
    console.log({ data });

    return new UserFactory(
      data.username,
      data.age,
      data.gender,
      data._id,
      data.password
    ).insertToDb();
  },
};

export default userService;
