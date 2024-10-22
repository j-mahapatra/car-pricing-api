import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let dummyUserService: Partial<UsersService>;

  beforeEach(async () => {
    dummyUserService = {
      findByEmail: (email: string) =>
        Promise.resolve({
          id: 1,
          email,
          password: 'testpassword',
        }),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: dummyUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password on signup', async () => {
    jest.spyOn(dummyUserService, 'findByEmail').mockResolvedValue(null);
    const user = await service.signup('test@email.com', 'testpassword');

    expect(user.password).not.toEqual('testpassword');
    expect(user.password.includes('.')).toEqual(true);

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user already exists', async () => {
    await expect(
      service.signup('test@email.com', 'testpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns an existing user on signin', async () => {
    jest.spyOn(dummyUserService, 'findByEmail').mockResolvedValue({
      id: 1,
      email: 'test@email.com',
      password:
        '52f91425ca157a62.bc01a4835cae641e7e1cfbdbfd57655ff9e6c391df5f4acb9f8b814cf34b22a4',
    });
    const user = await service.signin('test@email.com', '12345');
    expect(user.email).toEqual('test@email.com');
  });

  it('throws an error if user does not exist', async () => {
    jest.spyOn(dummyUserService, 'findByEmail').mockResolvedValue(null);
    await expect(
      service.signin('test@email.com', 'testpassword'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error for incorrect password', async () => {
    await expect(
      service.signin('test@email.com', 'testpassword'),
    ).rejects.toThrow(BadRequestException);
  });
});
