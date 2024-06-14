import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthUtils } from 'src/utils/auth.utils';
import { EmailService } from 'src/services/email.service';
import { UsersService } from './users.service';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthUtils, EmailService, Logger, AzureBlobService],
})
export class UsersModule {}
