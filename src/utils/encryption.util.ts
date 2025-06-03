import * as crypto from 'crypto';

export class EncryptionUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  private static getKey(): Buffer {
    const secretKey =
      process.env.ENCRYPTION_SECRET_KEY ||
      'your-32-character-secret-key-here!!';
    return crypto.scryptSync(secretKey, 'salt', 32);
  }

  static encrypt(text: string): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return (
        iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
      );
    } catch (error) {
      throw new Error('암호화 중 오류가 발생했습니다.' + error);
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('잘못된 암호화 형식입니다.');
      }

      const key = this.getKey();
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('복호화 중 오류가 발생했습니다.' + error);
    }
  }

  static encryptBillingKey(billingKey: string): string {
    return this.encrypt(billingKey);
  }

  static decryptBillingKey(encryptedBillingKey: string): string {
    return this.decrypt(encryptedBillingKey);
  }

  static isEncrypted(text: string): boolean {
    return text.includes(':') && text.split(':').length === 3;
  }
}
