import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param() id: Prisma.UserWhereUniqueInput) {
    return this.usersService.user(id);
  }

  @Get()
  async getUsers(@Param() where: Prisma.UserWhereInput) {
    return this.usersService.users(where);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: Prisma.UserWhereUniqueInput,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.usersService.deleteUser(where);
  }
}
