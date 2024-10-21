import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    this.userService.create(email, password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    const parsedId = parseInt(id);
    return this.userService.findOne(parsedId);
  }

  @Get()
  findAll() {
    return this.userService.find();
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    const parsedId = parseInt(id);
    return this.userService.remove(parsedId);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const parsedId = parseInt(id);
    return this.userService.update(parsedId, body);
  }
}
