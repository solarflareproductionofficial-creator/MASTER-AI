/**
 * Web Crypto API AES-GCM 256-bit End-to-End Encryption Suite
 * Protects user chat histories, sensitive memory nodes, and personal notes.
 */

const SALT = new Uint8Array([109, 97, 115, 116, 101, 114, 97, 105, 95, 115, 101, 99, 117, 114, 101]); // "masterai_secure"
const DEFAULT_KEY_STORAGE = 'master_ai_enc_key_hash';

// Derive CryptoKey from a user passphrase or default master key
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypt plain text using AES-GCM 256
 */
export async function encryptData(text: string, passphrase = 'master_ai_vault_key'): Promise<string> {
  try {
    const key = await deriveKey(passphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedData = enc.encode(text);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );

    const payload = {
      iv: arrayBufferToBase64(iv.buffer),
      data: arrayBufferToBase64(ciphertext),
      alg: 'AES-GCM-256',
      ts: Date.now(),
    };

    return JSON.stringify(payload);
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Şifreleme işlemi başarısız oldu.');
  }
}

/**
 * Decrypt AES-GCM 256 payload
 */
export async function decryptData(encryptedPayloadString: string, passphrase = 'master_ai_vault_key'): Promise<string> {
  try {
    // If not JSON or does not contain IV, return raw (fallback for unencrypted data)
    if (!encryptedPayloadString.startsWith('{') || !encryptedPayloadString.includes('"iv"')) {
      return encryptedPayloadString;
    }

    const payload = JSON.parse(encryptedPayloadString);
    const key = await deriveKey(passphrase);
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
    const ciphertext = base64ToArrayBuffer(payload.data);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    return '🔒 [Şifreli Veri - Parola Geçersiz ya da Veri Bozuk]';
  }
}

/**
 * Generate a short cryptographic fingerprint
 */
export async function generateFingerprint(input: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(input));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}
