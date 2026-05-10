import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TeacherAttributes {
  id: number;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type TeacherCreationAttributes = Optional<TeacherAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes> implements TeacherAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Teacher.init({
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
  tableName: 'teachers',
  indexes: [{ fields: ['email'], unique: true }]
});

export default Teacher;
