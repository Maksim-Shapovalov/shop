import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.getOrThrow('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow('JWT_EXPIRATION_TIME'),
    },
  };
};
