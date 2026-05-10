import { SchoolClass, Student } from '../models';
import externalStudentService from './ExternalStudentService';
import { BadRequestError } from '../errors/AppError';
import { compareStudentsAlphaNumeric, SortableStudent } from '../utils/sorting';
import { Includeable } from 'sequelize';

interface StudentListing {
  count: number;
  students: SortableStudent[];
}

class StudentListingService {
  public async listStudents(classCode: string, offset: number, limit: number): Promise<StudentListing> {
    const schoolClass = await SchoolClass.findOne({ where: { code: classCode } });

    if (!schoolClass) {
      throw new BadRequestError('CLASS_NOT_FOUND', 'Class not found');
    }

    const classMembershipInclude: Includeable = {
      model: SchoolClass,
      where: { id: schoolClass.id },
      attributes: [],
      through: { attributes: [] }
    };

    const localStudents = await Student.findAll({
      attributes: ['id', 'name', 'email'],
      include: [classMembershipInclude]
    });

    const externalStudents = await externalStudentService.fetchAllByClassCode(classCode);
    const combinedStudents: SortableStudent[] = [
      ...localStudents.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        isExternal: false
      })),
      ...externalStudents.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        isExternal: true
      }))
    ];

    combinedStudents.sort(compareStudentsAlphaNumeric);

    return {
      count: combinedStudents.length,
      students: combinedStudents.slice(offset, offset + limit)
    };
  }
}

export default new StudentListingService();
