import LZString from "lz-string";

export function compress<T>(data: T): string {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(data));
  } catch (e) {
    console.error("Compression failed", e);
    return "";
  }
}

export function decompress<T>(encoded: string): T | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error("Decompression failed", e);
    return null;
  }
}
