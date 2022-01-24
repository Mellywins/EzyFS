import {Queue} from 'bull';
import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import {QueuedJob} from '../../../scheduler/entities/Job.entity';
import failedJobExecutor from '../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../scheduler/helpers/successful-job-executor';
import {DecompressionJobPayload} from './../../../scheduler/interfaces/DecomperssionJobPayload.interface';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {User} from '../../../user/entities/user.entity';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
export const createDecompressionJob = async (
  createJobInput: CreateJobInput,
  userRepo: Repository<User>,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
) => {
  const user = await userRepo.findOne({id: createJobInput.userId});
  const Q: Queue<any> = QI.get(createJobInput.jobType);
  const payload: DecompressionJobPayload = {
    sourcePath: createJobInput.sourcePath,
    outputPath: createJobInput.outputPath,
    ownerId: createJobInput.userId,
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
    startDate: startTimestamp,
    owner: user,
  });
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
