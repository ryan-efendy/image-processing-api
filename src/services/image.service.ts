import path from 'path';
import sharp from 'sharp';
import fs from 'fs-extra';
import { createDirIfNotExist } from '../utils/index';

export const transformImage = async (
  filename: string,
  width: string,
  height: string,
  format = 'jpg',
  blur = 'false',
  grayscale = 'false',
): Promise<string> => {
  if (!filename || !width || !height) throw new Error('Either filename, width or height is missing.');

  if (isNaN(Number(width)) || isNaN(Number(height)))
    throw new Error('Invalid width or height. Width or height must be a number.');

  const fullPath = path.resolve(`./src/images/full/${filename}.${format}`);
  const thumbPath = path.resolve(`./src/images/thumb/${filename}_${width}x${height}.${format}`);

  if (!(await fs.pathExists(fullPath))) throw new Error(`${fullPath} doesn't exist on disk.`);

  console.log(`${fullPath} exists on disk`);

  createDirIfNotExist('./src/images/thumb/');

  if (await fs.pathExists(thumbPath)) {
    const metadata = await sharp(thumbPath).metadata();

    if (metadata && width && height && metadata.width === +width && metadata.height === +height) {
      console.log(`${thumbPath} exists on disk, returning pre-stored image`);
      return thumbPath;
    }
  }

  console.log(`resizing full ${filename} to ${width}x${height} and saving it to disk`);

  let transform = await sharp(fullPath).resize(+width, +height);

  if (blur) transform = await transform.blur();

  if (grayscale) transform = await transform.grayscale();

  await transform.toFile(thumbPath);

  return thumbPath;
};
