import {Queue} from 'bull';
import {CryptoService} from 'src/crypto/crypto.service';
import {CreateJobInput} from 'src/scheduler/dto/create-job.input';
import {QueuedJob} from 'src/scheduler/entities/Job.entity';
import {QueueInventory} from 'src/scheduler/inventories/Queue-inventory';
import {User} from 'src/user/entities/user.entity';
import {UserService} from 'src/user/user.service';
import {Repository} from 'typeorm';

export const createDecryptionJob = async (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
): Promise<QueuedJob> => {
  const user = await userService.internalFindOne(createJobInput.userId);
  const {publicKey, fingerprint} = await cryptoService.getUserKey(user);
  return;
};
