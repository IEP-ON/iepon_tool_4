import LZString from 'lz-string';

export function compress(data: unknown): string {
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decompress<T>(encoded: string): T | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getUrlLength(baseUrl: string, data: string): number {
  return baseUrl.length + data.length;
}

export const MAX_SAFE_URL_LENGTH = 8000;
