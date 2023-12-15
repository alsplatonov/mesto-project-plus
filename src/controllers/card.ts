import { Request, Response } from 'express';
import {
  STATUS_SUCCESS, SUCCES_MESSAGE, STATUS_SERVER_ERROR,
  SERVER_ERROR_MESSAGE, STATUS_NOT_FOUND, USER_NOT_FOUND_MESSAGE, CREATE_SUCCES_MESSAGE,
  STATUS_CREATED, STATUS_BAD_REQUEST, INVALID_DATA_MESSAGE, CARD_NOT_FOUND_MESSAGE
} from '../utils/consts';
import Card from '../models/card';
import { CustomRequest } from 'utils/interfaces';

export const getAllCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_SUCCESS).send({ data: cards });
    })
    .catch((err) => {
      res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

export const createCard = (req: CustomRequest, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: INVALID_DATA_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};


export const likeCard = (req: CustomRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
      } else {
        res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

export const dislikeCard = (req: CustomRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  if (userId) {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId as any } },
      { new: true },
    )
      .then((card) => {
        res.status(STATUS_CREATED).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          res.status(STATUS_NOT_FOUND).send({ message: CARD_NOT_FOUND_MESSAGE });
        } else {
          res.status(STATUS_SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
        }
      });
  } else {
    res.status(STATUS_BAD_REQUEST).send({ message: USER_NOT_FOUND_MESSAGE });
  }
};

