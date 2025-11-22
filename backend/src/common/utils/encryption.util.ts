import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export class EncryptionUtil {
  private static getKey(encryptionKey: string): Buffer {
    return crypto
      .createHash('sha256')
      .update(encryptionKey)
      .digest()
      .slice(0, KEY_LENGTH);
  }

  static encrypt(text: string, encryptionKey: string): string {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }

    const key = this.getKey(encryptionKey);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedText: string, encryptionKey: string): string {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }

    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const key = this.getKey(encryptionKey);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

