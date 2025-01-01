import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.createHash('sha256')
    .update(process.env.ENCRYPTION_KEY || 'your-secret-key-32-chars-minimum!!')
    .digest();
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

export function encrypt(text) {
    // Input validation
    if (!text) {
        throw new Error('Encryption failed: Input text is required');
    }

    // Convert text to string if it's not already
    const textToEncrypt = text.toString();

    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(textToEncrypt);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

export function decrypt(text) {
    // Input validation
    if (!text) {
        throw new Error('Decryption failed: Input text is required');
    }

    if (typeof text !== 'string') {
        throw new Error('Decryption failed: Input must be a string');
    }

    if (!text.includes(':')) {
        throw new Error('Decryption failed: Invalid encryption format');
    }

    try {
        const [ivHex, encryptedHex] = text.split(':');

        if (!ivHex || !encryptedHex) {
            throw new Error('Invalid encryption format: Missing IV or encrypted text');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

// Optional: Add a validation function to check if text is properly encrypted
export function isValidEncryptedText(text) {
    if (!text || typeof text !== 'string') return false;
    const parts = text.split(':');
    if (parts.length !== 2) return false;
    const [ivHex, encryptedHex] = parts;
    return ivHex?.length > 0 && encryptedHex?.length > 0;
}