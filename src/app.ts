import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { CustomRequest } from './utils/interfaces';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import authMiddleware from './middlewares/auth';
import { createUser, login } from './controllers/user';
import { createUserValidation } from './utils/celebrate-validation';
import { requestLogger, errorLogger } from './middlewares/logger';
import { ICUstomError } from './utils/interfaces';
import { STATUS_SERVER_ERROR } from './utils/consts';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const BaseURL = 'mongodb://localhost:27017/mestodb';

const app = express();

const helmet = require('helmet');

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логер запросов

app.post('/signup', createUserValidation, createUser);
app.post('/signin', login);

app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger); // подключаем логер ошибок

app.use(errors()); // обработчик ошибок celebrate
// централизованный обработчик ошибок
app.use((err: ICUstomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === STATUS_SERVER_ERROR ? 'Ошибка сервера' : message,
  });
  next();
});

mongoose
  .connect(BaseURL)
  .then(() => (
    // eslint-disable-next-line no-console
    console.log('Подключение к базе произошло успешно')
  ))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(`Произошла ошибка при подключении к базе: ${err}`);
  });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порте: ${PORT}`);
});
