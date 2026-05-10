import Express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import classService from '../services/ClassService';
import studentListingService from '../services/StudentListingService';
import { validateClassCode, validateClassName } from '../validators/classValidator';
import { validatePagination } from '../validators/paginationValidator';

const ClassController = Express.Router();

const listStudentsHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classCode = validateClassCode(req.params.classCode);
    const { offset, limit } = validatePagination(req.query.offset, req.query.limit);
    const listing = await studentListingService.listStudents(classCode, offset, limit);

    return res.status(StatusCodes.OK).send(listing);
  } catch (error) {
    return next(error);
  }
}

const updateClassNameHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classCode = validateClassCode(req.params.classCode);
    const className = validateClassName(req.body ? req.body.className : undefined);

    await classService.updateClassName(classCode, className);

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    return next(error);
  }
}

ClassController.get('/class/:classCode/students', listStudentsHandler);
ClassController.put('/class/:classCode', updateClassNameHandler);

export default ClassController;
