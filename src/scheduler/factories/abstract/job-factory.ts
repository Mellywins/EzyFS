import {BadRequestException} from '@nestjs/common';
import {CryptoService} from 'src/crypto/crypto.service';
import {CreateJobInput} from 'src/scheduler/dto/create-job.input';
import {QueuedJob} from 'src/scheduler/entities/Job.entity';
import {QueueInventory} from 'src/scheduler/inventories/Queue-inventory';
import {UserService} from 'src/user/user.service';
import {Repository} from 'typeorm';
import {ProcessorType} from '../../../shared/enums/Processor-types.enum';
import {createCompressionJob} from '../concrete/create-compression-job';
import {createDecompressionJob} from '../concrete/create-decompression-job';
import {createDecryptionJob} from '../concrete/create-decryption-job';
import {createEncryptionJob} from '../concrete/create-encryption-job';
export default function jobCreatorFactory(
  jobType: ProcessorType,
): (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (jobType) {
    case ProcessorType.COMPRESSION:
      return createCompressionJob;
    case ProcessorType.DECOMPRESSION:
      return createDecompressionJob;
    case ProcessorType.ENCRYPTION:
      return createEncryptionJob;
    case ProcessorType.DECRYPTION:
      return createDecryptionJob;
    default:
      throw new BadRequestException('Wrong Job Type introduced');
  }
}
