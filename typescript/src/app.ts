import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import router from './router';
import globalErrorHandler from './config/globalErrorHandler';
import swaggerDocument from './config/swagger';

const App = Express();

App.use(compression());
App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded( { extended: true } ));
App.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
App.use('/api', router);
App.use(globalErrorHandler);

export default App;
