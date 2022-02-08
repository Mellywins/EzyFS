import {Queue} from 'bull';
import {CryptoService} from '../../../../crypto/crypto.service';
import {CreateJobInput} from '../../../../scheduler/dto/create-job.input';
import {QueuedJob} from '@ezyfs/repositories/entities';
import {QueueInventory} from '../../../../scheduler/inventories/Queue-inventory';
import {UserService} from '../../../../user/user.service';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {ExecutionStatusEnum} from '@ezyfs/common/enums/Execution-status.enum';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {CryptographicJob} from '@ezyfs/repositories/entities';
import failedJobExecutor from '../../../helpers/failed-job-executor';
import successfulJobExecutor from '../../../helpers/successful-job-executor';
import {DecryptionJobPayload} from '../../../interfaces/DecryptionJobPayload.interface';
import {JobInventory} from '../../../inventories/Job-inventory';

export const createPgpDecryptionJob = async (
  createJobInput: CreateJobInput,
  userService: UserService,
  JI: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
): Promise<QueuedJob> => {
  const user = await userService.internalFindOne(createJobInput.userId);
  const Q = QI.get(createJobInput.jobType);
  const {privateKey, outputPath, sourcePath} = createJobInput;
  const payload: DecryptionJobPayload = {
    privateKey,
    outputPath,
    sourcePath,
    ownerId: user.id,
  };
  const jobRepo = JI.get(
    RepositoryConstants.CRYPTO,
  ) as Repository<CryptographicJob>;
  const jId = uuidv4();
  await Q.add({...payload}, {jobId: jId});
  const startTimestamp: Date = new Date();
  const {userId, jobTypeSpec, ...jobInfo} = createJobInput;
  const createdJob: QueuedJob = jobRepo.create({
    JobId: jId,
    ...jobInfo,
    lastExecutionStatus: ExecutionStatusEnum.WAITING,
    startDate: startTimestamp,
    owner: user,
    jobType: ProcessorType.ENCRYPTION,
    jobTypeSpec: jobTypeSpec as unknown as EncDecType,
  });
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
