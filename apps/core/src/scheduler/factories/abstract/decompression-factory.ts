import {CryptoService} from '../../../crypto/crypto.service';
import {CompDecompType} from '@ezyfs/common/enums/comp-decomp-type.enum';
import {CreateJobInput} from '../../dto/create-job.input';
import {QueuedJob} from '@ezyfs/repositories/entities';
import {JobInventory} from '../../inventories/Job-inventory';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createDecompressionJob} from '../concrete/create-decompression-job';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';

export default function decompressionFactory(
  type: CompDecompType,
): (
  createJobInput: CreateJobInput,
  userService: RegistrationAuthorityInternalServiceRPC,
  jobRepo: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (type) {
    default:
      return createDecompressionJob;
  }
}
