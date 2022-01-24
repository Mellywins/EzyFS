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
import {QueueInventory} from './inventories/Queue-inventory';
import {UserService} from '../user/user.service';
import {CryptoService} from '../crypto/crypto.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    @InjectRepository(QueuedJob)
    private readonly jobRepository: Repository<QueuedJob>,
    private readonly QI: QueueInventory,
  ) {}

  async create(createJobInput: CreateJobInput): Promise<QueuedJob> {
    return jobCreatorFactory(createJobInput.jobType)(
      createJobInput,
      this.userService,
      this.jobRepository,
      this.QI,
      this.cryptoService,
    );
  }
}
