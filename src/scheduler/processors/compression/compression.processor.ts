import {createReadStream, createWriteStream} from 'fs';
import {DoneCallback, Job} from 'bull';
import {createGzip} from 'zlib';
import {pipeline} from 'stream';
import tar from 'tar'
import {EncryptionJobPayload} from '../../interfaces/EncryptionJobPayload.interface';
import {prefixFileWithDate} from '../../../utils/operation-filename-prefix';
import {ExecutionStatusEnum} from 'src/shared/enums/Execution-status.enum';
import { JobExecutionResult } from 'src/scheduler/interfaces/JobExecutionResult.interface';
export default function (job: Job<EncryptionJobPayload>, cb: DoneCallback) {
  const {sourcePath, outputPath} = job.data;
  console.log(
    `[${process.pid}] Attempting Compression delegated to job with UUID:  ${job.id}`,
  );
  const gzip = createGzip();
  const source = createReadStream(sourcePath);
  const destination = createWriteStream(prefixFileWithDate(outputPath) + '.gz');
  job.progress(0);
  tar.c({
    gzip: true,
    file: outputPath,
  },[sourcePath]).then(_=>console.log(job))
  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An Error occured in the Compression Processor:', err);
      const result = {
        processedOn: job.processedOn,
        failedReason: `${err.code}: ${job.failedReason}`,
        executionStatus: ExecutionStatusEnum.FAILED,
        attemptsMade: job.attemptsMade,
        delay: job.opts.delay,
      };
      process.exitCode = 1;
      cb(new Error((job as Job).stacktrace[0]), result);
    }
  });
  job.progress(100);
  // console.log(job);

  const result: JobExecutionResult = {
    processedOn: new Date(),
    executionStatus: ExecutionStatusEnum.SUCCESS,
    failedReason: null,
    attemptsMade: job.attemptsMade,
    delay:job.opts.delay
  };
  cb(null, result);
}
