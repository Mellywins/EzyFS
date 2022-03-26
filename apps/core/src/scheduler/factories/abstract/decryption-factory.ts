import {BadRequestException} from '@nestjs/common';
import {CryptoService} from '../../../crypto/crypto.service';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {CreateJobInput} from '../../dto/create-job.input';
import {QueuedJob} from '@ezyfs/repositories/entities';
import {JobInventory} from '../../inventories/Job-inventory';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createHybridDecryptionJob} from '../concrete/decryption/create-hybrid-dec-job';
import {createPgpDecryptionJob} from '../concrete/decryption/create-pgp-dec-job';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';

export default function decryptionFactory(
  type: EncDecType,
): (
  createJobInput: CreateJobInput,
  userService: RegistrationAuthorityInternalServiceRPC,
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
