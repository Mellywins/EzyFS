import {Queue} from 'bull';
import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import {QueuedJob} from '../../../scheduler/entities/Job.entity';
import failedJobExecutor from '../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../scheduler/helpers/successful-job-executor';
import {DecompressionJobPayload} from './../../../scheduler/interfaces/DecomperssionJobPayload.interface';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {CryptoService} from 'src/crypto/crypto.service';
import {UserService} from 'src/user/user.service';
export const createDecompressionJob = async (
  createJobInput: CreateJobInput,
  userService: UserService,
  jobRepo: Repository<QueuedJob>,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => {
  const user = await userService.internalFindOne(createJobInput.userId);
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
