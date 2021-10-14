import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {EmailModule} from '../email/email.module';
import {RedisCacheModule} from '../redis-cache/redis-cache.module';
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';
import {User} from './entities/user.entity';

@Module({
  providers: [UserResolver, UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    RedisCacheModule,
    AuthModule,
  ],
  exports: [UserService],
})
export class UserModule {}
