import { ObjectId } from "mongoose";

export type Id = string | number | ObjectId;

export interface BaseObject {
  [propName: string]: any;
}

export interface BaseData<T extends Id = string> extends BaseObject {
  _id?: T;
  [key: string]: any;
}
