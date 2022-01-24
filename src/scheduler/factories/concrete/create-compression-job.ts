import {Queue} from 'bull';
import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import {QueuedJob} from '../../../scheduler/entities/Job.entity';
import failedJobExecutor from '../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../scheduler/helpers/successful-job-executor';
import {CompressionJobPayload} from '../../../scheduler/interfaces/CompressionJobPayload.interface';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {ExecutionStatusEnum} from '../../../shared/enums/Execution-status.enum';
import {User} from '../../../user/entities/user.entity';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {CryptoService} from '../../../crypto/crypto.service';
import {UserService} from '../../../user/user.service';
import {ProcessorType} from '../../../shared/enums/Processor-types.enum';

export const createCompressionJob = async (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => {
  const user = await userService.internalFindOne(createJobInput.userId);
  console.log(user);
  const Q = QI.get(createJobInput.jobType);
  const payload: CompressionJobPayload = {
    sourcePath: createJobInput.sourcePath,
    outputPath: createJobInput.outputPath,
    ownerId: user.id,
    sourceType: createJobInput.sourceType,
  };
  const jId = uuidv4();
  await Q.add(
    {...payload},
    {
      jobId: jId,
    },
  );
  const startTimestamp: Date = new Date();
  const {userId, ...jobInfo} = createJobInput;
  const createdJob: QueuedJob = jobRepo.create({
    JobId: jId,
    ...jobInfo,
    lastExecutionStatus: ExecutionStatusEnum.WAITING,
    startDate: startTimestamp,
    owner: user,
    jobType: ProcessorType.COMPRESSION,
  });
  // const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
