import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthUtils } from 'src/utils/auth.utils';
import { AuthResponseDto } from './dto/auth-res.dto';
import { EmailService } from 'src/services/email.service';
import { OtpUtils } from 'src/utils/otp.utilis';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtils: AuthUtils,
    private readonly emailService: EmailService,
  ) {}

  async signup(userDate: UserSignupDto) {
    const { name, username, email, password } = userDate;
    const user = await this.prisma.users.findMany({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (user.length > 0) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.authUtils.hashPassword(password);

    const otp = OtpUtils.generateOtp();
    await this.prisma.users.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        otp,
        otp_created_at: new Date(Date.now()).toISOString(),
        otp_expire_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      },
    });

    await this.emailService.sendActiveOtp(email, otp);

    return {
      message:
        'User created successfully, check your email for otp verification',
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (
      !user ||
      (user && !(await this.authUtils.comparePassword(password, user.password)))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      throw new UnauthorizedException(
        'This account not verified, check your email and verify your account',
      );
    }

    const token = this.authUtils.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    };
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<AuthResponseDto | { message: string }> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        otp,
        otp_expire_at: {
          gte: new Date(Date.now()).toISOString(),
        },
        otp_verified: false,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found or invalid otp');
    }

    const isActive = user.active;

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        otp: null,
        otp_created_at: null,
        otp_expire_at: null,
        active: true,
        otp_verified: true,
      },
    });

    if (!isActive) {
      const token = this.authUtils.generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        },
      };
    }

    return {
      message: 'Otp verified successfully',
    };
  }

  async resendActiveOtp(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        active: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found or is already verified');
    }

    const otp = OtpUtils.generateOtp();
    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        otp,
        otp_created_at: new Date(Date.now()).toISOString(),
        otp_expire_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        otp_verified: false,
      },
    });

    await this.emailService.sendActiveOtp(email, otp);
    return {
      message: 'otp resent successfully, check your email for otp verification',
    };
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        active: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found or this account is not active',
      );
    }

    const otp = OtpUtils.generateOtp();
    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        otp,
        otp_created_at: new Date(Date.now()).toISOString(),
        otp_expire_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        otp_verified: false,
      },
    });

    const send = await this.emailService.sendForgotPasswordOtp(email, otp);
    if (!send) {
      throw new BadRequestException('Failed to send otp, please try again');
    }

    return {
      message: 'otp sent successfully, check your email for otp verification',
    };
  }

  async resetPassword(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        otp_verified: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found or this account is not active',
      );
    }

    const hashedPassword = await this.authUtils.hashPassword(password);
    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        otp: null,
        otp_created_at: null,
        otp_expire_at: null,
        otp_verified: false,
      },
    });

    const token = this.authUtils.generateToken(user.id);

    return {
      token,
    };
  }

  async changePassword(
    user_id: number,
    current_password: string,
    new_password: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (
      !user ||
      (user &&
        !(await this.authUtils.comparePassword(
          current_password,
          user.password,
        )))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const hashedPassword = await this.authUtils.hashPassword(new_password);
    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    const token = this.authUtils.generateToken(user_id);

    return {
      token,
    };
  }
}
