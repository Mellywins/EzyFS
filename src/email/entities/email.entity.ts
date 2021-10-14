import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Email {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
