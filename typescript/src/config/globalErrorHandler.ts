import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import { ErrorRequestHandler } from 'express';
import Logger from './logger';
import multer from 'multer';

const LOG = new Logger('globalErrorHandler.ts');

const buildErrorResponse = (code: string | number, message: string, details?: unknown) => ({
  error: {
    code,
    message,
    ...(details ? { details } : {})
  }
});

const getMulterErrorMessage = (err: multer.MulterError): string => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return 'Uploaded file exceeds the allowed size';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return 'Exactly one CSV file must be uploaded with the data field';
  }

  return err.message;
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(StatusCodes.BAD_REQUEST).json(buildErrorResponse(
      ErrorCodes.MALFORMED_JSON_ERROR_CODE,
      'Request body contains malformed JSON'
    ));
  }

  if (err instanceof multer.MulterError) {
    return res.status(StatusCodes.BAD_REQUEST).json(buildErrorResponse(
      'VALIDATION_ERROR',
      getMulterErrorMessage(err),
      {
        field: 'data',
        reason: err.code
      }
    ));
  }

  if (err instanceof ErrorBase) {
    const error = err;
    const details = error.getDetails();

    return res.status(error.getHttpStatusCode()).json(buildErrorResponse(
      error.getErrorCode(),
      error.getMessage(),
      details
    ));
  } else {
    LOG.error(err.stack || err.message || String(err));

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(buildErrorResponse(
      ErrorCodes.RUNTIME_ERROR_CODE,
      'Internal Server Error'
    ));
  }
}

export default globalErrorHandler;
