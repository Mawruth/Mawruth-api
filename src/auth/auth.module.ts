import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUtils } from 'src/utils/auth.utils';
import { EmailService } from 'src/services/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthUtils, EmailService, Logger],
})
export class AuthModule {}
