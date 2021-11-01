import {Injectable} from '@nestjs/common';
import {JobOptions, Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {QueueType} from '../shared/enums/Queue.enum';

import {CreateJobInput} from './dto/create-job.input';
// import {UpdateSchedulerInput} from './dto/update-scheduler.input';
import {QueuedJob} from './entities/Job.entity';
import {User} from '../user/entities/user.entity';
import {ProcessorType} from '../shared/enums/Processor-types.enum';
import {EncryptionJobPayload} from './interfaces/EncryptionJobPayload.interface';

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
    const jobOpts: JobOptions = {
      attempts: 2,
      repeat: {
        cron: createJobInput.cronString,
        startDate: createJobInput.startDate,
        endDate: createJobInput.endDate,
      },
    };
    const payload: EncryptionJobPayload = {
      sourcePath: createJobInput.sourcePath,
      outputPath: createJobInput.outputPath,
      ownerId: user.id,
    };
    await this.compressionQueue.add(payload, jobOpts);
    return Promise.resolve(new QueuedJob());
  }
}
