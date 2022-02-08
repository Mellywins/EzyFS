import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {JwtStrategy} from './strategies/jwt.strategy';
import {AuthResolver} from './auth.resolver';
import {AuthService} from './auth.service';
import {RedisCacheModule} from '../redis-cache/redis-cache.module';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    JwtModule.register({
      signOptions: {expiresIn: 3600},
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
