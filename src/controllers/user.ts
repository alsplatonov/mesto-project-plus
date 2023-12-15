import { Request, Response } from 'express';
import { CustomRequest } from 'utils/interfaces';
import User from '../models/user';
import {
  STATUS_SUCCESS, SUCCES_MESSAGE, STATUS_SERVER_ERROR,
  SERVER_ERROR_MESSAGE, STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE, CREATE_SUCCES_MESSAGE,
  STATUS_CREATED, STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE
} from '../utils/consts';


export const getAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_SUCCESS).send({ data: users });
    })
    .catch((err) => {
      res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateUser = (req: CustomRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const updateUserAvatar = (req: CustomRequest, res: Response) => {
  const {avatar} = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(userId, { avatar } )
    .then((user) => {
      res.status(STATUS_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: USER_NOT_FOUND_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

