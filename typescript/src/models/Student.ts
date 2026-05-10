import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface StudentAttributes {
  id: number;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StudentCreationAttributes = Optional<StudentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'students',
  indexes: [{ fields: ['email'], unique: true }]
});

export default Student;
