import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUserService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockUserService = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@test.com' } as User),
      find: jest
        .fn()
        .mockResolvedValue([{ id: 1, email: 'test@test.com' } as User]),
      update: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'updated@test.com' } as User),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockAuthService = {
      signup: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@test.com' } as User),
      signin: jest
        .fn()
        .mockResolvedValue({ id: 1, email: 'test@test.com' } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a user and store the user id in session', async () => {
    const session = {
      userId: null,
    };

    const body: CreateUserDto = {
      email: 'test@test.com',
      password: 'testpassword',
    };

    const result = await controller.signup(body, session);

    expect(result).toEqual({ id: 1, email: 'test@test.com' });
    expect(session.userId).toEqual(1);
    expect(mockAuthService.signup).toHaveBeenCalledWith(
      'test@test.com',
      'testpassword',
    );
  });

  it('should sign in a user and store the user id in session', async () => {
    const session = {
      userId: null,
    };

    const body: CreateUserDto = {
      email: 'test@test.com',
      password: 'testpassword',
    };

    const result = await controller.signIn(body, session);

    expect(result).toEqual({ id: 1, email: 'test@test.com' });
    expect(session.userId).toEqual(1);
    expect(mockAuthService.signin).toHaveBeenCalledWith(
      'test@test.com',
      'testpassword',
    );
  });

  it('should sign out a user and clear the session', async () => {
    const session = { userId: 1 };

    const result = await controller.signOut(session);

    expect(result).toEqual(1);
    expect(session.userId).toBeNull();
  });

  it('should return a user by id', async () => {
    const result = await controller.findUser('1');
    expect(result).toEqual({ id: 1, email: 'test@test.com' });
    expect(mockUserService.findById).toHaveBeenCalledWith(1);
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(result).toEqual([{ id: 1, email: 'test@test.com' }]);
    expect(mockUserService.find).toHaveBeenCalled();
  });

  it('should remove a user by id', async () => {
    const result = await controller.removeUser('1');
    expect(result).toEqual(true);
    expect(mockUserService.remove).toHaveBeenCalledWith(1);
  });

  it('should update a user by id', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@test.com',
      password: 'newPassword',
    };

    const result = await controller.updateUser('1', updateUserDto);
    expect(result).toEqual({ id: 1, email: 'updated@test.com' });
    expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
  });
});
