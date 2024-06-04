import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MuseumsModule } from './museums/museums.module';
import { CategoriesController } from './categories/categories.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import emailConfig from './config/email.config';
import awsConfig from './config/aws.config';
import { S3Service } from './services/s3.service';
import { AuthUtils } from './utils/auth.utils';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, jwtConfig, emailConfig, awsConfig],
    }),
    MuseumsModule,
    PrismaModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AppController, CategoriesController],
  providers: [
    AppService,
    CategoriesService,
    UsersService,
    S3Service,
    AuthUtils,
    EmailService,
    Logger,
  ],
})
export class AppModule {}
