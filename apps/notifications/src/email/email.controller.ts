import {EmailTypeEnum} from '@ezyfs/common';
import {User} from '@ezyfs/repositories';
import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {EmailService} from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('EmailNotificationService', 'SendEmail')
  async SendEmail(data: {user: User; emailType: EmailTypeEnum}) {
    return this.emailService.sendEmail(data.user, data.emailType);
  }
}
