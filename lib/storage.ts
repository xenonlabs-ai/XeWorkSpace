import { writeFile, mkdir, unlink, readFile } from "fs/promises";
import path from "path";

export interface StorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  delete(url: string): Promise<void>;
  getUrl(filename: string): string;
}

export class LocalStorage implements StorageProvider {
  private uploadDir: string;
  private publicPath: string;

  constructor(subDir: string = "screenshots") {
    this.uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    this.publicPath = `/uploads/${subDir}`;
  }

  async upload(file: Buffer, filename: string): Promise<string> {
    await mkdir(this.uploadDir, { recursive: true });
    const filepath = path.join(this.uploadDir, filename);
    await writeFile(filepath, file);
    return this.getUrl(filename);
  }

  async delete(url: string): Promise<void> {
    try {
      const filename = path.basename(url);
      const filepath = path.join(this.uploadDir, filename);
      await unlink(filepath);
    } catch (error) {
      console.warn("Could not delete file:", error);
    }
  }

  getUrl(filename: string): string {
    return `${this.publicPath}/${filename}`;
  }

  async read(url: string): Promise<Buffer | null> {
    try {
      const filename = path.basename(url);
      const filepath = path.join(this.uploadDir, filename);
      return await readFile(filepath);
    } catch (error) {
      console.warn("Could not read file:", error);
      return null;
    }
  }
}

// Default storage instance for screenshots
export const screenshotStorage = new LocalStorage("screenshots");

// Export a factory function for creating storage with different subdirectories
export function createStorage(subDir: string): StorageProvider {
  return new LocalStorage(subDir);
}
