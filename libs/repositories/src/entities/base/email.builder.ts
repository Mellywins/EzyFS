/* eslint-disable import/no-cycle */
import {EmailTypeEnum} from '@ezyfs/common/enums/email-type.enum';
import {User} from '@ezyfs/repositories/entities';

export interface EmailBuilder {
  setSender(user: User);
  setDate(date: Date);
  setEmailType(emailType: EmailTypeEnum);
  setToken(token: string);
  setVerificationToken(token: string);
  setExpired(expired: boolean);
}
