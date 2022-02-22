/* eslint-disable class-methods-use-this */
import {EmailTypeEnum, SENDING_EMAIL_ERROR_MESSAGE} from '@ezyfs/common';
import {Email, User} from '@ezyfs/repositories';
import {MailerService} from '@nestjs-modules/mailer';
import {OnQueueActive, OnQueueStalled, Process, Processor} from '@nestjs/bull';
import {Logger, Scope} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import {Job} from 'bull';
import {join} from 'path';
import {v4 as uuidv4} from 'uuid';
import {EmailService} from '../email.service';

@Processor('emails')
export class EmailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly emailService: EmailService,
  ) {
    this.logger.log('MailProcessor initialized');
  }

  @Process('confirmation')
  async confirmation(job: Job<unknown>) {
    this.logger.log('Sending confirmation email');
    // const {user, subject, templateName} = job.data;
    // const email = new Email()
    //   .setSender(job.data.user)
    //   .setEmailType(EmailTypeEnum.CONFIRMATION)
    //   .setDate(new Date())
    //   .setToken(uuidv4())
    //   .setVerificationToken(uuidv4());
    // await this.emailService.create(email);
    // const {token, verificationToken} = email;
    // const url = `${process.env.FRONT_END_BASE_URL}?sign_up_token=${token}&sign_up_verification_token=${verificationToken}&sign_up_user_id=${user.id}`;
    // // build the email and send it
    // this.mailerService
    //   .sendMail({
    //     to: user.email,
    //     subject,
    //     template: join(__dirname, `../../templates/${templateName}`),
    //     context: {
    //       userId: user.id,
    //       token,
    //       verificationToken,
    //       url,
    //     },
    //   })
    //   .then(() => true)
    //   .catch((err) => {
    //     Logger.log(err, 'SENDING EMAIL ERROR!');
    //     throw new RpcException(SENDING_EMAIL_ERROR_MESSAGE);
    //   });
  }
}
