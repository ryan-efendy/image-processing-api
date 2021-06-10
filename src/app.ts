import express, { Request, Response } from 'express';
import morgan from 'morgan';
import routes from './routes/index';

const app = express();

app.use(morgan('tiny'));

app.get('/', (_: Request, res: Response) => res.send('hello world 👋'));

app.get('/ping', (_: Request, res: Response) => res.send('pong 🏓'));

app.use('/api', routes);

export default app;
