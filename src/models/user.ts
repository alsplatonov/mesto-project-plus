import mongoose from 'mongoose';
import { IUser } from '../utils/interfaces';
import validator from 'validator';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v:string) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
