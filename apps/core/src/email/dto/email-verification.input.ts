import {Field, InputType} from '@nestjs/graphql';
import {TokensInterface} from '../../shared/types/tokens.interface';

@InputType()
export class EmailVerificationInput extends TokensInterface {
  @Field()
  userId: number;
}
