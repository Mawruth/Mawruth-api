import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserQueryDto } from './dto/find-users-query.dto';
import { ChangeUserTypeDto } from './dto/change-user-type.dto';
import { UserIdDto } from './dto/user-id.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserTypes } from 'src/decorators/userTypes.decorator';
import { UserTypeGuard } from 'src/guards/user-type.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, UserTypeGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('me')
  @ApiOperation({
    summary: 'Get my profile',
  })
  getMe(@Request() req) {
    return req.user;
  }

  @Post()
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Create new user',
  })
  async createUser(@Body() userData: CreateUserDto) {
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
  @UserTypes('SUPPER_ADMIN')
  @ApiOperation({
    summary: 'Change user type',
  })
  async changeUserType(
    @Param() userID: UserIdDto,
    @Body() userType: ChangeUserTypeDto,
  ) {
    await this.userService.changeUserType(userID.id, userType.type);
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
