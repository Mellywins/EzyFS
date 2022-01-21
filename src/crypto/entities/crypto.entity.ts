import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Crypto {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
