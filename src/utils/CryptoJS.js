import CryptoJS from "crypto-js";

// Example secret key (must be 32 bytes for AES-256)
const SECRET_KEY = "souqsayarat2024encryptionkey32";

// Encrypt a string
export const encryptData = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

// Decrypt a string
export const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
