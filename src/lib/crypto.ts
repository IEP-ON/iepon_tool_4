// AES-GCM 클라이언트 사이드 암호화 (Web Crypto API)
// 암호키는 URL fragment(#)에 포함되어 서버로 전송되지 않음

async function getKeyFromRaw(rawKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(rawKey.padEnd(32, '0').slice(0, 32));
  return crypto.subtle.importKey('raw', keyData, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);
}

function generateKey(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const padded = base64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encrypt(
  plaintext: string
): Promise<{ encrypted: string; key: string }> {
  const key = generateKey();
  const cryptoKey = await getKeyFromRaw(key);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );

  const ivBase64 = arrayBufferToBase64(iv.buffer);
  const ctBase64 = arrayBufferToBase64(ciphertext);

  return {
    encrypted: `${ivBase64}.${ctBase64}`,
    key,
  };
}

export async function decrypt(
  encryptedData: string,
  key: string
): Promise<string | null> {
  try {
    const [ivBase64, ctBase64] = encryptedData.split('.');
    if (!ivBase64 || !ctBase64) return null;

    const cryptoKey = await getKeyFromRaw(key);
    const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
    const ciphertext = base64ToArrayBuffer(ctBase64);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    return null;
  }
}
