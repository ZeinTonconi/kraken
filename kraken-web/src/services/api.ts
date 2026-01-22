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
  const headers: HeadersInit = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
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

export const apiRequest = async <T>(
  path: string,
  { method = 'GET', body, token }: ApiRequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: buildHeaders(token, body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const message = resolveErrorMessage(payload, 'Request failed');
    throw new HttpError(message, response.status, payload);
  }

  return payload as T;
};
