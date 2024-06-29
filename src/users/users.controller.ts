import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserQueryDto } from './dto/find-users-query.dto';
import { ChangeUserTypeDto } from './dto/change-user-type.dto';
import { UserIdDto } from './dto/user-id.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { UserTypeGuard } from 'src/guards/user-type.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/services/azure-blob.service';
import { ImageUploadDto } from 'src/shared/dto/File-upload.dto';
import { UserType } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, UserTypeGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly azureService: AzureBlobService,
  ) {}
  @Get('me')
  @ApiOperation({
    summary: 'Get my profile',
  })
  @UserTypes('MUSEUMS_ADMIN', 'SUPPER_ADMIN', 'USER')
  getMe(@Request() req) {
    return req.user;
  }

  @Put('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageUploadDto,
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpeg|jpg)/,
        })
        .build(),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    const imageName = await this.azureService.uploadFile(file, 'User');
    const imageUrl = this.azureService.getBlobUrl(imageName);
    return await this.userService.updateImage(req.user.id, imageUrl);
  }

  @Put('remove-image')
  async removeImage(@Request() req) {
    return await this.userService.updateImage(req.user.id, null);
  }

  @Post()
  @UserTypes('SUPPER_ADMIN', 'MUSEUMS_ADMIN')
  @ApiOperation({
    summary: 'Create new user',
  })
  async createUser(@Body() userData: CreateUserDto, @Request() req) {
    if (req.user.type === UserType.MUSEUMS_ADMIN) {
      userData.museumId = req.user.museum;
    } 

    return await this.userService.createUser(userData);
  }

  @Delete(':id')
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Delete user by id',
  })
  async deleteUser(@Param() userID: UserIdDto) {
    await this.userService.deleteUser(userID.id);
    return {
      message: 'User deleted successfully',
    };
  }

  @Get()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Get all users',
  })
  async getUsers(@Query() query: FindUserQueryDto) {
    return await this.userService.getUsers(query);
  }

  @Patch(':id')
  @UserTypes('SUPPER_ADMIN', 'MUSEUMS_ADMIN')
  @ApiOperation({
    summary: 'Change user type',
  })
  async changeUserType(
    @Param() userID: UserIdDto,
    @Body() userType: ChangeUserTypeDto,
    @Request() req,
  ) {
    userType.userId = userID.id;

    if (req.user.type === UserType.MUSEUMS_ADMIN) {
      userType.museumId = null;
      userType.type = UserType.USER;
    }

    await this.userService.changeUserType(userType);
    return {
      message: `User with id ${userID.id} changed to ${userType.type} successfully`,
    };
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update logged user profile',
  })
  async updateMe(@Body() userData: UpdateUserDto, @Request() req) {
    return await this.userService.updateUser(req.user.id, userData);
  }
}
