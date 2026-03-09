import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { ComparisonPasswordDto, GenerateTokenPairDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'libs/common/interfaces';

@Injectable()
export class CryptoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    return argon2.hash(password, { salt });
  }

  async generateTokens(payload: GenerateTokenPairDto) {
    const { userId, role } = payload;

    const accessTokenBody: AccessTokenPayload = {
      sub: Number(userId),
      role: String(role),
    };
    const accessTokenPromise = this.jwtService.signAsync<AccessTokenPayload>(
      accessTokenBody,
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      },
    );
    const refreshTokenBody: RefreshTokenPayload = {
      ...accessTokenBody,
      refresh: true,
    };
    const refreshTokenPromise = this.jwtService.signAsync<RefreshTokenPayload>(
      refreshTokenBody,
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }

  async comparePasswords(payload: ComparisonPasswordDto) {
    const { hash, password } = payload;
    return argon2.verify(hash, password);
  }

  validateRefreshToken(refreshToken: string) {
    if (!refreshToken) return false;

    try {
      const decoded = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      return decoded;
    } catch {
      return false;
    }
  }
}
