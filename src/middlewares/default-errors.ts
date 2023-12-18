/* eslint-disable max-len */
import { Request, Response, NextFunction } from 'express';
import { ICUstomError } from '../utils/interfaces';
import { STATUS_SERVER_ERROR } from '../utils/consts';

const defaultErrorsMiddleware = (err: ICUstomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === STATUS_SERVER_ERROR ? 'Ошибка сервера' : message,
  });
  next();
};

export default defaultErrorsMiddleware;
