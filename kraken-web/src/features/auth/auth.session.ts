import { tokenStorage } from "../../services/tokenStorage";

export type GlobalRole = "ADMIN" | "TEACHER" | "STUDENT";

const USER_ID_KEY = "unijira_userId";
const ROLE_KEY = "unijira_role";
const hasWindow = typeof window !== "undefined";

export const authSession = {
  getUserId() {
    return hasWindow ? window.localStorage.getItem(USER_ID_KEY) : null;
  },
  setUserId(id: string) {
    if (!hasWindow) {
      return;
    }
    window.localStorage.setItem(USER_ID_KEY, id);
  },
  getRole(): GlobalRole | null {
    if (!hasWindow) {
      return null;
    }
    const value = window.localStorage.getItem(ROLE_KEY);
    if (value === "ADMIN" || value === "TEACHER" || value === "STUDENT") {
      return value;
    }
    return null;
  },
  setRole(role: GlobalRole) {
    if (!hasWindow) {
      return;
    }
    window.localStorage.setItem(ROLE_KEY, role);
  },
  clearSession() {
    if (!hasWindow) {
      return;
    }
    window.localStorage.removeItem(USER_ID_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    tokenStorage.clear();
  },
};
