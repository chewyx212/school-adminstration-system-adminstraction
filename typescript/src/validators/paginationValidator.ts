import { BadRequestError } from '../errors/AppError';

export interface Pagination {
  offset: number;
  limit: number;
}

const parseInteger = (value: unknown): number | null => {
  if (typeof value !== 'string' || !/^-?\d+$/.test(value)) {
    return null;
  }

  return parseInt(value);
}

export const validatePagination = (offsetValue: unknown, limitValue: unknown): Pagination => {
  const offset = offsetValue === undefined ? 0 : parseInteger(offsetValue);
  const limit = limitValue === undefined ? 10 : parseInteger(limitValue);

  if (offset === null || offset < 0) {
    throw new BadRequestError('VALIDATION_ERROR', 'offset must be a non-negative integer');
  }

  if (limit === null || limit <= 0 || limit > 500) {
    throw new BadRequestError('VALIDATION_ERROR', 'limit must be an integer from 1 to 500');
  }

  return { offset, limit };
}
