import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSchedulerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
