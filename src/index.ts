import path from 'path';
import { promises as fs } from 'fs';
import express, { Request, Response } from 'express';
import sharp from 'sharp';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(morgan('tiny'));

app.get('/ping', (req: Request, res: Response) => res.send('pong'));

// http://localhost:3000/api/images?filename=encenadaport&width=200&height=200
app.get('/api/images/', async (req: Request, res: Response) => {
  try {
    const { filename, width, height } = req.query;

    // caching: repeated requests return pre-stored images rather than regenerating a new image
    if (filename && width && height) {
      if (await exists(`./images/thumb/${filename}_thumb.jpg`)) {
        const metadata = await sharp(
          path.resolve(`./images/thumb/${filename}_thumb.jpg`)
        ).metadata();

        if (
          metadata &&
          metadata.width === +width &&
          metadata.height === +height
        ) {
          console.log(
            `$thumb image {filename} of ${width} x ${height} already exists, returning pre-stored image`
          );
          return res.sendFile(
            path.resolve(`./images/thumb/${filename}_thumb.jpg`)
          );
        }
      }

      console.log(
        `resizing full ${filename} to ${width} x ${height} and saving it to thumb dir`
      );

      await sharp(`./images/full/${filename}.jpg`)
        .resize(+width, +height)
        .toFile(`./images/thumb/${filename}_thumb.jpg`);

      return res.sendFile(path.resolve(`./images/thumb/${filename}_thumb.jpg`));
    }

    res
      .status(404)
      .send(
        'Invalid/bad request: check filename, width, height i.e. api/images?filename=encenadaport&width=200&height=200'
      );
  } catch (err) {
    res
      .status(404)
      .send(
        'Invalid/bad request: check filename, width, height i.e. api/images?filename=encenadaport&width=200&height=200'
      );
    console.log(err);
  }
});

async function exists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
