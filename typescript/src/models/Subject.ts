import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface SubjectAttributes {
  id: number;
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubjectCreationAttributes = Optional<SubjectAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subject.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
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
  tableName: 'subjects',
  indexes: [{ fields: ['code'], unique: true }]
});

export default Subject;
