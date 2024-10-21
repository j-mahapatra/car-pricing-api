import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    const user = this.repo.findOneBy({ id });
    return user;
  }

  find() {
    const users = this.repo.find();
    return users;
  }

  async update(id: number, dataToUpdate: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dataToUpdate);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}