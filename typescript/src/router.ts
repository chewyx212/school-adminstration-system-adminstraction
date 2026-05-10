import Express from 'express';
import DataImportController from './controllers/DataImportController';
import HealthcheckController from './controllers/HealthcheckController';
import ClassController from './controllers/ClassController';
import ReportController from './controllers/ReportController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', ClassController);
router.use('/', ReportController);
router.use('/', HealthcheckController);

export default router;
