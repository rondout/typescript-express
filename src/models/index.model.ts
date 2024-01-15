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

export interface BaseTimeData<T extends Id = Id> extends BaseData<T> {
  createdAt?: Date;
  updatedAt?: Date;
}
