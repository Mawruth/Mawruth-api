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
import { AuthUtils } from './utils/auth.utils';
import { EmailService } from './services/email.service';
import { PiecesModule } from './pieces/pieces.module';
import { MuseumReviewsModule } from './museum-reviews/museum-reviews.module';
import azureConfig from './config/azure.config';
import { AzureBlobService } from './services/azure-blob.service';
import { HallsModule } from './halls/halls.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, jwtConfig, emailConfig, awsConfig, azureConfig],
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
    PiecesModule,
    MuseumReviewsModule,
    HallsModule,
    FavoritesModule,
  ],
  controllers: [AppController, CategoriesController],
  providers: [
    AppService,
    CategoriesService,
    UsersService,
    AzureBlobService,
    AuthUtils,
    EmailService,
    Logger,
  ],
})
export class AppModule {}
