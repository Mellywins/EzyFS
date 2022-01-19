import {Injectable} from '@nestjs/common';
import {Job, JobOptions, Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {QueueType} from '../shared/enums/Queue.enum';
import {JobExecutionResult} from '../scheduler/interfaces/JobExecutionResult.interface';
import {CreateJobInput} from './dto/create-job.input';
// import {UpdateSchedulerInput} from './dto/update-scheduler.input';
import {QueuedJob} from './entities/Job.entity';
import {User} from '../user/entities/user.entity';
import {prefixFileWithDate} from '../utils/operation-filename-prefix';
import {EncryptionJobPayload} from './interfaces/EncryptionJobPayload.interface';
import {ExecutionStatusEnum} from 'src/shared/enums/Execution-status.enum';
import {v4 as uuidv4} from 'uuid';
import successfulJobExecutor from './helpers/successful-job-executor';
import failedJobExecutor from './helpers/failed-job-executor';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue(QueueType.COMPRESSION) private compressionQueue: Queue,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(QueuedJob)
    private readonly jobRepository: Repository<QueuedJob>,
  ) {}

  async create(createJobInput: CreateJobInput): Promise<QueuedJob> {
    const user = await this.userRepository.findOne({id: createJobInput.userId});
    // const jobOpts: JobOptions = {
    //   attempts: 2,
    //   repeat: {
    //     cron: createJobInput.cronString ? createJobInput.cronString : null,
    //     startDate: createJobInput.startDate,
    //     endDate: createJobInput.endDate ? createJobInput.endDate : null,
    //   },
    // };
    const payload: EncryptionJobPayload = {
      sourcePath: createJobInput.sourcePath,
      outputPath: createJobInput.outputPath,
      ownerId: user.id,
      sourceType:createJobInput.sourceType
    };
    const jId = uuidv4();
    await this.compressionQueue.add(
      {...payload},
      {
        jobId: jId,
      },
    );
    const startTimestamp: Date = new Date();
    const {userId, ...jobInfo} = createJobInput;
    const createdJob: QueuedJob = this.jobRepository.create({
      JobId:jId,
      ...jobInfo,
      lastExecutionDate: startTimestamp,
      lastExecutionStatus: ExecutionStatusEnum.WAITING,
      startDate: startTimestamp,
      owner: user,
    });
    // const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
    await this.jobRepository.save(createdJob);
    successfulJobExecutor(this.compressionQueue,this.jobRepository);
    failedJobExecutor(this.compressionQueue,this.jobRepository);
    return createdJob;
  }
}
