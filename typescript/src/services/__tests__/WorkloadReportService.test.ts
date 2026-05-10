jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    query: jest.fn()
  }
}));

import sequelize from '../../config/database';
import workloadReportService from '../WorkloadReportService';

describe('WorkloadReportService', () => {
  it('groups workload rows by teacher name', async () => {
    (sequelize.query as jest.Mock).mockResolvedValue([
      {
        teacherName: 'Teacher A',
        subjectCode: 'ENG',
        subjectName: 'English',
        numberOfClasses: '1'
      },
      {
        teacherName: 'Teacher A',
        subjectCode: 'MATH',
        subjectName: 'Mathematics',
        numberOfClasses: '2'
      }
    ]);

    await expect(workloadReportService.getWorkloadReport()).resolves.toEqual({
      'Teacher A': [
        { subjectCode: 'ENG', subjectName: 'English', numberOfClasses: 1 },
        { subjectCode: 'MATH', subjectName: 'Mathematics', numberOfClasses: 2 }
      ]
    });
  });
});
