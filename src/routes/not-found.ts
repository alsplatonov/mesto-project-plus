import { Router } from 'express';
import notFound from '../controllers/not-found';

const notFoundRouter = Router();

notFoundRouter.use('*', notFound);

export default notFoundRouter;
