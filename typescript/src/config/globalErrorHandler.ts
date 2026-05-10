import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import ErrorBase from '../errors/ErrorBase';
import { ErrorRequestHandler } from 'express';
import Logger from './logger';

const LOG = new Logger('globalErrorHandler.ts');

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: {
        code: ErrorCodes.MALFORMED_JSON_ERROR_CODE,
        message: "Malformed json",
      },
    });
  }

  if (err instanceof ErrorBase) {
    const error = err;
    const details = error.getDetails();

    return res.status(error.getHttpStatusCode()).send({
      error: {
        code: error.getErrorCode(),
        message: error.getMessage(),
        ...(details ? { details } : {})
      }
    });
  } else {
    LOG.error(err.stack || err.message || String(err));

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: {
        code: ErrorCodes.RUNTIME_ERROR_CODE,
        message: 'Internal Server Error'
      }
    });
  }
}

export default globalErrorHandler;
