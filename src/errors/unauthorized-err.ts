import { STATUS_UNAUTHORIZED } from "../utils/consts";
import { ICUstomError } from '../utils/interfaces';

class UnauthorizedError extends Error implements ICUstomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;

export default UnauthorizedError;
