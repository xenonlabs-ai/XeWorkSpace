import { desktopCapturer, screen } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

class ScreenshotCapture {
  private tempDir: string | null = null;

  private getTempDir(): string {
    if (!this.tempDir) {
      this.tempDir = path.join(app.getPath('temp'), 'xe-agent-screenshots');
      this.ensureTempDir();
    }
    return this.tempDir;
  }

  private ensureTempDir(): void {
    if (this.tempDir && !fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async capture(): Promise<string | null> {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().workAreaSize,
      });

      if (sources.length === 0) {
        console.error('No screen sources found');
        return null;
      }

      const primarySource = sources[0];
      const image = primarySource.thumbnail;

      if (!image || image.isEmpty()) {
        console.error('Screenshot image is empty');
        return null;
      }

      const filename = `screenshot-${uuidv4()}.png`;
      const filepath = path.join(this.getTempDir(), filename);

      fs.writeFileSync(filepath, image.toPNG());
      console.log('Screenshot captured:', filepath);

      return filepath;
    } catch (error) {
      console.error('Screenshot capture error:', error);
      return null;
    }
  }

  cleanup(filepath: string): void {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }

  cleanupAll(): void {
    try {
      const tempDir = this.getTempDir();
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          const filepath = path.join(tempDir, file);
          fs.unlinkSync(filepath);
        }
      }
    } catch (error) {
      console.warn('Cleanup all error:', error);
    }
  }
}

export const screenshotCapture = new ScreenshotCapture();
