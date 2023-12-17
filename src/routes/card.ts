/* eslint-disable linebreak-style */
import { Router } from 'express';
import {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/card';
import {
  createCardValidation,
}
  from '../utils/celebrate-validation';

const cardRouter = Router();

cardRouter.get('/', getAllCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
