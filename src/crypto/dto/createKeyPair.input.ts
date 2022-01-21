import {InputType, Int, Field} from '@nestjs/graphql';
import {EncryptionAlgorithmEnum} from '../enums/enc-algorithms.enum';

@InputType()
export class CreateKeyPairInput {
  @Field(() => EncryptionAlgorithmEnum)
  algorithm: EncryptionAlgorithmEnum;

  @Field()
  publicKeyEncodingType: 'spki' | 'pkcs1';
  @Field()
  privateKeyEncodingType: 'pkcs1' | 'pkcs8';
  @Field()
  pirvateKeyPassphrase: string;

  @Field()
  ownerId: number;
}
