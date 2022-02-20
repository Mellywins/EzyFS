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
    console.log('Sending Email to user ', data.user.username);
    return this.emailService.sendEmail(data.user, data.emailType);
  }

  @GrpcMethod('EmailNotificationService', 'ConfirmEmail')
  async confirmEmail(input: {
    user: User;
    token: string;
    verificationToken: string;
    emailType: EmailTypeEnum;
  }) {
    return this.emailService.confirmEmail(
      input.user,
      input.token,
      input.verificationToken,
      input.emailType,
    );
  }

  @GrpcMethod('EmailNotificationService', 'ResetPassword')
  findAllByUserId(input: {userId: number}) {
    return this.emailService.findAllByUserId(input.userId);
  }
}
