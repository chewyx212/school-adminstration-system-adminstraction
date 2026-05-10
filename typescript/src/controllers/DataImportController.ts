import Express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import upload from '../config/multer';
import uploadService from '../services/UploadService';
import { validateUploadFile } from '../validators/uploadValidator';

const DataImportController = Express.Router();

const dataImportHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Check Empty
    const file = validateUploadFile(req.file);
    await uploadService.importCsv(file.path);

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    return next(error);
  }
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
