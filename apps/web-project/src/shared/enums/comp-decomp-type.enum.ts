import {registerEnumType} from '@nestjs/graphql';

/* eslint-disable no-shadow */
export enum CompDecompType {
  TGZ = 'TGZ',
}
registerEnumType(CompDecompType, {
  name: 'CompDecompType',
});
