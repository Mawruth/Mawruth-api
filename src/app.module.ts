import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, jwtConfig, emailConfig],
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
  providers: [AppService, CategoriesService, UsersService],
})
export class AppModule {}
