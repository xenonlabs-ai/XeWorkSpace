import { writeFile, mkdir, unlink, readFile } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface StorageProvider {
  upload(file: Buffer, filename: string, organizationId?: string): Promise<string>;
  delete(url: string): Promise<void>;
  getUrl(filename: string, organizationId?: string): string;
}

// S3 Storage with per-organization folder structure
export class S3Storage implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private region: string;
  private subDir: string;

  constructor(subDir: string = "screenshots") {
    this.region = process.env.AWS_REGION || "us-east-1";
    this.bucket = process.env.AWS_S3_BUCKET || "xeworkspace-media";
    this.subDir = subDir;

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  private getKey(filename: string, organizationId?: string): string {
    // Structure: {subDir}/{organizationId}/{filename}
    // e.g., screenshots/org_abc123/session-123-1234567890.png
    if (organizationId) {
      return `${this.subDir}/${organizationId}/${filename}`;
    }
    return `${this.subDir}/default/${filename}`;
  }

  async upload(file: Buffer, filename: string, organizationId?: string): Promise<string> {
    const key = this.getKey(filename, organizationId);

    const contentType = this.getContentType(filename);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.client.send(command);

    // Return the S3 URL
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async delete(url: string): Promise<void> {
    try {
      // Extract key from URL
      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1); // Remove leading slash

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.warn("Could not delete S3 file:", error);
    }
  }

  getUrl(filename: string, organizationId?: string): string {
    const key = this.getKey(filename, organizationId);
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getSignedUrl(filename: string, organizationId?: string, expiresIn: number = 3600): Promise<string> {
    const key = this.getKey(filename, organizationId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  async read(url: string): Promise<Buffer | null> {
    try {
      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1);

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);

      if (response.Body) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      }
      return null;
    } catch (error) {
      console.warn("Could not read S3 file:", error);
      return null;
    }
  }

  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }
}

// Local Storage (for development/fallback)
export class LocalStorage implements StorageProvider {
  private uploadDir: string;
  private publicPath: string;

  constructor(subDir: string = "screenshots") {
    this.uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    this.publicPath = `/uploads/${subDir}`;
  }

  async upload(file: Buffer, filename: string, organizationId?: string): Promise<string> {
    // Create organization-specific subdirectory
    const orgDir = organizationId || "default";
    const fullDir = path.join(this.uploadDir, orgDir);

    await mkdir(fullDir, { recursive: true });
    const filepath = path.join(fullDir, filename);
    await writeFile(filepath, file);
    return this.getUrl(filename, organizationId);
  }

  async delete(url: string): Promise<void> {
    try {
      // URL format: /uploads/screenshots/{orgId}/{filename}
      const urlPath = url.startsWith("/") ? url : new URL(url).pathname;
      const filepath = path.join(process.cwd(), "public", urlPath);
      await unlink(filepath);
    } catch (error) {
      console.warn("Could not delete file:", error);
    }
  }

  getUrl(filename: string, organizationId?: string): string {
    const orgDir = organizationId || "default";
    return `${this.publicPath}/${orgDir}/${filename}`;
  }

  async read(url: string): Promise<Buffer | null> {
    try {
      const urlPath = url.startsWith("/") ? url : new URL(url).pathname;
      const filepath = path.join(process.cwd(), "public", urlPath);
      return await readFile(filepath);
    } catch (error) {
      console.warn("Could not read file:", error);
      return null;
    }
  }
}

// Factory function to get the appropriate storage provider
function createStorageProvider(subDir: string): StorageProvider {
  const useS3 = process.env.STORAGE_PROVIDER === "s3" && process.env.AWS_S3_BUCKET;

  if (useS3) {
    return new S3Storage(subDir);
  }

  return new LocalStorage(subDir);
}

// Default storage instances
export const screenshotStorage = createStorageProvider("screenshots");
export const videoStorage = createStorageProvider("videos");

// Export factory function for custom subdirectories
export function createStorage(subDir: string): StorageProvider {
  return createStorageProvider(subDir);
}
