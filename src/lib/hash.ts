export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buf = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 해시 앞 8자리를 XXXX-XXXX 형태의 동의 확인 코드로 변환 */
export function formatConsentCode(hash: string): string {
  const upper = hash.toUpperCase().slice(0, 8);
  return `${upper.slice(0, 4)}-${upper.slice(4, 8)}`;
}
