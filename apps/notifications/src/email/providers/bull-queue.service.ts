import {EmailTypeEnum, SENDING_EMAIL_ERROR_MESSAGE} from '@ezyfs/common';
import {ConsulServiceKeys} from '@ezyfs/internal';
import {NotificationsConfig} from '@ezyfs/internal/interfaces/configs/notifications.config';
import {Email, User} from '@ezyfs/repositories';
import {MailerService} from '@nestjs-modules/mailer';
import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import * as Q from 'bull';
import {ConsulService} from 'nestjs-consul';
import {join} from 'path';

@Injectable()
export class EmailBullQueue {
  private readonly logger = new Logger(this.constructor.name);

  private emailsQueue: Q.Queue;

  constructor(
    private readonly consul: ConsulService<NotificationsConfig>,
    private readonly mailerService: MailerService,
  ) {
    this.logger.log('EmailBullQueue Initialized');
    this.consul
      .get<NotificationsConfig>(ConsulServiceKeys.NOTIFICATIONS)
      .then((data: NotificationsConfig) => {
        this.emailsQueue = new Q('emailsQ', {
          redis: {
            host: data.databases.redis.host,
            port: data.databases.redis.port,
          },
        });
        this.attachJobProcess(this.emailsQueue);
        this.logger.log('Finished Instantiating the Emails Queue');
      });
  }

  attachJobProcess(queue: Q.Queue): void {
    queue.process(
      async (
        job: Q.Job<{
          user: User;
          subject: string;
          templateName: string;
          email: Email;
        }>,
        done: Q.DoneCallback,
      ) => {
        const {user, subject, templateName, email} = job.data;

        const {token, verificationToken} = email;
        const url = `${process.env.FRONT_END_BASE_URL}?sign_up_token=${token}&sign_up_verification_token=${verificationToken}&sign_up_user_id=${user.id}`;
        // build the email and send it
        this.mailerService
          .sendMail({
            to: user.email,
            subject,
            template: join(__dirname, `../../templates/${templateName}`),
            context: {
              userId: user.id,
              token,
              verificationToken,
              url,
            },
          })
          .then(() => {
            done(null, 'SUCCESS');
          })
          .catch((err) => {
            Logger.log(err, 'SENDING EMAIL ERROR!');
            done(new RpcException(SENDING_EMAIL_ERROR_MESSAGE));
            throw new RpcException(SENDING_EMAIL_ERROR_MESSAGE);
          });
      },
    );
  }

  async pushMailJob(job: {
    user: User;
    subject: string;
    templateName: string;
    email: Email;
  }): Promise<void> {
    const newJob = await this.emailsQueue.add(job);
    console.log(newJob);
    this.logger.log('Added a new mail job to the Queue');
  }
}
