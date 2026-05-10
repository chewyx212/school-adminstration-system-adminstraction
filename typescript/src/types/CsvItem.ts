export interface CsvItem {
  teacherEmail: string;
  teacherName: string;
  studentEmail: string;
  studentName: string;
  classCode: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  toDelete: string;
}

export interface ParsedCsv<T> {
  headers: string[];
  rows: T[];
}
