import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities/users/user.entity';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {RedisCacheModule} from '@ezyfs/internal/modules/cache/redis-cache.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {
  ConsulConfigModule,
  ConsulServiceKeys,
  RegistrationAuthorityConfig,
} from '@ezyfs/internal';
import {ConsulService} from 'nestjs-consul';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConsulConfigModule],
      inject: [ConsulService],
      useFactory: async (
        consul: ConsulService<RegistrationAuthorityConfig>,
      ) => {
        const config = await consul.get<RegistrationAuthorityConfig>(
          ConsulServiceKeys.REGISTRATION_AUTHORITY,
        );
        return {
          secret: config.auth.jwtSettings.secret,
          signOptions: {
            expiresIn: config.auth.jwtSettings.expiresIn,
          },
        };
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    RedisCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
