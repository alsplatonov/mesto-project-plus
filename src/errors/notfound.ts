import { STATUS_NOT_FOUND } from "../utils/consts";
import { ICUstomError } from '../utils/interfaces';

class NotFoundError extends Error implements ICUstomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;

export default NotFoundError;
