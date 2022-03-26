import {CryptoService} from '../../../../crypto/crypto.service';
import {CreateJobInput} from '../../../../scheduler/dto/create-job.input';
import {QueuedJob} from '@ezyfs/repositories/entities';
import failedJobExecutor from '../../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../../scheduler/helpers/successful-job-executor';
import {EncryptionJobPayload} from '../../../../scheduler/interfaces/EncryptionJobPayload.interface';
import {QueueInventory} from '../../../../scheduler/inventories/Queue-inventory';
import {ExecutionStatusEnum} from '@ezyfs/common/enums/Execution-status.enum';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {CryptographicJob} from '@ezyfs/repositories/entities';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {JobInventory} from '../../../inventories/Job-inventory';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';

export const createPgpEncryptionJob = async (
  createJobInput: CreateJobInput,
  userService: RegistrationAuthorityInternalServiceRPC,
  JI: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
): Promise<QueuedJob> => {
  const user = await userService
    .internalFindOne(createJobInput.userId)
    .toPromise();
  const {publicKey, fingerprint} = await cryptoService.getUserKey(user);
  if (publicKey === undefined) throw new Error('No public key found');
  const Q = QI.get(createJobInput.jobType);
  console.log('public key: ', publicKey);
  const payload: EncryptionJobPayload = {
    sourcePath: createJobInput.sourcePath,
    outputPath: createJobInput.outputPath,
    ownerId: user.id,
    publicKey,
    privateKey: createJobInput.privateKey,
    signWithEncryption: createJobInput.signWithEncryption,
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
