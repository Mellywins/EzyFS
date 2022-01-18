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

    const test = this.compressionQueue.add({jobId: uuidv4(), ...payload});
    const startTimestamp: Date = new Date();
    const {userId, ...jobInfo} = createJobInput;
    const createdJob: QueuedJob = this.jobRepository.create({
      ...jobInfo,
      lastExecutionDate: startTimestamp,
      lastExecutionStatus: ExecutionStatusEnum.WAITING,
      startDate: startTimestamp,
      owner: user,
    });
    const res = (await test).finishedOn;
    console.log(res);
    await this.jobRepository.save(createdJob);
    return createdJob;
  }
}
