/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';
import { CustomRequest } from '../utils/interfaces';
import { USER_NOT_AUTHORIZED, TOKEN_NOT_VALID } from '../utils/consts';

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(USER_NOT_AUTHORIZED));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не найден');
  }
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(TOKEN_NOT_VALID));
    return;
  }

  req.user = payload as any; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
