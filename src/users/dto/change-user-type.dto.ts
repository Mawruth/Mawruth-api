import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class ChangeUserTypeDto {
  userId?: number;

  @ApiProperty()
  @IsEnum(['USER', 'SUPPER_ADMIN', 'MUSEUMS_ADMIN'], {
    message: 'user type must be USER, SUPPER_ADMIN, MUSEUMS_ADMIN',
  })
  type: UserType;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  museumId?: number;
}
