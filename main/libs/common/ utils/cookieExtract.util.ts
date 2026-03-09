import { Request } from 'express';

export const cookieExtractor = (req: Request): string | null => {
  if (req && 'cookies' in req && req.cookies) {
    return req.cookies['accessToken'] || req.cookies['access_token'] || null;
  }
  return null;
};
