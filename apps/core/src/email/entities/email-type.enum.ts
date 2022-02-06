import {registerEnumType} from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum EmailTypeEnum {
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'reset-password',
}
registerEnumType(EmailTypeEnum, {
  name: 'EmailTypeEnum',
});
