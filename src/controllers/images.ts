import path from 'path';
import { promises as fs } from 'fs';
import { Request, Response } from 'express';
import sharp from 'sharp';

/**
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg&blur=true
 * http://localhost:3000/api/images?filename=encenadaport&width=200&height=200&format=jpg&blur=true&grayscale=true
 * @param req
 * @param res
 * @returns
 */
const transformImage = async (req: Request, res: Response) => {
  try {
    const { filename, width, height, blur, grayscale } = req.query;

    if (!filename || !width || !height) {
      return res
        .status(400)
        .send(
          'Either filename, width or height parameter is invalid or missing.'
        );
    }

    const format = req.query.format ?? 'jpg';

    if (isNaN(Number(width)) || isNaN(Number(height))) {
      return res.status(400).send('Width or height parameter is invalid.');
    }

    if (await exists(`./images/full/${filename}.${format}`)) {
      console.log(`full image ${filename} exists on disk`);

      // encenadaport_300x300.jpg
      if (
        await exists(`./images/thumb/${filename}_${width}x${height}.${format}`)
      ) {
        const metadata = await sharp(
          path.resolve(
            `./images/thumb/${filename}_${width}x${height}.${format}`
          )
        ).metadata();

        if (
          metadata &&
          width &&
          height &&
          metadata.width === +width &&
          metadata.height === +height
        ) {
          console.log(
            `thumb image ${filename} of ${width}x${height} exists on disk, returning pre-stored image`
          );
          // caching: repeated requests return pre-stored images rather than regenerating a new image
          return res.sendFile(
            path.resolve(
              `./images/thumb/${filename}_${width}x${height}.${format}`
            )
          );
        }
      }
      console.log(
        `resizing full ${filename} to ${width}x${height} and saving it to disk`
      );

      let transform = await sharp(`./images/full/${filename}.${format}`).resize(
        +width,
        +height
      );

      if (blur) {
        transform = await transform.blur();
      }

      if (grayscale) {
        transform = await transform.grayscale();
      }

      await transform.toFile(
        `./images/thumb/${filename}_${width}x${height}.${format}`
      );

      return res.sendFile(
        path.resolve(`./images/thumb/${filename}_${width}x${height}.${format}`)
      );
    } else {
      return res
        .status(400)
        .send(`The image ${filename}.${format} doesn't exist on disk.`);
    }
  } catch (e) {
    res
      .status(500)
      .send(`The image has failed to process due to ${(e as Error).message}`);
    console.log((e as Error).message);
  }
};

async function exists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export default transformImage;
