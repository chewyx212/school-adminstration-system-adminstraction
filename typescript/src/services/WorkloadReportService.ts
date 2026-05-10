import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

interface WorkloadRow {
  teacherName: string;
  subjectCode: string;
  subjectName: string;
  numberOfClasses: number;
}

interface WorkloadReportItem {
  subjectCode: string;
  subjectName: string;
  numberOfClasses: number;
}

type WorkloadReport = Record<string, WorkloadReportItem[]>;

class WorkloadReportService {
  public async getWorkloadReport(): Promise<WorkloadReport> {
    // Count each teacher's distinct classes per subject.
    const rows = await sequelize.query<WorkloadRow>(`
      SELECT
        t.name AS teacherName,
        s.code AS subjectCode,
        s.name AS subjectName,
        COUNT(DISTINCT cr.classId) AS numberOfClasses
      FROM course_registrations cr
      INNER JOIN teachers t ON t.id = cr.teacherId
      INNER JOIN subjects s ON s.id = cr.subjectId
      GROUP BY t.id, t.name, s.id, s.code, s.name
      ORDER BY t.name ASC, s.code ASC
    `, {
      type: QueryTypes.SELECT
    });

    return rows.reduce((report, row) => {
      if (!report[row.teacherName]) {
        report[row.teacherName] = [];
      }

      report[row.teacherName].push({
        subjectCode: row.subjectCode,
        subjectName: row.subjectName,
        numberOfClasses: Number(row.numberOfClasses)
      });

      return report;
    }, {} as WorkloadReport);
  }
}

export default new WorkloadReportService();
