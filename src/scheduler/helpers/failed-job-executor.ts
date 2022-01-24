import {Job, Queue} from 'bull';
import {ExecutionStatusEnum} from '../../shared/enums/Execution-status.enum';
import {Repository} from 'typeorm';
import {QueuedJob} from '../entities/Job.entity';

export default function failedJobExecutor(
  Q: Queue,
  repository: Repository<QueuedJob>,
) {
  Q.on('failed', (job: Job, result: any) => {
    repository.update(job.opts.jobId, {
      lastExecutionDate: new Date(job.processedOn),
      lastExecutionStatus: ExecutionStatusEnum.FAILED,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      processedOn: new Date(job.processedOn),
      finishedOn: new Date(job.finishedOn),
      stacktrace: job.stacktrace as any as string,
    });
  });
}
