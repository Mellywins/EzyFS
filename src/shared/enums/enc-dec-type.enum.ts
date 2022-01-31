import {registerEnumType} from '@nestjs/graphql';
/* eslint-disable no-shadow */
export enum EncDecType {
  PGP = 'PGP',
  HYBRID = 'HYBRID',
}
registerEnumType(EncDecType, {
  name: 'EncDecType',
});
