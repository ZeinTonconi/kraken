import { apiRequest } from './api';
import type { UserProfile } from '../types/user';

export const getMe = (token: string) => {
  return apiRequest<UserProfile>('/me', { token });
};
