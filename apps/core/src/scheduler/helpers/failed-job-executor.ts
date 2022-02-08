import {Job, Queue} from 'bull';
import {ExecutionStatusEnum} from '@ezyfs/common/enums/Execution-status.enum';
import {Repository} from 'typeorm';
import {QueuedJob} from '@ezyfs/repositories/entities';

export default function failedJobExecutor(
  Q: Queue,
  repository: Repository<QueuedJob>,
) {
  Q.on('failed', (job: Job, result: any) => {
    console.log('failed job: ', job);
    repository.update(job.opts.jobId, {
      lastExecutionDate: new Date(job.processedOn),
      lastExecutionStatus: ExecutionStatusEnum.FAILED,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      processedOn: new Date(job.processedOn),
      stacktrace: job.stacktrace as any as string,
    });
  });
}
