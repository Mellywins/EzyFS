import {ObjectType, Field, Int} from '@nestjs/graphql';

@ObjectType()
export class Scheduler {
  @Field(() => Int, {description: 'Example field (placeholder)'})
  exampleField: number;
}
