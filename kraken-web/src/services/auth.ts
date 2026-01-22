import { apiRequest } from './api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: string;
  role: string;
  accessToken: string;
  refreshToken: string;
};

export const login = (payload: LoginPayload) => {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
};
