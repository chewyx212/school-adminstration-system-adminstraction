import fs from 'fs';
import csv from 'csv-parser';
import { CsvItem, ParsedCsv } from 'CsvItem';

export const parseCsv = (filePath: string): Promise<ParsedCsv<CsvItem>> => {
  const results: CsvItem[] = [];
  let headers: string[] = [];
  const stream = fs.createReadStream(filePath).pipe(csv());

  return new Promise((resolve, reject) => {
    stream.on('headers', (csvHeaders: string[]) => {
      headers = csvHeaders;
    });
    stream.on('data', (data: CsvItem) => results.push(data));
    stream.on('end', () => resolve({ headers, rows: results }));
    stream.on('error', (err) => reject(err));
  });
}

export const convertCsvToJson = async (filePath: string): Promise<CsvItem[]> => {
  const parsed = await parseCsv(filePath);

  return parsed.rows;
}
