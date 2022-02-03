import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class CreateKeyPairOutput {
  @Field()
  privateKey: string;
  @Field()
  fingerprint: string;
}
