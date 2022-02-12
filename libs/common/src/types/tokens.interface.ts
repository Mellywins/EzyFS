import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class TokensInterface {
  @Field()
  token: string;

  @Field()
  verificationToken: string;
}
