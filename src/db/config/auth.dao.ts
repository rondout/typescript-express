import { Schema, model } from "mongoose";
import { AuthConfigInfo } from "../../models/auth.model";

export const AuthSchema = new Schema({
  route: { type: String, require: true },
  authorities: { type: Array<String>, require: true },
});

export const authConfigModel = model("auth_config", AuthSchema);

export const AuthDao = {
  async queryAuth(query?: AuthConfigInfo) {
    const user = await authConfigModel.find(query);
    return user;
  },
  async insertAuth(authInfo: AuthConfigInfo) {
    const result = await authConfigModel.insertMany([authInfo]);
    return result;
  },
};
