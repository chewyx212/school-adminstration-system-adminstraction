jest.mock('../../models', () => ({
  SchoolClass: {
    findOne: jest.fn()
  },
  Student: {
    findAll: jest.fn()
  }
}));

jest.mock('../ExternalStudentService', () => ({
  __esModule: true,
  default: {
    fetchAllByClassCode: jest.fn()
  }
}));

import { SchoolClass, Student } from '../../models';
import externalStudentService from '../ExternalStudentService';
import studentListingService from '../StudentListingService';

describe('StudentListingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('combines, sorts, counts, and paginates local and external students', async () => {
    (SchoolClass.findOne as jest.Mock).mockResolvedValue({ id: 10, code: 'P1-1' });
    (Student.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Student 10', email: 'local10@example.com' },
      { id: 2, name: 'Student 2', email: 'local2@example.com' }
    ]);
    (externalStudentService.fetchAllByClassCode as jest.Mock).mockResolvedValue([
      { id: 20, name: 'Student 1', email: 'external1@example.com' },
      { id: 21, name: 'Student 11', email: 'external11@example.com' }
    ]);

    const result = await studentListingService.listStudents('P1-1', 0, 3);

    expect(result.count).toBe(4);
    expect(result.students).toEqual([
      { id: 20, name: 'Student 1', email: 'external1@example.com', isExternal: true },
      { id: 2, name: 'Student 2', email: 'local2@example.com', isExternal: false },
      { id: 1, name: 'Student 10', email: 'local10@example.com', isExternal: false }
    ]);
  });

  it('throws 400 when class is missing', async () => {
    (SchoolClass.findOne as jest.Mock).mockResolvedValue(null);

    await expect(studentListingService.listStudents('CLS404', 0, 10)).rejects.toThrow('Class not found');
  });
});
