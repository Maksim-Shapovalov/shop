import { userRoles } from '@entities/enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'libs/common/types';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const { role } = user;
    const requiredRoles = this.reflector.getAllAndOverride<userRoles[]>(
      'REQUIRED_ROLES',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    if (requiredRoles.includes(role)) {
      return true;
    } else {
      throw new ForbiddenException('Вы не имеете доступа к этому функционалу');
    }
  }
}
