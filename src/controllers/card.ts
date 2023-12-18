/* eslint-disable linebreak-style */
// eslint-disable-next-line no-else-return
import { Request, Response, NextFunction } from 'express';
import {
  STATUS_SUCCESS,
  STATUS_CREATED,
  INVALID_DATA_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  CARD_FORBIDDEN_DELETE_MESSAGE,
} from '../utils/consts';
import ForbiddenError from '../errors/forbidden';
import BadRequestError from '../errors/badrequest';
import NotFoundError from '../errors/notfound';
import Card from '../models/card';
import { CustomRequest } from '../utils/interfaces';

export const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_SUCCESS).send({ data: cards });
    })
    .catch(next);
};

export const createCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

export const deleteCardById = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findById(cardId)
    .orFail(new Error('NotFoundError'))
    .then((card) => {
      if (card?.owner.toString() !== userId) {
        next(new ForbiddenError(CARD_FORBIDDEN_DELETE_MESSAGE));
      } else {
        card.remove()
          .then((removedCard) => {
            res.status(STATUS_SUCCESS).send({ data: removedCard });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(CARD_NOT_FOUND_MESSAGE));
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

export const likeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new Error('NotFoundError'))
    .then((card) => {
      res.status(STATUS_SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(CARD_NOT_FOUND_MESSAGE));
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

export const dislikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId as any } },
    { new: true },
  )
    .orFail(new Error('NotFoundError'))
    .then((card) => {
      res.status(STATUS_SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError(CARD_NOT_FOUND_MESSAGE));
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
