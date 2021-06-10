import path from 'path';
import supertest from 'supertest';
import fs from 'fs-extra';
import app from '../../app';

const request = supertest(app);

describe('GET /api/images', () => {
  describe('given valid url', () => {
    beforeEach(() => {
      fs.emptyDir(path.resolve('../../../images/thumb'), (err) => {
        if (err) return console.error(err);
      });
    });

    it('should succesfully resize, save to disk and return a 200 status code if valid URL (simple)', async () => {
      const response = await request.get(
        '/api/images?filename=encenadaport&width=200&height=200'
      );
      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');
    });

    it('should succesfully resize, save to disk and return a 200 status code if valid URL with format', async () => {
      const response = await request.get(
        '/api/images?filename=sanfrancisco&width=200&height=200&format=png'
      );
      expect(response.status).toBe(200);
      expect(response.type).toBe('image/png');
    });

    it('should succesfully resize, save to disk and return a 200 status code if valid URL with blur', async () => {
      const response = await request.get(
        '/api/images?filename=fjord&width=200&height=200&format=jpg&blur=true'
      );
      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');
    });

    it('should succesfully resize, save to disk and return a 200 status code if valid URL with grayscale', async () => {
      const response = await request.get(
        '/api/images?filename=santamonica&width=200&height=200&grayscale=true'
      );
      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');
    });
  });

  describe('given invalid url', () => {
    it('should return with a 400 status code because missing filename', async () => {
      const response = await request.get('/api/images?width=200&height=200');
      expect(response.status).toBe(400);
      expect(response.text).toBe(
        'Either filename, width or height parameter is invalid or missing.'
      );
    });

    it('should return with a 400 status code because missing width', async () => {
      const response = await request.get(
        '/api/images?filename=santamonica&height=200'
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe(
        'Either filename, width or height parameter is invalid or missing.'
      );
    });

    it('should return with a 400 status code because missing height', async () => {
      const response = await request.get(
        '/api/images?filename=santamonica&width=200'
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe(
        'Either filename, width or height parameter is invalid or missing.'
      );
    });

    it('should return with a 400 status code because invalid width', async () => {
      const response = await request.get(
        '/api/images?filename=santamonica&height=???&width=200'
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('Width or height parameter is invalid.');
    });

    it('should return with a 400 status code because invalid height', async () => {
      const response = await request.get(
        '/api/images?filename=santamonica&width=200&height=???'
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('Width or height parameter is invalid.');
    });

    it("should return with a 400 status code because image doesn't exist on disk ", async () => {
      const response = await request.get(
        '/api/images?filename=foo&width=200&height=200'
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe("The image foo.jpg doesn't exist on disk.");
    });
  });

  describe('caching: repeated requests to endpoint returns pre-stored images rather than regenerating a new image each time', () => {
    beforeEach(() => {
      fs.emptyDir(path.resolve('../../../images/thumb'), (err) => {
        if (err) return console.error(err);
      });
    });

    it('should succesfully return pre-stored image for repeated requests', async () => {
      const url = '/api/images?filename=encenadaport&width=200&height=200';
      await request.get(url);

      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');
    });
  });
});
