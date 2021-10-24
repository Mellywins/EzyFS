import {registerEnumType} from '@nestjs/graphql';

/* eslint-disable no-shadow */
export enum ProcessorType {
  ENCRYPTION = 'ENCRYPTION',
  DECRYPTION = 'DECRYPTION',
  COMPRESSION = 'COMPRESSION',
  DECOMPRESSION = 'DECOMPRESSION',
}
registerEnumType(ProcessorType, {
  name: 'ProcessorType',
});
