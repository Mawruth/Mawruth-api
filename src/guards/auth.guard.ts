import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException(
        "Token doesn't exist, please login again",
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.users.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.active) {
        throw new UnauthorizedException('This account not verified');
      }

      request.user = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        image: user.image,
        type: user.type,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
