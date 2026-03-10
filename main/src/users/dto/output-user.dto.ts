import { User } from '@entities/Users.entity';
import { OmitType } from '@nestjs/mapped-types';

export class OutputUserDto extends OmitType(User, ['password'] as const) {}
