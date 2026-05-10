import { validatePagination } from '../paginationValidator';

describe('paginationValidator', () => {
  it('parses valid offset and limit', () => {
    expect(validatePagination('0', '20')).toEqual({ offset: 0, limit: 20 });
  });

  it('defaults offset to zero when missing', () => {
    expect(validatePagination(undefined, '20')).toEqual({ offset: 0, limit: 20 });
  });

  it('defaults limit to ten when missing', () => {
    expect(validatePagination('5', undefined)).toEqual({ offset: 5, limit: 10 });
  });

  it('defaults offset and limit when both are missing', () => {
    expect(validatePagination(undefined, undefined)).toEqual({ offset: 0, limit: 10 });
  });

  it('rejects invalid values', () => {
    expect(() => validatePagination('-1', '20')).toThrow('offset must be a non-negative integer');
    expect(() => validatePagination('abc', '20')).toThrow('offset must be a non-negative integer');
    expect(() => validatePagination('0', 'abc')).toThrow('limit must be an integer from 1 to 500');
    expect(() => validatePagination('0', '0')).toThrow('limit must be an integer from 1 to 500');
    expect(() => validatePagination('0', '501')).toThrow('limit must be an integer from 1 to 500');
  });
});
