import supertest from 'supertest';
import app from './app';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('gets the / endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hello world 👋');
  });

  it('gets the /ping endpoint', async () => {
    const response = await request.get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong 🏓');
  });
});
