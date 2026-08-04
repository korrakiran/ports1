import type {
  AnalysisResult,
  ChatMessage,
  PublicUser
} from '@shared/types';

/**
 * Single place that talks to the API.
 *
 * Every request sends credentials so the httpOnly session cookie travels with it —
 * session state is managed server-side and never exposed to client-side JavaScript.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== 'undefined' ? '' : 'http://localhost:4000');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        // FormData sets its own multipart boundary; setting it manually breaks it.
        ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...init.headers
      }
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Is the API running on port 4000?');
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      payload?.error ?? `Request failed (${res.status}).`,
      payload?.details
    );
  }

  return payload as T;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<{ user: PublicUser }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email: string, password: string) =>
    request<{ user: PublicUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),

  me: () => request<{ user: PublicUser }>('/api/auth/me'),

  profile: () =>
    request<{ user: PublicUser; analyses: AnalysisListItem[] }>('/api/auth/profile')
};

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

export interface AnalysisListItem {
  id: string;
  description: string;
  createdAt: string;
  category: string | null;
  marketCount: number;
}

export const analysisApi = {
  create: (form: FormData) =>
    request<AnalysisResult>('/api/analysis', { method: 'POST', body: form }),

  get: (id: string) => request<AnalysisResult>(`/api/analysis/${id}`),

  list: () => request<AnalysisListItem[]>('/api/analysis'),

  chat: (id: string, message: string) =>
    request<ChatMessage>(`/api/analysis/${id}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
};
