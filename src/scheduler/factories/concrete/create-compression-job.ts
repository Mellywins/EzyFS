import { Queue } from "bull";
import { CreateJobInput } from "src/scheduler/dto/create-job.input";
import { QueuedJob } from "src/scheduler/entities/Job.entity";
import failedJobExecutor from "src/scheduler/helpers/failed-job-executor";
import successfulJobExecutor from "src/scheduler/helpers/successful-job-executor";
import { EncryptionJobPayload } from "src/scheduler/interfaces/EncryptionJobPayload.interface";
import { ExecutionStatusEnum } from "src/shared/enums/Execution-status.enum";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';

export const createCompressionJob=async (createJobInput: CreateJobInput, userRepo:Repository<User>,jobRepo:Repository<QueuedJob>,Q:Queue<any>)=>{
    const user = await userRepo.findOne({id: createJobInput.userId});
    const payload: EncryptionJobPayload = {
      sourcePath: createJobInput.sourcePath,
      outputPath: createJobInput.outputPath,
      ownerId: user.id,
      sourceType:createJobInput.sourceType
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
      JobId:jId,
      ...jobInfo,
      lastExecutionDate: startTimestamp,
      lastExecutionStatus: ExecutionStatusEnum.WAITING,
      startDate: startTimestamp,
      owner: user,
    });
    // const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
    await jobRepo.save(createdJob);
    successfulJobExecutor(Q,jobRepo);
    failedJobExecutor(Q,jobRepo);
    return createdJob;
}

