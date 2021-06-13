import fs from 'fs-extra';

export async function createDirIfNotExist(dirPath: string) {
  try {
    await fs.ensureDir(dirPath);
    return true;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
