import { STATUS_BAD_REQUEST } from "../utils/consts";
import { ICUstomError } from '../utils/interfaces';

class BadRequestError extends Error implements ICUstomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;

export default BadRequestError;
