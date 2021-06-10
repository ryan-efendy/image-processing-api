import { Router } from 'express';
import transformImage from '../../controllers/images';

const images = Router();

images.get('/', transformImage);

export default images;
