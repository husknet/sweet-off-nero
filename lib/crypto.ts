// AES-GCM with a key derived from NEXT_PUBLIC_AES_KEY + NEXT_PUBLIC_AES_SALT via PBKDF2.
// This lets both pages derive the same key without storing secrets in code.
// Note: NEXT_PUBLIC_* vars are visible to the client (for rotation/config, not secrecy).

const PASS = process.env.NEXT_PUBLIC_AES_KEY || '';
const SALT = process.env.NEXT_PUBLIC_AES_SALT || '';
if (!PASS || !SALT) {
  console.warn('Missing NEXT_PUBLIC_AES_KEY or NEXT_PUBLIC_AES_SALT. Set them in .env.local / Vercel.');
}

function toBase64Url(b64: string) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(u: string) {
  const b64 = u.replace(/-/g, '+').replace(/_/g, '/');
  return b64 + '==='.slice((b64.length + 3) % 4);
}

function bytesToBase64(arr: Uint8Array | ArrayBuffer): string {
  const bytes = arr instanceof ArrayBuffer ? new Uint8Array(arr) : arr;
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(PASS),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(SALT), iterations: 150_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt email; returns base64url(iv + ciphertext)
export async function encryptEmail(email: string): Promise<string> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(email));
  const payload = new Uint8Array(iv.length + (cipher as ArrayBuffer).byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(cipher as ArrayBuffer), iv.length);
  return toBase64Url(bytesToBase64(payload));
}

// Decrypt base64url(iv + ciphertext) to plaintext email
export async function decryptEmail(urlToken: string): Promise<string> {
  const b64 = fromBase64Url(urlToken);
  const all = base64ToBytes(b64);
  const iv = all.slice(0, 12);
  const data = all.slice(12);
  const key = await getKey();
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(plain);
}
