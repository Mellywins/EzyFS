import {Job, Queue} from 'bull';
import {ExecutionStatusEnum} from '../../shared/enums/Execution-status.enum';
import {Repository} from 'typeorm';
import {QueuedJob} from '../entities/Job.entity';
import {JobExecutionResult} from '../interfaces/JobExecutionResult.interface';

export default function successfulJobExecutor(
  Q: Queue,
  repository: Repository<QueuedJob>,
) {
  Q.on('completed', (job: Job, result: JobExecutionResult) => {
    repository.update(job.opts.jobId, {
      lastExecutionDate: new Date(job.processedOn),
      lastExecutionStatus: ExecutionStatusEnum.SUCCESS,
      attemptsMade: job.attemptsMade,
      processedOn: new Date(job.processedOn),
      finishedOn: new Date(job.finishedOn),
    });
  });
}
