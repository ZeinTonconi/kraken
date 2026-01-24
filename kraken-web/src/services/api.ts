import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:3000';

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
};

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

const rawBaseUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_BASE_URL;
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const buildHeaders = (token?: string, hasBody?: boolean) => {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const resolveErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload;
  }
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (Array.isArray(message)) {
      return message.filter((item) => typeof item === 'string').join(', ') || fallback;
    }
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};

const client = axios.create({
  baseURL: baseUrl,
});

export const apiRequest = async <T>(
  path: string,
  { method = 'GET', body, token }: ApiRequestOptions = {},
): Promise<T> => {
  try {
    const response = await client.request<T>({
      url: path,
      method,
      data: body,
      headers: buildHeaders(token, body !== undefined),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const payload = error.response?.data;
      const message = resolveErrorMessage(payload, error.message || 'Request failed');
      throw new HttpError(message, status, payload);
    }
    throw error;
  }
};
