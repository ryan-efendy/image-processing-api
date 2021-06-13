import { Router } from 'express';
import images from './images.route';
const routes = Router();

routes.use('/images', images);

export default routes;
