import { Queue } from "bull";
import { CreateJobInput } from "src/scheduler/dto/create-job.input";
import { QueuedJob } from "src/scheduler/entities/Job.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

export const createDecryptionJob=async (createJobInput: CreateJobInput, userRepo:Repository<User>,jobRepo:Repository<QueuedJob>,Q:Queue<any>)=>{}