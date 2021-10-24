import {registerEnumType} from '@nestjs/graphql';

/* eslint-disable no-shadow */
export enum ExecutionStatusEnum {
  SUCCESS,
  FAILED,
  ONGOING,
  PAUSED,
  CANCELED,
}
registerEnumType(ExecutionStatusEnum, {
  name: 'ExecutionStatusEnum',
});
