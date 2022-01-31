import {BadRequestException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {CryptoService} from '../../../crypto/crypto.service';
import {EncDecType} from '../../../shared/enums/enc-dec-type.enum';
import {UserService} from '../../../user/user.service';
import {CreateJobInput} from '../../dto/create-job.input';
import {QueuedJob} from '../../entities/Job.entity';
import {QueueInventory} from '../../inventories/Queue-inventory';
import {createCompressionJob} from '../concrete/create-compression-job';

export default function encryptionFactory(
  type: EncDecType,
): (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => Promise<QueuedJob> {
  switch (type) {
    default:
      return createCompressionJob;
  }
}