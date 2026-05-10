import Express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import workloadReportService from '../services/WorkloadReportService';

const ReportController = Express.Router();

const workloadReportHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await workloadReportService.getWorkloadReport();

    return res.status(StatusCodes.OK).send(report);
  } catch (error) {
    return next(error);
  }
}

ReportController.get('/reports/workload', workloadReportHandler);

export default ReportController;
