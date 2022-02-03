import {registerEnumType} from '@nestjs/graphql';

export enum EncryptionAlgorithmEnum {
  RSA = 'rsa',
  ECC = 'ecc',
}
registerEnumType(EncryptionAlgorithmEnum, {
  name: 'EncryptionAlgorithmEnum',
});
