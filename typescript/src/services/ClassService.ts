import { SchoolClass } from '../models';
import { BadRequestError } from '../errors/AppError';

class ClassService {
  public async updateClassName(classCode: string, className: string): Promise<void> {
    const schoolClass = await SchoolClass.findOne({ where: { code: classCode } });

    if (!schoolClass) {
      throw new BadRequestError('CLASS_NOT_FOUND', 'Class not found');
    }

    await schoolClass.update({ name: className });
  }
}

export default new ClassService();
