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
import {QueueInventory} from './inventories/Queue-inventory';
import {UserModule} from 'src/user/user.module';
import {CryptoModule} from 'src/crypto/crypto.module';
import {JobInventory} from './inventories/Job-inventory';
import {ArchiveJob} from './entities/archiveJob.entity';
import {CryptographicJob} from './entities/cryptographicJob.entity';

@Module({
  providers: [
    SchedulerResolver,
    SchedulerService,
    QueueInventory,
    JobInventory,
  ],
  imports: [
    BullModule.registerQueue({
      name: QueueType.COMPRESSION,
      processors: [
        {
          path: join(
            __dirname,
            'processors/compression/compression.processor.js',
          ),
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.DECRYPTION,
      processors: [
        {
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
          path: join(
            __dirname,
            '/processors/encryption/encryption.processor.js',
          ),
          concurrency: 3,
        },
      ],
    }),
    BullModule.registerQueue({
      name: QueueType.DECOMPRESSION,
      processors: [
        {
          path: join(
            __dirname,
            '/processors/decompression/decompression.processor.js',
          ),
        },
      ],
    }),
    TypeOrmModule.forFeature([User, ArchiveJob, CryptographicJob]),
    UserModule,
    CryptoModule,
  ],
  exports: [BullModule],
})
export class SchedulerModule {}
