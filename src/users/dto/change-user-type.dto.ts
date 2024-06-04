import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ChangeUserTypeDto {
  @ApiProperty()
  @IsEnum(['USER', 'SUPPER_ADMIN', 'MUSEUMS_ADMIN'], {
    message: 'user type must be USER, SUPPER_ADMIN, MUSEUMS_ADMIN',
  })
  type: UserType;
}
