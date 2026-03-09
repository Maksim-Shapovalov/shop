export interface AccessTokenPayload {
  sub: number;
  role: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  refresh: boolean;
}
