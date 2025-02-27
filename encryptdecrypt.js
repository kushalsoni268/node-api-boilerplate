const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Using AES encryption

/* To Generate Key & Iv */
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

const key = process.env.Key;
const iv = process.env.Iv;

exports.encrypt = (text) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

exports.decrypt = (text) => {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

