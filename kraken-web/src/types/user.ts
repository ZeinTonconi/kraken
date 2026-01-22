export type UserProfile = {
  id: string;
  email: string;
  status: string;
  profile: {
    fullName: string;
    handle: string | null;
    avatarUrl: string | null;
    role: string;
  };
  wallet: {
    coinsBalance: number;
    diamondsBalance: number;
  };
};
