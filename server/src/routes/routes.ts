import express from 'express';
import multer from 'multer';

import PointsController from '../controllers/PointsControllers';
import ItemsController from '../controllers/ItemsControllers';
import multerConfig from '../config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points', upload.single('image'),pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;