import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface CourseRegistrationAttributes {
  id: number;
  teacherId: number;
  studentId: number;
  classId: number;
  subjectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CourseRegistrationCreationAttributes = Optional<CourseRegistrationAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class CourseRegistration extends Model<CourseRegistrationAttributes, CourseRegistrationCreationAttributes> implements CourseRegistrationAttributes {
  public id!: number;
  public teacherId!: number;
  public studentId!: number;
  public classId!: number;
  public subjectId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseRegistration.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  teacherId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'course_registrations',
  indexes: [
    { name: 'course_registrations_unique_active', fields: ['teacherId', 'studentId', 'classId', 'subjectId'], unique: true },
    { fields: ['teacherId', 'subjectId', 'classId'] },
    { fields: ['classId', 'studentId'] },
    { fields: ['teacherId'] },
    { fields: ['studentId'] },
    { fields: ['subjectId'] }
  ]
});

export default CourseRegistration;
