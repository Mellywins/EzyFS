import {BadRequestException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CryptoService} from '../../../crypto/crypto.service';
import {EncDecType} from '../../../shared/enums/enc-dec-type.enum';
import {UserService} from '../../../user/user.service';
import {CreateJobInput} from '../../dto/create-job.input';
import {QueuedJob} from '../../entities/Job.entity';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createCompressionJob} from '../concrete/create-compression-job';
import {createDecryptionJob} from '../concrete/create-decryption-job';

export default function decryptionFactory(
  type: EncDecType,
): (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (type) {
    case EncDecType.PGP:
      return createDecryptionJob;
    case EncDecType.HYBRID:
      return createDecryptionJob;
    default:
      throw new BadRequestException(
        'Wrong Encryption / Decryption type introduced!',
      );
  }
}
