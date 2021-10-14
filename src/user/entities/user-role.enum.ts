import {registerEnumType} from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}
registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
});
