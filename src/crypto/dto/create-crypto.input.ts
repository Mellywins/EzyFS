import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCryptoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
