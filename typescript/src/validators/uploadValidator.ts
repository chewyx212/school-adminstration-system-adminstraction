import { CsvItem, ParsedCsv } from 'CsvItem';
import { BadRequestError } from '../errors/AppError';
import { UploadedFile } from '../types/UploadedFile';

export interface NormalizedUploadRow {
  teacherEmail: string;
  teacherName: string;
  studentEmail: string;
  studentName: string;
  classCode: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  toDelete: '0' | '1';
}

interface ValidationDetail {
  row: number;
  field: string;
  message: string;
}

const REQUIRED_HEADERS = [
  'teacherEmail',
  'teacherName',
  'studentEmail',
  'studentName',
  'classCode',
  'className',
  'subjectCode',
  'subjectName',
  'toDelete'
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUploadFile = (file?: UploadedFile): UploadedFile => {
  if (!file) {
    throw new BadRequestError('VALIDATION_ERROR', 'CSV file is required');
  }

  return file;
}

const trimValue = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export const normalizeUploadRows = (parsedCsv: ParsedCsv<CsvItem>): NormalizedUploadRow[] => {
  const details: ValidationDetail[] = [];

  for (const header of REQUIRED_HEADERS) {
    if (!parsedCsv.headers.includes(header)) {
      details.push({
        row: 1,
        field: header,
        message: `${header} header is required`
      });
    }
  }

  if (parsedCsv.rows.length === 0) {
    details.push({
      row: 1,
      field: 'file',
      message: 'CSV file is empty'
    });
  }

  const normalizedRows = parsedCsv.rows.map((row, index) => {
    const rowNumber = index + 2;
    const normalized: NormalizedUploadRow = {
      teacherEmail: trimValue(row.teacherEmail).toLowerCase(),
      teacherName: trimValue(row.teacherName),
      studentEmail: trimValue(row.studentEmail).toLowerCase(),
      studentName: trimValue(row.studentName),
      classCode: trimValue(row.classCode),
      className: trimValue(row.className),
      subjectCode: trimValue(row.subjectCode),
      subjectName: trimValue(row.subjectName),
      toDelete: trimValue(row.toDelete) as '0' | '1'
    };

    for (const field of REQUIRED_HEADERS) {
      const value = trimValue(row[field as keyof CsvItem]);
      if (!value) {
        details.push({
          row: rowNumber,
          field,
          message: `${field} is required`
        });
      }
    }

    if (normalized.teacherEmail && !EMAIL_PATTERN.test(normalized.teacherEmail)) {
      details.push({
        row: rowNumber,
        field: 'teacherEmail',
        message: 'teacherEmail must be a valid email'
      });
    }

    if (normalized.studentEmail && !EMAIL_PATTERN.test(normalized.studentEmail)) {
      details.push({
        row: rowNumber,
        field: 'studentEmail',
        message: 'studentEmail must be a valid email'
      });
    }

    if (normalized.toDelete !== '0' && normalized.toDelete !== '1') {
      details.push({
        row: rowNumber,
        field: 'toDelete',
        message: 'toDelete must be 0 or 1'
      });
    }

    return normalized;
  });

  if (details.length > 0) {
    throw new BadRequestError('VALIDATION_ERROR', 'CSV validation failed', details);
  }

  return normalizedRows;
}
