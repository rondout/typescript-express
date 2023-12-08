import { ObjectId } from "mongoose";
import mongodb from "mongodb";

export type Id = string | number | ObjectId | mongodb.ObjectId;

export interface BaseObject {
  [propName: string]: any;
}

export interface BaseData<T extends Id = Id> extends BaseObject {
  _id?: T;
  [key: string]: any;
}
