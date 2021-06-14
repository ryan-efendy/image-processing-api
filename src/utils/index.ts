import fs from 'fs-extra';

export async function createDirIfNotExist(dirPath: string): Promise<boolean> {
  try {
    await fs.ensureDir(dirPath);
    return true;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
