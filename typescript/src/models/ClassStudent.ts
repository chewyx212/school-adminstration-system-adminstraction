import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ClassStudentAttributes {
  id: number;
  classId: number;
  studentId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ClassStudentCreationAttributes = Optional<ClassStudentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class ClassStudent extends Model<ClassStudentAttributes, ClassStudentCreationAttributes> implements ClassStudentAttributes {
  public id!: number;
  public classId!: number;
  public studentId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassStudent.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  classId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'class_students',
  indexes: [
    { fields: ['classId', 'studentId'], unique: true },
    { fields: ['classId'] },
    { fields: ['studentId'] }
  ]
});

export default ClassStudent;
