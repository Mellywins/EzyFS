import {EmailTypeEnum} from '@ezyfs/common/enums';
import {Email, User} from '@ezyfs/repositories';
import {Observable} from 'rxjs';

export interface NotificationsEmailServiceRPC {
  sendEmail(input: {
    user: User;
    emailType: EmailTypeEnum;
  }): Observable<{value: boolean}>;
  confirmEmail(input: {
    user: User;
    token: string;
    verificationToken: string;
    emailType: EmailTypeEnum;
  }): Observable<{value: boolean}>;
  findAllByUserId(input: {userId: number}): Observable<Email[]>;
}
