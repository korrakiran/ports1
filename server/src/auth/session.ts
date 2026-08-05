export const SESSION_COOKIE = 'portsai.sid';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
