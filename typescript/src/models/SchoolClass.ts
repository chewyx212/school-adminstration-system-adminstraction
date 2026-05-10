import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface SchoolClassAttributes {
  id: number;
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SchoolClassCreationAttributes = Optional<SchoolClassAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class SchoolClass extends Model<SchoolClassAttributes, SchoolClassCreationAttributes> implements SchoolClassAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SchoolClass.init({
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
  tableName: 'classes',
  indexes: [{ fields: ['code'], unique: true }]
});

export default SchoolClass;
