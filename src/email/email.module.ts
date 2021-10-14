import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {join} from 'path';
import {EmailService} from './email.service';
import {EmailResolver} from './email.resolver';
import {Email} from './entities/email.entity';
// import {UserService} from '../user/user.service';
import {emailCredentials} from '../config/email-config-service';

@Module({
  providers: [EmailResolver, EmailService],
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
  exports: [EmailService],
})
export class EmailModule {}
