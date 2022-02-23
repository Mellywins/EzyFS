import {TokensInterface} from '@ezyfs/common';
import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class EmailVerificationInput extends TokensInterface {
  @Field()
  userId: number;
}
