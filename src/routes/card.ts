import { Router } from 'express';
import { getAllCards, createCard, deleteCardById, likeCard, dislikeCard } from '../controllers/card';

const cardRouter = Router();

cardRouter.get('/', getAllCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
