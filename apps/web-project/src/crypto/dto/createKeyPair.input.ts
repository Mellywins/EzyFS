import {InputType, Int, Field} from '@nestjs/graphql';
import {IsOptional} from 'class-validator';
import {EncryptionAlgorithmEnum} from '../enums/enc-algorithms.enum';

@InputType()
export class CreateKeyPairInput {
  @Field(() => EncryptionAlgorithmEnum)
  algorithm: EncryptionAlgorithmEnum;

  @IsOptional()
  @Field({nullable: true})
  passphrase?: string;

  @Field()
  ownerId: number;
}
