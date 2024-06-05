import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new HttpException(
          `The ${error.meta?.target} is already existing and it must be unique`,
          HttpStatus.CONFLICT,
        );
      case 'P2003':
        throw new HttpException(
          `Foreign key constraint failed on the field: ${error.meta?.field_name}`,
          HttpStatus.BAD_REQUEST,
        );
      case 'P2025':
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      default:
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
