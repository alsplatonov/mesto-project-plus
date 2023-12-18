/* eslint-disable linebreak-style */
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import notFoundRouter from './routes/not-found';
import authMiddleware from './middlewares/auth';
import { createUser, login } from './controllers/user';
import { createUserValidation } from './utils/celebrate-validation';
import { requestLogger, errorLogger } from './middlewares/logger';
import limiter from './utils/limiter';
import defaultErrorsMiddleware from './middlewares/default-errors';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const BaseURL = 'mongodb://localhost:27017/mestodb';

const app = express();

const helmet = require('helmet');

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логер запросов
app.use(limiter);

app.post('/signup', createUserValidation, createUser);
app.post('/signin', login);

// app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', notFoundRouter);

app.use(errorLogger); // подключаем логер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(defaultErrorsMiddleware); // централизованный обработчик ошибок

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
