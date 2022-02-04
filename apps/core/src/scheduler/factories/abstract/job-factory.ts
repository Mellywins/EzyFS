import {BadRequestException} from '@nestjs/common';
import {CryptoService} from '../../../crypto/crypto.service';
import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import {QueuedJob} from '../../../scheduler/entities/Job.entity';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {UserService} from '../../../user/user.service';
import {Repository} from 'typeorm';
import {CompDecompType} from '../../../shared/enums/comp-decomp-type.enum';
import {EncDecType} from '../../../shared/enums/enc-dec-type.enum';
import {GenericJobTypeSpec} from '../../../shared/enums/generic-jobtype-spec.type';
import {ProcessorType} from '../../../shared/enums/Processor-types.enum';
import {JobInventory} from '../../inventories/Job-inventory';
import {createCompressionJob} from '../concrete/create-compression-job';
import {createDecompressionJob} from '../concrete/create-decompression-job';
import decryptionFactory from './decryption-factory';
import encryptionFactory from './encryption-factory';
export default function jobCreatorFactory(
  jobType: ProcessorType,
  jobTypeSpec: GenericJobTypeSpec,
): (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (jobType) {
    case ProcessorType.COMPRESSION:
      return createCompressionJob;
    case ProcessorType.DECOMPRESSION:
      return createDecompressionJob;
    case ProcessorType.ENCRYPTION:
      if (!(jobTypeSpec in EncDecType))
        throw new BadRequestException(
          `${jobTypeSpec} is not a valid EncDecType`,
        );
      return encryptionFactory(jobTypeSpec as unknown as EncDecType);
    case ProcessorType.DECRYPTION:
      if (!(jobTypeSpec in EncDecType))
        throw new BadRequestException(
          `${jobTypeSpec} is not a valid EncDecType`,
        );
      return decryptionFactory(jobTypeSpec as unknown as EncDecType);
    default:
      throw new BadRequestException('Wrong Job Type introduced');
  }
}
