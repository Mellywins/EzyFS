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
    };
    const jId = uuidv4();
    await this.compressionQueue.add(
      {...payload},
      {
        jobId: jId,
      },
    );
    console.log(prefixFileWithDate(createJobInput.outputPath));
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
    const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
    await this.jobRepository.save(createdJob);
    this.compressionQueue.on('completed',(job: Job,result:JobExecutionResult)=>{
      console.log('I am inside the job completed listener');
      console.log(job)
      this.jobRepository.update(job.opts.jobId,{
        lastExecutionDate:new Date(job.processedOn),
        lastExecutionStatus:ExecutionStatusEnum.SUCCESS,
        attemptsMade:job.attemptsMade,
        processedOn:new Date(job.processedOn),
        finishedOn:new Date(job.finishedOn),
      })
    })
    this.compressionQueue.on('failed',(job:Job,result:any)=>{
      console.log('inside Comp Q error event')
      console.log("result: ",result)
      this.jobRepository.update(job.opts.jobId,{
        lastExecutionDate:new Date(job.processedOn),
        lastExecutionStatus:ExecutionStatusEnum.FAILED,
        attemptsMade:job.attemptsMade,
        failedReason:job.failedReason,
        processedOn:new Date(job.processedOn),
        finishedOn:new Date(job.finishedOn),
        stacktrace:(job.stacktrace as any as string)
      })
    })
    // TODO: fix the teturn result when the job has finished its execution.
    // We must obtain the timestamp when the job is done processing and persist it in the DB, So we can  later on push notifications to the users of when the job is completed, failed or rescheduled!
    // console.log(processedJob);

    return createdJob;
  }
}
