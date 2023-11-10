import { ObjectId } from "mongoose";

export type Id = string | number | ObjectId;

export interface BaseData<T extends Id = string> {
  _id?: T;
  [key: string]: any;
}
