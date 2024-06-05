import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { Observable } from 'rxjs';
import { TYPES_KEY } from 'src/decorators/userTypes.decorato';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredType = this.reflector.getAllAndOverride<UserType[]>(
      TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredType) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasPermission = requiredType.includes(user.type);

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
