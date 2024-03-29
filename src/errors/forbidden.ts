/* eslint-disable linebreak-style */
import { STATUS_FORBIDDEN_ERROR } from '../utils/consts';
import { ICUstomError } from '../utils/interfaces';

class ForbiddenError extends Error implements ICUstomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
