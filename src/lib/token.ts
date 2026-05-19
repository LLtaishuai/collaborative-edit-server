// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KEY = process.env.API_AUTH_KEY;

export interface TokenInfo {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function decryptToken(token: string): TokenInfo | null {
  // Implementation was empty in original file
  // Returning null as a placeholder to satisfy types
  return null;
}
