import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUtils } from 'src/utils/auth.utils';
import { EmailService } from 'src/services/email.service';
import { OtpUtils } from 'src/utils/otp.utilis';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { FindUserQueryDto } from './dto/find-users-query.dto';
import { Prisma, UserType } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtils: AuthUtils,
    private readonly emailService: EmailService,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const { name, username, email, password, type } = userDto;
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
        type,
        otp,
        otp_created_at: new Date(Date.now()).toISOString(),
        otp_expire_at: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      },
    });

    await this.emailService.sendActiveOtp(email, otp);

    return {
      message: 'User created successfully',
    };
  }

  async deleteUser(userId: number) {
    try {
      await this.prisma.users.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getUsers(userQuery: FindUserQueryDto) {
    const page = userQuery.page || 1;
    const limit = userQuery.limit || 50;
    const skip = (page - 1) * limit;
    const search = userQuery.search;
    const where: Prisma.UsersWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          email: { contains: search, mode: 'insensitive' },
        },
        {
          username: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    if (userQuery.type) {
      where.type = { equals: userQuery.type };
    }

    return await this.prisma.users.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        type: true,
        image: true,
      },
    });
  }

  async changeUserType(userId: number, type: UserType) {
    try {
      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          type,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateUser(userId: number, userData: UpdateUserDto) {
    try {
      return await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          image: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateImage(userId: number, imagePath: string) {
    try {
      return await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          image: imagePath,
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          image: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
