import { Queue } from "bull";
import { CreateJobInput } from "src/scheduler/dto/create-job.input";
import { QueuedJob } from "src/scheduler/entities/Job.entity";
import failedJobExecutor from "src/scheduler/helpers/failed-job-executor";
import successfulJobExecutor from "src/scheduler/helpers/successful-job-executor";
import { DecompressionJobPayload } from "src/scheduler/interfaces/DecomperssionJobPayload.interface";
import { QueueInventory } from "src/scheduler/inventories/Queue-inventory";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';
export const createDecompressionJob=async (createJobInput: CreateJobInput, userRepo:Repository<User>,jobRepo:Repository<QueuedJob>,QI:QueueInventory)=>{
    const user = await userRepo.findOne({id:createJobInput.userId});
    const Q: Queue<any>=QI.get(createJobInput.jobType);
    const payload: DecompressionJobPayload={
        sourcePath:createJobInput.sourcePath,
        outputPath:createJobInput.outputPath,
        ownerId: createJobInput.userId
    }
    const jId=uuidv4();
    await Q.add(
        {...payload},
        {
            jobId:jId
        }
    );
    const startTimestamp: Date=new Date();
    const {userId,...jobInfo} = createJobInput;
    const createdJob:QueuedJob = jobRepo.create({
        JobId:jId,
        ...jobInfo,
        startDate:startTimestamp,
        owner: user
    });
    await jobRepo.save(createdJob);
    successfulJobExecutor(Q,jobRepo);
    failedJobExecutor(Q,jobRepo);
    return createdJob;
}