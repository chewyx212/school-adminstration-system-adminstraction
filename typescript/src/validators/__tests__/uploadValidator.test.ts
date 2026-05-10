import { normalizeUploadRows, validateUploadFile } from '../uploadValidator';

describe('uploadValidator', () => {
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

  it('normalizes valid rows', () => {
    const rows = normalizeUploadRows({
      headers,
      rows: [{
        teacherEmail: ' Teacher@Example.com ',
        teacherName: ' Teacher One ',
        studentEmail: ' Student@Example.com ',
        studentName: ' Student One ',
        classCode: ' P1-1 ',
        className: ' Class One ',
        subjectCode: ' MATH ',
        subjectName: ' Mathematics ',
        toDelete: ' 0 '
      }]
    });

    expect(rows).toEqual([{
      teacherEmail: 'teacher@example.com',
      teacherName: 'Teacher One',
      studentEmail: 'student@example.com',
      studentName: 'Student One',
      classCode: 'P1-1',
      className: 'Class One',
      subjectCode: 'MATH',
      subjectName: 'Mathematics',
      toDelete: '0'
    }]);
  });

  it('rejects missing file', () => {
    expect(() => validateUploadFile(undefined)).toThrow('CSV file is required');
  });

  it('rejects invalid CSV rows', () => {
    expect(() => normalizeUploadRows({
      headers: headers.filter((header) => header !== 'subjectName'),
      rows: [{
        teacherEmail: 'not-an-email',
        teacherName: '',
        studentEmail: 'student@example.com',
        studentName: 'Student One',
        classCode: 'P1-1',
        className: 'Class One',
        subjectCode: 'MATH',
        subjectName: '',
        toDelete: '2'
      }]
    })).toThrow('CSV validation failed');
  });
});
