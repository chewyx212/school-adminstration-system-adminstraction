import sequelize from '../config/database';
import Logger from '../config/logger';
import { parseCsv } from '../utils';
import { ClassStudent, CourseRegistration, SchoolClass, Student, Subject, Teacher } from '../models';
import { NormalizedUploadRow, normalizeUploadRows } from '../validators/uploadValidator';
import { Transaction } from 'sequelize';
import { BadRequestError } from '../errors/AppError';
import { CsvItem, ParsedCsv } from 'CsvItem';

const LOG = new Logger('UploadService.ts');

const upsertTeacher = async (row: NormalizedUploadRow, transaction: Transaction): Promise<Teacher> => {
  const [teacher] = await Teacher.findOrCreate({
    where: { email: row.teacherEmail },
    defaults: { email: row.teacherEmail, name: row.teacherName },
    transaction
  });

  if (teacher.name !== row.teacherName) {
    await teacher.update({ name: row.teacherName }, { transaction });
  }

  return teacher;
}

const upsertStudent = async (row: NormalizedUploadRow, transaction: Transaction): Promise<Student> => {
  const [student] = await Student.findOrCreate({
    where: { email: row.studentEmail },
    defaults: { email: row.studentEmail, name: row.studentName },
    transaction
  });

  if (student.name !== row.studentName) {
    await student.update({ name: row.studentName }, { transaction });
  }

  return student;
}

const upsertClass = async (row: NormalizedUploadRow, transaction: Transaction): Promise<SchoolClass> => {
  const [schoolClass] = await SchoolClass.findOrCreate({
    where: { code: row.classCode },
    defaults: { code: row.classCode, name: row.className },
    transaction
  });

  if (schoolClass.name !== row.className) {
    await schoolClass.update({ name: row.className }, { transaction });
  }

  return schoolClass;
}

const upsertSubject = async (row: NormalizedUploadRow, transaction: Transaction): Promise<Subject> => {
  const [subject] = await Subject.findOrCreate({
    where: { code: row.subjectCode },
    defaults: { code: row.subjectCode, name: row.subjectName },
    transaction
  });

  if (subject.name !== row.subjectName) {
    await subject.update({ name: row.subjectName }, { transaction });
  }

  return subject;
}

class UploadService {
  public async importCsv(filePath: string): Promise<void> {
    let parsedCsv: ParsedCsv<CsvItem>;

    try {
      parsedCsv = await parseCsv(filePath);
    } catch (error) {
      throw new BadRequestError('VALIDATION_ERROR', 'CSV validation failed');
    }

    const rows = normalizeUploadRows(parsedCsv);

    LOG.info(`Starting CSV upload with ${rows.length} rows`);

    await sequelize.transaction(async (transaction) => {
      for (const row of rows) {
        const teacher = await upsertTeacher(row, transaction);
        const student = await upsertStudent(row, transaction);
        const schoolClass = await upsertClass(row, transaction);
        const subject = await upsertSubject(row, transaction);

        const registrationKey = {
          teacherId: teacher.id,
          studentId: student.id,
          classId: schoolClass.id,
          subjectId: subject.id
        };

        if (row.toDelete === '0') {
          await ClassStudent.findOrCreate({
            where: {
              classId: schoolClass.id,
              studentId: student.id
            },
            defaults: {
              classId: schoolClass.id,
              studentId: student.id
            },
            transaction
          });

          await CourseRegistration.findOrCreate({
            where: registrationKey,
            defaults: registrationKey,
            transaction
          });
        } else {
          await CourseRegistration.destroy({
            where: registrationKey,
            transaction
          });

          const remainingRegistrations = await CourseRegistration.count({
            where: {
              classId: schoolClass.id,
              studentId: student.id
            },
            transaction
          });

          if (remainingRegistrations === 0) {
            await ClassStudent.destroy({
              where: {
                classId: schoolClass.id,
                studentId: student.id
              },
              transaction
            });
          }
        }
      }
    });

    LOG.info(`Finished CSV upload with ${rows.length} rows`);
  }
}

export default new UploadService();
