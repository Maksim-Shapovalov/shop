import { userRoles } from '@entities/enum';

export type JwtPayload = {
  sub: number;
  iat: number;
  exp: number;
  role: userRoles;
  refresh?: boolean;
  refreshToken?: string;
  refreshTokenHash?: string;
};

export type TokensPair = {
  accessToken: string;
  refreshToken: string;
};

export type ResetPasswordJwtPayload = {
  sub: string;
  companyId?: number;
  iat: number;
  exp: number;
};
