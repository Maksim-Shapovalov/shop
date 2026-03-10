import { userRoles } from '@entities/enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: userRoles[]) =>
  SetMetadata('REQUIRED_ROLES', roles);
