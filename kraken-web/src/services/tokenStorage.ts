const ACCESS_TOKEN_KEY = 'kraken.accessToken';
const REFRESH_TOKEN_KEY = 'kraken.refreshToken';
const USER_ID_KEY = 'unijira_userId';

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
  getUserId() {
    return hasWindow ? window.localStorage.getItem(USER_ID_KEY) : null;
  },
  setUserId(userId: string) {
    if (!hasWindow) {
      return;
    }
    window.localStorage.setItem(USER_ID_KEY, userId);
  },
  clear() {
    if (!hasWindow) {
      return;
    }
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_ID_KEY);
  },
  hasSession() {
    return !!(this.getAccessToken() && this.getRefreshToken());
  },
};
