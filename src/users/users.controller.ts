import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('/signout')
  async signOut(@Session() session: any) {
    const userId = session.userId;
    session.userId = null;
    return userId;
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    const parsedId = parseInt(id);
    return this.userService.findById(parsedId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.find();
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    const parsedId = parseInt(id);
    return this.userService.remove(parsedId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const parsedId = parseInt(id);
    return this.userService.update(parsedId, body);
  }
}
