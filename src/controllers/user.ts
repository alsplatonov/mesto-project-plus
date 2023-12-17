import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../utils/interfaces';
import User from '../models/user';
import {
  STATUS_SUCCESS,
  STATUS_SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  STATUS_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  INVALID_DATA_MESSAGE,
} from '../utils/consts';

export const getAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_SUCCESS).send({ data: users });
    })
    .catch(() => {
      res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10) // хэшифруем пароль, добавив "соль"
    .then((hash: string) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(STATUS_CREATED).send({ // не возвращаем пароль
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
          } else {
            res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
          }
        });
    });
};


export const updateUser = (req: CustomRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const loginUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET не найден');
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET as string,
        { expiresIn: '7d' }, // токен на 7 дней
      );

      res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7), sameSite: true });
      res.send({ user, token });
    })
    .catch(next);
};

