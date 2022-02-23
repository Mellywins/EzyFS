import {Module} from '@nestjs/common';
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
import {EmailBullQueue} from './providers/bull-queue.service';

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
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailBullQueue],
  exports: [],
})
export class EmailsModule {}
