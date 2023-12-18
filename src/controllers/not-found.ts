import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/notfound';
import { PAGE_NOT_FOUND } from '../utils/consts';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(PAGE_NOT_FOUND));
};

export default notFound;
