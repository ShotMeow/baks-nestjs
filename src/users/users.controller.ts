import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async getUserById(@Param() id: string) {
    return this.usersService.user(+id);
  }

  @Get()
  async getUsers(
    @Query() query: { take?: string; page?: number; search: string },
  ) {
    return this.usersService.users({
      ...query,
      take: query.take && +query.take,
      page: query.page && +query.page,
    });
  }

  @Patch('/:id/edit')
  @FormDataRequest()
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(+id, user);
  }

  @Delete('/:id/delete')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
