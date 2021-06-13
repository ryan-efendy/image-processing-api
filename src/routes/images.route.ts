import { Router } from 'express';
import { getImage } from '../controllers/images.controller';

const images = Router();

images.get('/', getImage);

export default images;
