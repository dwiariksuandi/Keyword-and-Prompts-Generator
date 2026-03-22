import CryptoJS from 'crypto-js';

// Simple per-device salt
const getDeviceSalt = () => {
  let salt = localStorage.getItem('device_salt');
  if (!salt) {
    salt = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('device_salt', salt);
  }
  return salt;
};

const SECRET_PREFIX = 'gemini-vault-';

export const encryptKey = (key: string): string => {
  if (!key) return '';
  const salt = getDeviceSalt();
  return CryptoJS.AES.encrypt(key, SECRET_PREFIX + salt).toString();
};

export const decryptKey = (encryptedKey: string): string => {
  if (!encryptedKey) return '';
  try {
    const salt = getDeviceSalt();
    const bytes = CryptoJS.AES.decrypt(encryptedKey, SECRET_PREFIX + salt);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
