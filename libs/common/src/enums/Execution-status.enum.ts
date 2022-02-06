import {registerEnumType} from '@nestjs/graphql';

/* eslint-disable no-shadow */
export enum ExecutionStatusEnum {
  SUCCESS,
  FAILED,
  PAUSED,
  CANCELED,
  DELAYED,
  WAITING,
  ACTIVE,
}
registerEnumType(ExecutionStatusEnum, {
  name: 'ExecutionStatusEnum',
});
