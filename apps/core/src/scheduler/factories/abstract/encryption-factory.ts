import {BadRequestException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CryptoService} from '../../../crypto/crypto.service';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {UserService} from '../../../user/user.service';
import {CreateJobInput} from '../../dto/create-job.input';
import {CryptographicJob} from '@ezyfs/repositories/entities';
import {QueuedJob} from '@ezyfs/repositories/entities';
import {JobInventory} from '../../inventories/Job-inventory';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createHybridDecryptionJob} from '../concrete/decryption/create-hybrid-dec-job';
import {createPgpDecryptionJob} from '../concrete/decryption/create-pgp-dec-job';
import {createHybridEncryptionJob} from '../concrete/encryption/create-hybrid-enc-job';
import {createPgpEncryptionJob} from '../concrete/encryption/create-pgp-enc-job';

export default function encryptionFactory(
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
      return createPgpEncryptionJob;
    case EncDecType.HYBRID:
      return createHybridEncryptionJob;
    default:
      throw new BadRequestException(
        'Wrong Encryption / Decryption type introduced!',
      );
  }
}
