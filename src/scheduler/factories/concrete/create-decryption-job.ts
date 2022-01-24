import {Queue} from 'bull';
import {CryptoService} from 'src/crypto/crypto.service';
import {CreateJobInput} from 'src/scheduler/dto/create-job.input';
import {QueuedJob} from 'src/scheduler/entities/Job.entity';
import {QueueInventory} from 'src/scheduler/inventories/Queue-inventory';
import {UserService} from 'src/user/user.service';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {ExecutionStatusEnum} from '../../../shared/enums/Execution-status.enum';
import {ProcessorType} from '../../../shared/enums/Processor-types.enum';
import failedJobExecutor from '../../helpers/failed-job-executor';
import successfulJobExecutor from '../../helpers/successful-job-executor';
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';

export const createDecryptionJob = async (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
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
  const jId = uuidv4();
  await Q.add({...payload}, {jobId: jId});
  const startTimestamp: Date = new Date();
  const {userId, ...jobInfo} = createJobInput;
  const createdJob: QueuedJob = jobRepo.create({
    JobId: jId,
    ...jobInfo,
    lastExecutionStatus: ExecutionStatusEnum.WAITING,
    startDate: startTimestamp,
    owner: user,
    jobType: ProcessorType.ENCRYPTION,
  });
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
