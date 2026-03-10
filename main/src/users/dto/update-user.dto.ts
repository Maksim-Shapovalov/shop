import { User } from '@entities/index';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(User) {}
