import {InputType, Field, Int, PartialType} from '@nestjs/graphql';
import {CreateEmailInput} from './create-email.input';

@InputType()
export class UpdateEmailInput extends PartialType(CreateEmailInput) {
  @Field(() => Int)
  id: number;
}
