import path from 'path';
import { Request, Response } from 'express';
import { transformImage } from '../services/image.service';

type ReqQuery = {
  filename: string;
  width: string;
  height: string;
  format: string;
  blur: string;
  grayscale: string;
};

/**
 * example requests
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg&blur=true
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg&blur=true&grayscale=true
 * @param req
 * @param res
 * @returns
 */
export const getImage = async (req: Request<any, any, any, ReqQuery>, res: Response) => {
  try {
    if (req.query) {
      const { filename, width, height, format, blur, grayscale } = req.query;
      res.sendFile(path.resolve(await transformImage(filename, width, height, format, blur, grayscale)));
    }
  } catch (err) {
    res.status(400).send(`Failed to process ${req.originalUrl} because ${(err as Error).message}`);
  }
};
