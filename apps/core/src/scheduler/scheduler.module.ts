import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {join} from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SchedulerService} from './scheduler.service';
import {SchedulerResolver} from './scheduler.resolver';
import {QueueType} from '@ezyfs/common/enums/Queue.enum';
import {QueueInventory} from './inventories/Queue-inventory';
import {CryptoModule} from '../crypto/crypto.module';
import {JobInventory} from './inventories/Job-inventory';
import {ArchiveJob, User} from '@ezyfs/repositories/entities';
import {CryptographicJob} from '@ezyfs/repositories/entities';
import {ChannelCredentials} from '@grpc/grpc-js';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {GrpcGenericClientModule} from '@ezyfs/internal/grpc-clients/grpc-generic-client.module';
import {GrpcToken} from '@ezyfs/internal/grpc-clients/types';

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
    GrpcGenericClientModule.registerAsync({
      servicesList: [GrpcToken.NOTIFICATIONS, GrpcToken.REGISTRATION_AUTHORITY],
    }),
  ],
  exports: [BullModule],
})
export class SchedulerModule {}
