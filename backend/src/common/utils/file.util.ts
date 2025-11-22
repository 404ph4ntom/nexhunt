import * as crypto from 'crypto';
import { extname } from 'path';

export class FileUtil {
  static generateUniqueFilename(originalName: string): string {
    const ext = extname(originalName);
    const randomString = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${randomString}${ext}`;
  }

  static validateFileType(
    filename: string,
    allowedTypes: string[],
  ): boolean {
    const ext = extname(filename).toLowerCase().slice(1);
    return allowedTypes.includes(ext);
  }

  static validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .slice(0, 255);
  }

  static getMimeType(filename: string): string {
    const ext = extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.zip': 'application/zip',
      '.json': 'application/json',
      '.sol': 'text/plain',
      '.js': 'text/javascript',
      '.ts': 'text/typescript',
      '.html': 'text/html',
      '.css': 'text/css',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}

