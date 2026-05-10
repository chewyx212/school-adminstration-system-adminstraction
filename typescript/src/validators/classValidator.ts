import { BadRequestError } from '../errors/AppError';

export const validateClassCode = (classCode: unknown): string => {
  if (typeof classCode !== 'string' || !classCode.trim()) {
    throw new BadRequestError('VALIDATION_ERROR', 'classCode is required');
  }

  return classCode.trim();
}

export const validateClassName = (className: unknown): string => {
  if (typeof className !== 'string' || !className.trim()) {
    throw new BadRequestError('VALIDATION_ERROR', 'className is required');
  }

  return className.trim();
}
