export interface ITokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;

  setUser(user: unknown): void;
  getUser(): unknown;
  
  // Returns string for LocalStorage, null for Cookie (hidden)
  getRefreshToken(): string | null; 
  setRefreshToken(token: string | null): void;
  
  clear(): void;
}