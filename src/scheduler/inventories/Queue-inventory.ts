import {InjectQueue} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';
import {ProcessorType} from '../../shared/enums/Processor-types.enum';
import {QueueType} from '../../shared/enums/Queue.enum';
import {QueuedJob} from '../entities/Job.entity';

@Injectable()
export class QueueInventory {
  constructor(
    @InjectQueue(QueueType.COMPRESSION) private compressionQueue: Queue<any>,
    @InjectQueue(QueueType.DECOMPRESSION)
    private decompressionQueue: Queue<any>,
    @InjectQueue(QueueType.ENCRYPTION) private encryptionQueue: Queue<any>,
    @InjectQueue(QueueType.DECRYPTION) private decryptionQueue: Queue<any>,
  ) {}
  get(jobType: ProcessorType): Queue<any> {
    switch (jobType) {
      case ProcessorType.COMPRESSION:
        return this.compressionQueue;
      case ProcessorType.DECOMPRESSION:
        return this.decompressionQueue;
      case ProcessorType.ENCRYPTION:
        return this.encryptionQueue;
      case ProcessorType.DECRYPTION:
        return this.decryptionQueue;
    }
  }
}
