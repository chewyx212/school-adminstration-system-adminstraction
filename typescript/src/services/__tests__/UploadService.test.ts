jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(async (callback) => callback('tx'))
  }
}));

jest.mock('../../utils', () => ({
  parseCsv: jest.fn()
}));

jest.mock('../../models', () => ({
  Teacher: { findOrCreate: jest.fn() },
  Student: { findOrCreate: jest.fn() },
  SchoolClass: { findOrCreate: jest.fn() },
  Subject: { findOrCreate: jest.fn() },
  ClassStudent: {
    findOrCreate: jest.fn(),
    destroy: jest.fn()
  },
  CourseRegistration: {
    findOrCreate: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  }
}));

import { parseCsv } from '../../utils';
import { ClassStudent, CourseRegistration, SchoolClass, Student, Subject, Teacher } from '../../models';
import uploadService from '../UploadService';

describe('UploadService', () => {
  const headers = [
    'teacherEmail',
    'teacherName',
    'studentEmail',
    'studentName',
    'classCode',
    'className',
    'subjectCode',
    'subjectName',
    'toDelete'
  ];

  const row = {
    teacherEmail: 'teacher@example.com',
    teacherName: 'Teacher One',
    studentEmail: 'student@example.com',
    studentName: 'Student One',
    classCode: 'P1-1',
    className: 'Class One',
    subjectCode: 'MATH',
    subjectName: 'Mathematics',
    toDelete: '0'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Teacher.findOrCreate as jest.Mock).mockResolvedValue([{ id: 1, name: 'Teacher One', update: jest.fn() }]);
    (Student.findOrCreate as jest.Mock).mockResolvedValue([{ id: 2, name: 'Student One', update: jest.fn() }]);
    (SchoolClass.findOrCreate as jest.Mock).mockResolvedValue([{ id: 3, name: 'Class One', update: jest.fn() }]);
    (Subject.findOrCreate as jest.Mock).mockResolvedValue([{ id: 4, name: 'Mathematics', update: jest.fn() }]);
  });

  it('upserts membership and course registration for active rows', async () => {
    (parseCsv as jest.Mock).mockResolvedValue({ headers, rows: [row] });

    await uploadService.importCsv('/tmp/upload.csv');

    expect(ClassStudent.findOrCreate).toHaveBeenCalledWith({
      where: { classId: 3, studentId: 2 },
      defaults: { classId: 3, studentId: 2 },
      transaction: 'tx'
    });
    expect(CourseRegistration.findOrCreate).toHaveBeenCalledWith({
      where: { teacherId: 1, studentId: 2, classId: 3, subjectId: 4 },
      defaults: { teacherId: 1, studentId: 2, classId: 3, subjectId: 4 },
      transaction: 'tx'
    });
  });

  it('deletes registration and prunes membership only when no registrations remain', async () => {
    (parseCsv as jest.Mock).mockResolvedValue({
      headers,
      rows: [{ ...row, toDelete: '1' }]
    });
    (CourseRegistration.count as jest.Mock).mockResolvedValue(0);

    await uploadService.importCsv('/tmp/upload.csv');

    expect(CourseRegistration.destroy).toHaveBeenCalledWith({
      where: { teacherId: 1, studentId: 2, classId: 3, subjectId: 4 },
      transaction: 'tx'
    });
    expect(ClassStudent.destroy).toHaveBeenCalledWith({
      where: { classId: 3, studentId: 2 },
      transaction: 'tx'
    });
  });

  it('updates latest names on existing master records', async () => {
    const teacherUpdate = jest.fn();
    (Teacher.findOrCreate as jest.Mock).mockResolvedValue([{ id: 1, name: 'Old Teacher', update: teacherUpdate }]);
    (parseCsv as jest.Mock).mockResolvedValue({ headers, rows: [row] });

    await uploadService.importCsv('/tmp/upload.csv');

    expect(teacherUpdate).toHaveBeenCalledWith({ name: 'Teacher One' }, { transaction: 'tx' });
  });
});
