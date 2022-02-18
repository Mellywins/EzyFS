import {ConsulConfigModule, ConsulServiceKeys} from '@ezyfs/internal';
import {dbConnectionFactory, Email, User} from '@ezyfs/repositories';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConsulService} from 'nestjs-consul';
import {EmailModule} from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConsulConfigModule],
      useFactory: (consul) =>
        dbConnectionFactory(
          consul,
          ConsulServiceKeys.NOTIFICATIONS,
          '/dist/apps/notifications/libs/repositories/src/**/*.entity{.ts,.js}',
        ),
      inject: [ConsulService],
    }),
    TypeOrmModule.forFeature([User, Email]),
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}
