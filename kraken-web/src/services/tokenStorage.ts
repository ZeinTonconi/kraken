const ACCESS_TOKEN_KEY = 'kraken.accessToken';
const REFRESH_TOKEN_KEY = 'kraken.refreshToken';

const hasWindow = typeof window !== 'undefined';

export const tokenStorage = {
  getAccessToken() {
    return hasWindow ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },
  getRefreshToken() {
    return hasWindow ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },
  setTokens(accessToken: string, refreshToken: string) {
    if (!hasWindow) {
      return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear() {
    if (!hasWindow) {
      return;
    }
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  hasSession() {
    return !!(this.getAccessToken() && this.getRefreshToken());
  },
};
