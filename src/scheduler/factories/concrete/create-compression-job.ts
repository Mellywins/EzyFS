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

export const createCompressionJob = async (
  createJobInput: CreateJobInput,
  userRepo: Repository<User>,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
) => {
  const user = await userRepo.findOne({id: createJobInput.userId});
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
  });
  // const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
