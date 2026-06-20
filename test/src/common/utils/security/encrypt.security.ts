import * as crypto from 'crypto';


const ALGORITHM = 'aes-256-cbc';

const deriveKey = (secret: string): Buffer => {
  return crypto.createHash('sha256').update(secret).digest(); // 32 bytes
};

const deriveIv = (secret: string): Buffer => {
  return crypto.createHash('md5').update(secret).digest(); // 16 bytes
};


export const generateEncryption = (plainText: string, secret: string): string => {
  const key = deriveKey(secret);
  const iv = deriveIv(secret);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};


export const decryptEncryption = (cipherText: string, secret: string): string => {
  const key = deriveKey(secret);
  const iv = deriveIv(secret);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
