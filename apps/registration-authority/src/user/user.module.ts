import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {RedisCacheModule} from '@ezyfs/internal/modules/cache/redis-cache.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisCacheModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
