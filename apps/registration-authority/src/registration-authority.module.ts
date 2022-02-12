import {ConsulConfigModule, ConsulServiceKeys} from '@ezyfs/internal';
import {dbConnectionFactory, User} from '@ezyfs/repositories';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConsulService} from 'nestjs-consul';
import {RegistrationAuthorityController} from './registration-authority.controller';
import {RegistrationAuthorityService} from './registration-authority.service';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConsulConfigModule],
      useFactory: (consul) =>
        dbConnectionFactory(
          consul,
          ConsulServiceKeys.REGISTRATION_AUTHORITY,
          '/dist/apps/registration-authority/libs/repositories/src/**/*.entity{.ts,.js}',
        ),
      inject: [ConsulService],
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
  ],
  controllers: [RegistrationAuthorityController],
  providers: [RegistrationAuthorityService],
  exports: [TypeOrmModule],
})
export class RegistrationAuthorityModule {}
