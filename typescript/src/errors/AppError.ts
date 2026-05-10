import { StatusCodes } from 'http-status-codes';
import ErrorBase from './ErrorBase';

class AppError extends ErrorBase {
  constructor(code: string, message: string, httpStatusCode: number, details?: unknown) {
    super(message, code, httpStatusCode, details);
  }
}

export class BadRequestError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(code, message, StatusCodes.BAD_REQUEST, details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error') {
    super('EXTERNAL_SERVICE_ERROR', message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default AppError;
