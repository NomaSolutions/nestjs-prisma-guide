import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.userRepository.create(data);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findById(id);
  }

  update(id: number, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
