import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {join} from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '@ezyfs/common/enums/Queue.enum';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {User} from '@ezyfs/repositories/entities';
import {QueuedJob} from '@ezyfs/repositories/entities';
import {QueueInventory} from './inventories/Queue-inventory';
import {CryptoModule} from '../crypto/crypto.module';
import {JobInventory} from './inventories/Job-inventory';
import {ArchiveJob} from '@ezyfs/repositories/entities';
import {CryptographicJob} from '@ezyfs/repositories/entities';
import {ChannelCredentials} from '@grpc/grpc-js';
import {ClientsModule, Transport} from '@nestjs/microservices';

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
    CryptoModule,
    ClientsModule.register([
      {
        name: 'RA',
        transport: Transport.GRPC,
        options: {
          url: '172.28.1.2:3001',
          package: 'REGISTRATION_AUTHORITY',
          protoPath: join(
            `${process.cwd()}/libs/proto-schema/src/proto/registrationAuthority.proto`,
          ),
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
  ],
  exports: [BullModule],
})
export class SchedulerModule {}
