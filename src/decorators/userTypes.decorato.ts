import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export const TYPES_KEY = 'userType';

export const UserTypes = (...types: UserType[]) =>
  SetMetadata(TYPES_KEY, types);
