CREATE TABLE IF NOT EXISTS teachers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY teachers_email_unique (email)
);

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY students_email_unique (email)
);

CREATE TABLE IF NOT EXISTS classes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY classes_code_unique (code)
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY subjects_code_unique (code)
);

CREATE TABLE IF NOT EXISTS class_students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  classId INT UNSIGNED NOT NULL,
  studentId INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY class_students_class_student_unique (classId, studentId),
  KEY class_students_class_id_idx (classId),
  KEY class_students_student_id_idx (studentId),
  CONSTRAINT class_students_class_id_fk FOREIGN KEY (classId) REFERENCES classes (id),
  CONSTRAINT class_students_student_id_fk FOREIGN KEY (studentId) REFERENCES students (id)
);

CREATE TABLE IF NOT EXISTS course_registrations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  teacherId INT UNSIGNED NOT NULL,
  studentId INT UNSIGNED NOT NULL,
  classId INT UNSIGNED NOT NULL,
  subjectId INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY course_registrations_unique_active (teacherId, studentId, classId, subjectId),
  KEY course_registrations_teacher_subject_class_idx (teacherId, subjectId, classId),
  KEY course_registrations_class_student_idx (classId, studentId),
  KEY course_registrations_teacher_id_idx (teacherId),
  KEY course_registrations_student_id_idx (studentId),
  KEY course_registrations_subject_id_idx (subjectId),
  CONSTRAINT course_registrations_teacher_id_fk FOREIGN KEY (teacherId) REFERENCES teachers (id),
  CONSTRAINT course_registrations_student_id_fk FOREIGN KEY (studentId) REFERENCES students (id),
  CONSTRAINT course_registrations_class_id_fk FOREIGN KEY (classId) REFERENCES classes (id),
  CONSTRAINT course_registrations_subject_id_fk FOREIGN KEY (subjectId) REFERENCES subjects (id)
);
