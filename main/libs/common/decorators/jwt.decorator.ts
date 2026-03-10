import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../types/jwtPayload.types';

export const Jwt = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const payload = (request as any).user as JwtPayload;

    if (data) {
      return payload[data] as Record<string, unknown>;
    }

    return payload;
  },
);
