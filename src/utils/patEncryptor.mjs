import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.createHash('sha256') // Hash to ensure 32 bytes
    .update(process.env.ENCRYPTION_KEY || 'your-secret-key-32-chars-minimum!!')
    .digest();

const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    if (!text) throw new Error("decrypt() received undefined or empty text!");
    console.log("Decrypt input:", text);

    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
