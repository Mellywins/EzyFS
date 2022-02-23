import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class ResetPasswordEmailInput {
  @Field()
  email: string;
}
