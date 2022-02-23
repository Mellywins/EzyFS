import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from '@nestjs/bull';
import {AppService} from './app.service';
import {SchedulerModule} from './scheduler/scheduler.module';
import {CryptoModule} from './crypto/crypto.module';
import {ConsulConfigModule, ConsulServiceKeys} from '@ezyfs/internal';
import {dbConnectionFactory} from '@ezyfs/repositories';
import {ConsulService} from 'nestjs-consul';

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
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    CryptoModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [AppService],
})
// eslint-disable-next-line import/prefer-default-export
export class AppModule {}
