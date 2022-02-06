import {registerEnumType} from '@nestjs/graphql';

// eslint-disable-next-line no-shadow
export enum Gender {
  MALE,
  FEMALE,
}
registerEnumType(Gender, {
  name: 'Gender',
});
