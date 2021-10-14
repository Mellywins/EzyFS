import {CreateEmailInput} from './create-email.input';
import {InputType, Field, Int, PartialType} from '@nestjs/graphql';

@InputType()
export class UpdateEmailInput extends PartialType(CreateEmailInput) {
  @Field(() => Int)
  id: number;
}
