INSERT INTO teachers (email, name, createdAt, updatedAt) VALUES
  ('alice.teacher@example.com', 'Alice Tan', NOW(), NOW()),
  ('ben.teacher@example.com', 'Ben Lim', NOW(), NOW()),
  ('carol.teacher@example.com', 'Carol Wong', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updatedAt = VALUES(updatedAt);

INSERT INTO students (email, name, createdAt, updatedAt) VALUES
  ('aaron.student@example.com', 'Aaron Lee', NOW(), NOW()),
  ('bella.student@example.com', 'Bella Ng', NOW(), NOW()),
  ('chloe.student@example.com', 'Chloe Tan', NOW(), NOW()),
  ('daniel.student@example.com', 'Daniel Lim', NOW(), NOW()),
  ('emily.student@example.com', 'Emily Wong', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updatedAt = VALUES(updatedAt);

INSERT INTO classes (code, name, createdAt, updatedAt) VALUES
  ('P1-1', 'Primary 1 Courage', NOW(), NOW()),
  ('P1-2', 'Primary 1 Wisdom', NOW(), NOW()),
  ('P2-1', 'Primary 2 Integrity', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updatedAt = VALUES(updatedAt);

INSERT INTO subjects (code, name, createdAt, updatedAt) VALUES
  ('ENG', 'English', NOW(), NOW()),
  ('MATH', 'Mathematics', NOW(), NOW()),
  ('SCI', 'Science', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  updatedAt = VALUES(updatedAt);

INSERT INTO class_students (classId, studentId, createdAt, updatedAt) VALUES
  ((SELECT id FROM classes WHERE code = 'P1-1'), (SELECT id FROM students WHERE email = 'aaron.student@example.com'), NOW(), NOW()),
  ((SELECT id FROM classes WHERE code = 'P1-1'), (SELECT id FROM students WHERE email = 'bella.student@example.com'), NOW(), NOW()),
  ((SELECT id FROM classes WHERE code = 'P1-1'), (SELECT id FROM students WHERE email = 'chloe.student@example.com'), NOW(), NOW()),
  ((SELECT id FROM classes WHERE code = 'P1-2'), (SELECT id FROM students WHERE email = 'daniel.student@example.com'), NOW(), NOW()),
  ((SELECT id FROM classes WHERE code = 'P1-2'), (SELECT id FROM students WHERE email = 'emily.student@example.com'), NOW(), NOW()),
  ((SELECT id FROM classes WHERE code = 'P2-1'), (SELECT id FROM students WHERE email = 'aaron.student@example.com'), NOW(), NOW())
ON DUPLICATE KEY UPDATE
  updatedAt = VALUES(updatedAt);

INSERT INTO course_registrations (teacherId, studentId, classId, subjectId, createdAt, updatedAt) VALUES
  (
    (SELECT id FROM teachers WHERE email = 'alice.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'aaron.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P1-1'),
    (SELECT id FROM subjects WHERE code = 'MATH'),
    NOW(),
    NOW()
  ),
  (
    (SELECT id FROM teachers WHERE email = 'alice.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'bella.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P1-1'),
    (SELECT id FROM subjects WHERE code = 'MATH'),
    NOW(),
    NOW()
  ),
  (
    (SELECT id FROM teachers WHERE email = 'alice.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'aaron.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P2-1'),
    (SELECT id FROM subjects WHERE code = 'MATH'),
    NOW(),
    NOW()
  ),
  (
    (SELECT id FROM teachers WHERE email = 'ben.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'chloe.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P1-1'),
    (SELECT id FROM subjects WHERE code = 'ENG'),
    NOW(),
    NOW()
  ),
  (
    (SELECT id FROM teachers WHERE email = 'ben.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'daniel.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P1-2'),
    (SELECT id FROM subjects WHERE code = 'ENG'),
    NOW(),
    NOW()
  ),
  (
    (SELECT id FROM teachers WHERE email = 'carol.teacher@example.com'),
    (SELECT id FROM students WHERE email = 'emily.student@example.com'),
    (SELECT id FROM classes WHERE code = 'P1-2'),
    (SELECT id FROM subjects WHERE code = 'SCI'),
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE
  updatedAt = VALUES(updatedAt);
