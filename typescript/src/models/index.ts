import Teacher from './Teacher';
import Student from './Student';
import SchoolClass from './SchoolClass';
import Subject from './Subject';
import ClassStudent from './ClassStudent';
import CourseRegistration from './CourseRegistration';

//For CourseRegistration
Teacher.hasMany(CourseRegistration, { foreignKey: 'teacherId' });
Student.hasMany(CourseRegistration, { foreignKey: 'studentId' });
SchoolClass.hasMany(CourseRegistration, { foreignKey: 'classId' });
Subject.hasMany(CourseRegistration, { foreignKey: 'subjectId' });

CourseRegistration.belongsTo(Teacher, { foreignKey: 'teacherId' });
CourseRegistration.belongsTo(Student, { foreignKey: 'studentId' });
CourseRegistration.belongsTo(SchoolClass, { foreignKey: 'classId' });
CourseRegistration.belongsTo(Subject, { foreignKey: 'subjectId' });

SchoolClass.belongsToMany(Student, {
  through: ClassStudent,
  foreignKey: 'classId',
  otherKey: 'studentId'
});
Student.belongsToMany(SchoolClass, {
  through: ClassStudent,
  foreignKey: 'studentId',
  otherKey: 'classId'
});

ClassStudent.belongsTo(SchoolClass, { foreignKey: 'classId' });
ClassStudent.belongsTo(Student, { foreignKey: 'studentId' });

export {
  Teacher,
  Student,
  SchoolClass,
  Subject,
  ClassStudent,
  CourseRegistration
};
