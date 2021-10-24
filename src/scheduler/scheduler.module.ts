import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {join} from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '../shared/enums/Queue.enum';
import {ProcessorType} from '../shared/enums/Processor-types.enum';
import {User} from '../user/entities/user.entity';
import {QueuedJob} from './entities/Job.entity';

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
            '/processors/compression/compression.processor.js',
          ),
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.DECRYPTION,
      processors: [
        {
          name: ProcessorType.DECRYPTION,
          path: join(
            __dirname,
            '/processors/decryption/decryption.processor.js',
          ),
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.ENCRYPTION,
      processors: [
        {
          name: ProcessorType.ENCRYPTION,
          path: join(
            __dirname,
            '/processors/encryption/encryption.processor.js',
          ),
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.DECOMPRESSION,
      processors: [
        {
          name: ProcessorType.DECOMPRESSION,
          path: join(
            __dirname,
            '/processors/decompression/decompression.processor.js',
          ),
        },
      ],
    }),
    TypeOrmModule.forFeature([User, QueuedJob]),
  ],
})
export class SchedulerModule {}
