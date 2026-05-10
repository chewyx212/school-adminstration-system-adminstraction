jest.mock('../../services/UploadService', () => ({
  __esModule: true,
  default: {
    importCsv: jest.fn()
  }
}));

jest.mock('../../services/StudentListingService', () => ({
  __esModule: true,
  default: {
    listStudents: jest.fn()
  }
}));

jest.mock('../../services/ClassService', () => ({
  __esModule: true,
  default: {
    updateClassName: jest.fn()
  }
}));

jest.mock('../../services/WorkloadReportService', () => ({
  __esModule: true,
  default: {
    getWorkloadReport: jest.fn()
  }
}));

import fs from 'fs';
import path from 'path';
import request from 'supertest';
import App from '../../app';
import uploadService from '../../services/UploadService';
import studentListingService from '../../services/StudentListingService';
import classService from '../../services/ClassService';
import workloadReportService from '../../services/WorkloadReportService';

describe('API controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/upload returns 204 for valid multipart upload', async () => {
    const fixturePath = path.join(__dirname, 'valid-upload.csv');
    fs.writeFileSync(fixturePath, [
      'teacherEmail,teacherName,studentEmail,studentName,classCode,className,subjectCode,subjectName,toDelete',
      'teacher@example.com,Teacher One,student@example.com,Student One,P1-1,Class One,MATH,Mathematics,0'
    ].join('\n'));
    (uploadService.importCsv as jest.Mock).mockResolvedValue(undefined);

    try {
      await request(App)
        .post('/api/upload')
        .attach('data', fixturePath)
        .expect(204);

      expect(uploadService.importCsv).toHaveBeenCalledTimes(1);
    } finally {
      fs.unlinkSync(fixturePath);
    }
  });

  it('POST /api/upload returns 400 when file is missing', async () => {
    await request(App)
      .post('/api/upload')
      .expect(400)
      .expect({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'CSV file is required'
        }
      });
  });

  it('POST /api/upload returns 400 when multiple files are uploaded', async () => {
    const firstFixturePath = path.join(__dirname, 'valid-upload-1.csv');
    const secondFixturePath = path.join(__dirname, 'valid-upload-2.csv');
    const fixtureContent = [
      'teacherEmail,teacherName,studentEmail,studentName,classCode,className,subjectCode,subjectName,toDelete',
      'teacher@example.com,Teacher One,student@example.com,Student One,P1-1,Class One,MATH,Mathematics,0'
    ].join('\n');

    fs.writeFileSync(firstFixturePath, fixtureContent);
    fs.writeFileSync(secondFixturePath, fixtureContent);

    try {
      await request(App)
        .post('/api/upload')
        .attach('data', firstFixturePath)
        .attach('data', secondFixturePath)
        .expect(400)
        .expect({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Exactly one CSV file must be uploaded with the data field',
            details: {
              field: 'data',
              reason: 'LIMIT_UNEXPECTED_FILE'
            }
          }
        });

      expect(uploadService.importCsv).not.toHaveBeenCalled();
    } finally {
      fs.unlinkSync(firstFixturePath);
      fs.unlinkSync(secondFixturePath);
    }
  });

  it('GET /api/class/:classCode/students returns listing', async () => {
    (studentListingService.listStudents as jest.Mock).mockResolvedValue({
      count: 1,
      students: [{ id: 1, name: 'Student One', email: 'student@example.com', isExternal: false }]
    });

    await request(App)
      .get('/api/class/P1-1/students?offset=0&limit=10')
      .expect(200)
      .expect({
        count: 1,
        students: [{ id: 1, name: 'Student One', email: 'student@example.com', isExternal: false }]
      });
  });

  it('GET /api/class/:classCode/students defaults offset to zero', async () => {
    (studentListingService.listStudents as jest.Mock).mockResolvedValue({
      count: 0,
      students: []
    });

    await request(App)
      .get('/api/class/P1-1/students?limit=10')
      .expect(200)
      .expect({
        count: 0,
        students: []
      });

    expect(studentListingService.listStudents).toHaveBeenCalledWith('P1-1', 0, 10);
  });

  it('GET /api/class/:classCode/students defaults offset and limit', async () => {
    (studentListingService.listStudents as jest.Mock).mockResolvedValue({
      count: 0,
      students: []
    });

    await request(App)
      .get('/api/class/P1-1/students')
      .expect(200)
      .expect({
        count: 0,
        students: []
      });

    expect(studentListingService.listStudents).toHaveBeenCalledWith('P1-1', 0, 10);
  });

  it('PUT /api/class/:classCode returns 204', async () => {
    (classService.updateClassName as jest.Mock).mockResolvedValue(undefined);

    await request(App)
      .put('/api/class/P1-1')
      .send({ className: 'Updated Class' })
      .expect(204);

    expect(classService.updateClassName).toHaveBeenCalledWith('P1-1', 'Updated Class');
  });

  it('GET /api/reports/workload returns workload report', async () => {
    (workloadReportService.getWorkloadReport as jest.Mock).mockResolvedValue({
      'Teacher One': [{ subjectCode: 'MATH', subjectName: 'Mathematics', numberOfClasses: 2 }]
    });

    await request(App)
      .get('/api/reports/workload')
      .expect(200)
      .expect({
        'Teacher One': [{ subjectCode: 'MATH', subjectName: 'Mathematics', numberOfClasses: 2 }]
      });
  });
});
