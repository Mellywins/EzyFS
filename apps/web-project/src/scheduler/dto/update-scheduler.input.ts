import {InputType, Field, Int, PartialType} from '@nestjs/graphql';
import {CreateJobInput} from './create-job.input';

@InputType()
export class UpdateSchedulerInput extends PartialType(CreateJobInput) {
  @Field(() => Int)
  id: number;
}
