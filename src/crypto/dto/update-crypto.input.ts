import { CreateCryptoInput } from './create-crypto.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCryptoInput extends PartialType(CreateCryptoInput) {
  @Field(() => Int)
  id: number;
}
