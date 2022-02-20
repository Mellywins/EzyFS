import {Inject, Module} from '@nestjs/common';
import {EmailService} from './email.service';
import {EmailController} from './email.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Email} from '@ezyfs/repositories';
import {MailerModule, MailerOptions} from '@nestjs-modules/mailer';
import {join} from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {ConsulConfigModule, ConsulServiceKeys} from '@ezyfs/internal';
import {ConsulService} from 'nestjs-consul';
import {NotificationsConfig} from '@ezyfs/internal/interfaces/configs/notifications.config';
import {BullModule, BullModuleOptions} from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    MailerModule.forRootAsync({
      imports: [ConsulConfigModule],
      inject: [ConsulService],
      useFactory: async (consul: ConsulService<NotificationsConfig>) => {
        const config = await consul.get<NotificationsConfig>(
          ConsulServiceKeys.NOTIFICATIONS,
        );
        const mailOptions: MailerOptions = {
          transport: {
            host: config.notification.email.transport.host,
            port: config.notification.email.transport.port,
            auth: {
              user: config.notification.email.transport.user,
              pass: config.notification.email.transport.password,
            },
          },
          defaults: {
            from: config.notification.email.defaults.from,
          },
          template: {
            dir: join(process.cwd(), 'dist/apps/notifications/templates'),
            adapter: new HandlebarsAdapter(),
          },
        };
        return mailOptions;
      },
    }),
    BullModule.registerQueueAsync({
      name: 'EMAIL-QUEUE',
      imports: [ConsulConfigModule],
      inject: [ConsulService],
      useFactory: async (
        consul: ConsulService<NotificationsConfig>,
      ): Promise<BullModuleOptions> => {
        const config = await consul.get<NotificationsConfig>(
          ConsulServiceKeys.NOTIFICATIONS,
        );
        return {
          name: 'EMAIL-QUEUE',
          redis: {
            host: config.databases.redis.host,
            port: config.databases.redis.port,
          },
        };
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
