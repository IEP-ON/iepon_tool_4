import type { ConsentMeta } from "./types";

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const buf = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function collectMeta(docHash: string): Promise<ConsentMeta> {
  let ip = "알 수 없음";
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json();
    ip = data.ip ?? "알 수 없음";
  } catch {
    // 네트워크 오류 시 조용히 무시
  }

  const userAgent = navigator.userAgent;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const deviceFingerprint = await hashString(
    `${userAgent}|${navigator.language}|${timezone}|${screen}`
  );
  const clientTimestamp = new Date().toISOString();

  return { ip, userAgent, timezone, screen, deviceFingerprint, clientTimestamp, docHash };
}
