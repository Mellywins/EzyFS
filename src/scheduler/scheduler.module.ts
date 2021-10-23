import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '../shared/enums/Queue.enum';
import {ProcessorType} from '../shared/enums/Processor-types.enum';
import {join} from 'path';

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
