import { CreateSchedulerInput } from './create-scheduler.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSchedulerInput extends PartialType(CreateSchedulerInput) {
  @Field(() => Int)
  id: number;
}
