import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '../shared/enums/Queue.enum';

@Module({
  providers: [SchedulerResolver, SchedulerService],
  imports: [
    BullModule.registerQueue({
      name: QueueType.COMPRESSION,
    }),
    BullModule.registerQueue({
      name: QueueType.ENCRYPTION,
    }),
  ],
})
export class SchedulerModule {}
