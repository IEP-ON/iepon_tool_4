/**
 * AES-256-GCM 클라이언트 측 암호화/복호화
 * Web Crypto API 사용 (브라우저 네이티브)
 */

function hexEncode(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexDecode(hex: string): Uint8Array {
  const bytes = hex.match(/.{1,2}/g);
  if (!bytes) throw new Error("Invalid hex string");
  return new Uint8Array(bytes.map((b) => parseInt(b, 16)));
}

/** 256비트 AES-GCM 키를 생성하고 hex 문자열로 반환 */
export async function generateKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  return hexEncode(raw);
}

/** 데이터를 AES-256-GCM으로 암호화. iv와 ciphertext를 hex로 반환 */
export async function encryptData(
  data: unknown,
  keyHex: string,
): Promise<{ encrypted: string; iv: string }> {
  const keyBytes = hexDecode(keyHex);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    encoded,
  );

  return {
    encrypted: hexEncode(ciphertext),
    iv: hexEncode(iv.buffer),
  };
}

/** AES-256-GCM 복호화 */
export async function decryptData<T = unknown>(
  encryptedHex: string,
  ivHex: string,
  keyHex: string,
): Promise<T> {
  const keyBytes = hexDecode(keyHex);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  const iv = hexDecode(ivHex);
  const ciphertext = hexDecode(encryptedHex);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer,
  );

  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded) as T;
}

/** SHA-256 해시 (학생명 등 PII 해싱용) */
export async function sha256(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return hexEncode(hashBuffer);
}
