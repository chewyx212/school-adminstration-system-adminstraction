import axios from 'axios';
import Logger from '../config/logger';
import { ExternalServiceError } from '../errors/AppError';

export interface ExternalStudent {
  id: number;
  name: string;
  email: string;
}

interface ExternalStudentResponse {
  count: number;
  students: ExternalStudent[];
}

const LOG = new Logger('ExternalStudentService.ts');

class ExternalStudentService {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor() {
    const {
      EXTERNAL_API_BASE_URL = 'http://localhost:5001',
      EXTERNAL_API_TIMEOUT_MS = '5000'
    } = process.env;

    this.baseUrl = EXTERNAL_API_BASE_URL;
    this.timeoutMs = parseInt(EXTERNAL_API_TIMEOUT_MS);
  }

  public async fetchAllByClassCode(classCode: string): Promise<ExternalStudent[]> {
    const allStudents: ExternalStudent[] = [];
    const pageSize = 500;
    let offset = 0;
    let totalCount = 0;

    try {
      do {
        const response = await axios.get<ExternalStudentResponse>(`${this.baseUrl}/students`, {
          timeout: this.timeoutMs,
          params: {
            class: classCode,
            offset,
            limit: pageSize
          }
        });

        if (!response.data || typeof response.data.count !== 'number' || !Array.isArray(response.data.students)) {
          throw new Error('Malformed external student response');
        }

        totalCount = Math.min(response.data.count, 500);
        allStudents.push(...response.data.students);

        if (response.data.students.length === 0) {
          break;
        }

        offset += response.data.students.length;
      } while (allStudents.length < totalCount && allStudents.length < 500);

      return allStudents.slice(0, 500);
    } catch (error) {
      LOG.error(error.stack || error.message || String(error));
      throw new ExternalServiceError();
    }
  }
}

export default new ExternalStudentService();
