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
import jobCreatorFactory from './factories/abstract/job-factory';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue(QueueType.COMPRESSION) private compressionQueue: Queue,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(QueuedJob)
    private readonly jobRepository: Repository<QueuedJob>,
  ) {}

  async create(createJobInput: CreateJobInput): Promise<QueuedJob> {
    return jobCreatorFactory(createJobInput.jobType)(createJobInput,this.userRepository,this.jobRepository,this.compressionQueue)
  }
}
