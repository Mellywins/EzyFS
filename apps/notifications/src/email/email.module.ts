import {Module} from '@nestjs/common';
import {EmailService} from './email.service';
import {EmailController} from './email.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Email} from '@ezyfs/repositories';
import {MailerModule} from '@nestjs-modules/mailer';
import {join} from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {emailCredentials} from 'apps/core/src/config/email-config-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: emailCredentials,
      },
      defaults: {
        from: 'project.tech@gmail.com',
      },
      template: {
        dir: join(process.cwd(), 'src/templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
