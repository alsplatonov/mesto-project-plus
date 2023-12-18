/* eslint-disable linebreak-style */
// eslint-disable-next-line no-else-return
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../utils/interfaces';
import User from '../models/user';
import BadRequestError from '../errors/badrequest';
import NotFoundError from '../errors/notfound';
import DublicateError from '../errors/dublicate';
import {
  STATUS_SUCCESS,
  USER_NOT_FOUND_MESSAGE,
  STATUS_CREATED,
  INVALID_DATA_MESSAGE,
  USER_DUBLICATE_MESSAGE,
} from '../utils/consts';

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_SUCCESS).send({ data: users });
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'CastError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      }
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

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
          if (err.code === 11000) {
            next(new DublicateError(USER_DUBLICATE_MESSAGE));
             // eslint-disable-next-line no-else-return
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError(INVALID_DATA_MESSAGE));
             // eslint-disable-next-line no-else-return
            return;
          }
          next(err);
        });
    });
};

export const updateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'CastError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      }
      next(err);
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'CastError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      }
      next(err);
    });
};

export const login = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

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
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: true });
      res.send({ token });
    })
    .catch(next);
};

export const getCurrUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(USER_NOT_FOUND_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      } else if (err.name === 'CastError') {
        next(new BadRequestError(INVALID_DATA_MESSAGE));
         // eslint-disable-next-line no-else-return
        return;
      }
      next(err);
    });
};
