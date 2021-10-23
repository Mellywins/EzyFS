import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {join} from 'path';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '../shared/enums/Queue.enum';
import {ProcessorType} from '../shared/enums/Processor-types.enum';

@Module({
  providers: [SchedulerResolver, SchedulerService],
  imports: [
    BullModule.registerQueue({
      name: QueueType.COMPRESSION,
      processors: [
        {
          name: ProcessorType.COMPRESSION,
          path: join(
            __dirname,
            '/processors/compression/compression.processor.ts',
          ),
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.ENCRYPTION,
    }),
  ],
})
export class SchedulerModule {}
