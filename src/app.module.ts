import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class AppModule {}
