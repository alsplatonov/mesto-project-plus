/* eslint-disable linebreak-style */
import mongoose, { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string,
  password: string,
}

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}
