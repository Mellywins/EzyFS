import {ObjectType, Field, Int} from '@nestjs/graphql';

@ObjectType()
export class Job {
  @Field(() => Int, {description: 'Example field (placeholder)'})
  exampleField: number;
}
