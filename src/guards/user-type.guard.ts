import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { Observable } from 'rxjs';
import { TYPES_KEY } from 'src/decorators/userTypes.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredType = this.reflector.getAllAndOverride<UserType[]>(
      TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredType) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const hasPermission = requiredType.includes(user.type);

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    if (user.type === UserType.MUSEUMS_ADMIN) {
      const museum = await this.prismaService.museumsAdmins.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!museum) {
        throw new UnauthorizedException(
          'You do not have permission to access this resource',
        );
      }
      req.user.museum = museum.museumId;
    }
    return true;
  }
}
