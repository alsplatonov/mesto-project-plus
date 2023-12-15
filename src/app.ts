import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';


const { PORT = 3000 } = process.env;
const BaseURL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface CustomRequest extends Request {
  user?: {
    _id: string;
  };
}


app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6579eea42d0f0df5d4b6dfac',
  };

  next();
});


mongoose
  .connect(BaseURL)
  .then(() => console.log('Подключение к базе произошло успешно'))
  .catch((err) => {
    console.log(`Произошла ошибка при подключении к базе: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
