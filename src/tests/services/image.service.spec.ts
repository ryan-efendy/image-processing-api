import { transformImage } from '../../services/image.service';

describe('transformImage', () => {
  it('should throw an error because missing filename.', async () => {
    //arrange
    const filename = '';
    const width = '250';
    const height = '250';
    const format = 'jpg';
    const blur = 'true';
    const graysacle = 'true';

    //act & assert
    expect(async () => await transformImage(filename, width, height, format, blur, graysacle)).rejects.toThrow(
      'Either filename, width or height is missing.',
    );
  });

  it('should throw an error because missing width.', async () => {
    //arrange
    const filename = 'foo';
    const width = '';
    const height = '250';
    const format = 'jpg';
    const blur = 'true';
    const graysacle = 'true';

    //act & assert
    expect(async () => await transformImage(filename, width, height, format, blur, graysacle)).rejects.toThrow(
      'Either filename, width or height is missing.',
    );
  });

  it('should throw an error because missing height.', async () => {
    //arrange
    const filename = 'foo';
    const width = '250';
    const height = '';
    const format = 'jpg';
    const blur = 'true';
    const graysacle = 'true';

    //act & assert
    expect(async () => await transformImage(filename, width, height, format, blur, graysacle)).rejects.toThrow(
      'Either filename, width or height is missing.',
    );
  });

  it('should throw an error because width is not a number.', async () => {
    //arrange
    const filename = 'foo';
    const width = 'bar';
    const height = '250';
    const format = 'jpg';
    const blur = 'true';
    const graysacle = 'true';

    //act & assert
    expect(async () => await transformImage(filename, width, height, format, blur, graysacle)).rejects.toThrow(
      'Invalid width or height. Width or height must be a number.',
    );
  });

  it('should throw an error because height is not a number.', async () => {
    //arrange
    const filename = 'foo';
    const width = '250';
    const height = 'bar';
    const format = 'jpg';
    const blur = 'true';
    const graysacle = 'true';

    //act & assert
    expect(async () => await transformImage(filename, width, height, format, blur, graysacle)).rejects.toThrow(
      'Invalid width or height. Width or height must be a number.',
    );
  });
});
