import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CustomRequest } from './utils/interfaces';
import userRouter from './routes/user';
import cardRouter from './routes/card';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const BaseURL = 'mongodb://localhost:27017/mestodb';

const app = express();

const helmet = require('helmet');

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6579eea42d0f0df5d4b6dfac',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

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
