import {User} from '../../user/entities/user.entity';
import {EmailTypeEnum} from './email-type.enum';

export interface EmailBuilder {
  setSender(user: User);
  setDate(date: Date);
  setEmailType(emailType: EmailTypeEnum);
  setToken(token: string);
  setVerificationToken(token: string);
  setExpired(expired: boolean);
}
