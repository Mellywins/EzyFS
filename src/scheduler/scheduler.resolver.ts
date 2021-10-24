import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {SchedulerService} from './scheduler.service';
import {Scheduler} from './entities/scheduler.entity';
import {CreateJobInput} from './dto/create-job.input';
import {UpdateSchedulerInput} from './dto/update-scheduler.input';

@Resolver(() => Scheduler)
export class SchedulerResolver {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Mutation(() => Scheduler)
  createJob(@Args('createJobInput') createJobInput: CreateJobInput) {
    return this.schedulerService.create(createJobInput);
  }

  // @Query(() => [Scheduler], {name: 'scheduler'})
  // findAll() {
  //   return this.schedulerService.findAll();
  // }

  // @Query(() => Scheduler, {name: 'scheduler'})
  // findOne(@Args('id', {type: () => Int}) id: number) {
  //   return this.schedulerService.findOne(id);
  // }

  // @Mutation(() => Scheduler)
  // updateScheduler(
  //   @Args('updateSchedulerInput') updateSchedulerInput: UpdateSchedulerInput,
  // ) {
  //   return this.schedulerService.update(
  //     updateSchedulerInput.id,
  //     updateSchedulerInput,
  //   );
  // }

  // @Mutation(() => Scheduler)
  // removeScheduler(@Args('id', {type: () => Int}) id: number) {
  //   return this.schedulerService.remove(id);
  // }
}
