import { STATUS_ERROR_DUBLICATE } from "../utils/consts";
import { ICUstomError } from '../utils/interfaces';

class DublicateError extends Error implements ICUstomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_ERROR_DUBLICATE;
  }
}

module.exports = DublicateError;

export default DublicateError;
