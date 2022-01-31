import {BadRequestException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CryptoService} from '../../../crypto/crypto.service';
import {EncDecType} from '../../../shared/enums/enc-dec-type.enum';
import {UserService} from '../../../user/user.service';
import {CreateJobInput} from '../../dto/create-job.input';
import {QueuedJob} from '../../entities/Job.entity';
import {JobInventory} from '../../inventories/Job-inventory';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createCompressionJob} from '../concrete/create-compression-job';
import {createHybridDecryptionJob} from '../concrete/decryption/create-hybrid-dec-job';
import {createPgpDecryptionJob} from '../concrete/decryption/create-pgp-dec-job';

export default function decryptionFactory(
  type: EncDecType,
): (
  createJobInput: CreateJobInput,
  userService: UserService,
  JI: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (type) {
    case EncDecType.PGP:
      return createPgpDecryptionJob;
    case EncDecType.HYBRID:
      return createHybridDecryptionJob;
    default:
      throw new BadRequestException(
        'Wrong Encryption / Decryption type introduced!',
      );
  }
}
