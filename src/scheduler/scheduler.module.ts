import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerResolver } from './scheduler.resolver';

@Module({
  providers: [SchedulerResolver, SchedulerService]
})
export class SchedulerModule {}
