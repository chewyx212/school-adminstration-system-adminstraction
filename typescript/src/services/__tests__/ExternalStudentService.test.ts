jest.mock('axios');

const mockLoggerError = jest.fn();

jest.mock('../../config/logger', () => {
  return jest.fn().mockImplementation(() => ({
    error: mockLoggerError
  }));
});

import axios from 'axios';
import service from '../ExternalStudentService';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExternalStudentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches external students with class pagination params', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        count: 1,
        students: [{ id: 1, name: 'External One', email: 'external@example.com' }]
      }
    });

    const students = await service.fetchAllByClassCode('P1-1');

    expect(students).toEqual([{ id: 1, name: 'External One', email: 'external@example.com' }]);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5001/students', {
      timeout: 5000,
      params: {
        class: 'P1-1',
        offset: 0,
        limit: 500
      }
    });
  });

  it('converts external failures into service errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network failed'));

    await expect(service.fetchAllByClassCode('P1-1')).rejects.toThrow('External service error');
    expect(mockLoggerError).toHaveBeenCalledWith(expect.stringContaining('network failed'));
  });
});
