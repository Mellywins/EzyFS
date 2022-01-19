import {createReadStream, createWriteStream} from 'fs';
import {DoneCallback, Job} from 'bull';
import {createGzip} from 'zlib';
import {pipeline} from 'stream';
import {EncryptionJobPayload} from '../../interfaces/EncryptionJobPayload.interface';
import {prefixFileWithDate} from '../../../utils/operation-filename-prefix';
import {ExecutionStatusEnum} from 'src/shared/enums/Execution-status.enum';
export default function (job: Job<EncryptionJobPayload>, cb: DoneCallback) {
  const {sourcePath, outputPath} = job.data;
  console.log(
    `[${process.pid}] Attempting Compression delegated to job with UUID:  ${job.id}`,
  );
  const gzip = createGzip();
  const source = createReadStream(sourcePath);
  const destination = createWriteStream(prefixFileWithDate(outputPath) + '.gz');
  job.progress(0);
  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An Error occured in the Compression Processor:', err);
      process.exitCode = 1;
      const result = {
        processedOn: new Date().getTime(),
        failedReason: err.code,
        executionStatus: ExecutionStatusEnum.FAILED,
        attemptsMade: job.attemptsMade,
        delay: job.opts.delay,
      };
      cb(new Error((job as Job).stacktrace[0]), result);
    }
  });
  job.progress(100);
  console.log(job);
  const result = {
    processedOn: new Date().getTime(),
    executionStatus: ExecutionStatusEnum.SUCCESS,
  };
  cb(null, result);
}
