import {registerEnumType} from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum EmailTypeEnum {
  CONFIRMATION,
  RESET_PASSWORD,
}
registerEnumType(EmailTypeEnum, {
  name: 'EmailTypeEnum',
});
