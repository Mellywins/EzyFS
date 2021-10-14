import {registerEnumType} from '@nestjs/graphql';

export enum EmailTypeEnum {
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'reset-password',
}
registerEnumType(EmailTypeEnum, {
  name: 'EmailTypeEnum',
});
