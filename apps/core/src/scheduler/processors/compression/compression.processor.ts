import {createReadStream, createWriteStream} from 'fs';
import {DoneCallback, Job} from 'bull';
import {createGzip} from 'zlib';
import {pipeline} from 'stream';
import {CompressionJobPayload} from '../../interfaces/CompressionJobPayload.interface';
import {prefixFileWithDate} from '../../../utils/operation-filename-prefix';
import {ExecutionStatusEnum} from '@ezyfs/common/enums/Execution-status.enum';
import {JobExecutionResult} from '../../../scheduler/interfaces/JobExecutionResult.interface';
import {SourceTypeEnum} from '@ezyfs/common/enums/Source-Type.enum';
import {c} from 'tar';
import {basename, dirname} from 'path';
const tar = require('tar');
export default function (job: Job<CompressionJobPayload>, cb: DoneCallback) {
  const {sourcePath, outputPath} = job.data;
  console.log(
    `[${process.pid}] Attempting Compression delegated to job with UUID:  ${job.id}`,
  );
  if (job.data.sourceType == SourceTypeEnum.FILE) {
    const gzip = createGzip();
    const source = createReadStream(sourcePath);
    const destination = createWriteStream(
      prefixFileWithDate(outputPath) + '.gz',
    );
    job.progress(0);
    pipeline(source, gzip, destination, (err) => {
      if (err) {
        console.error('An Error occured in the Compression Processor:', err);
        cb(new Error((job as Job).stacktrace[0]), result);
      }
    });
    job.progress(100);
  } else {
    c(
      {
        cwd: dirname(sourcePath),
        gzip: true,
      },
      [basename(sourcePath)],
    ).pipe(createWriteStream(outputPath + '.tgz'));
  }
  const result: JobExecutionResult = {
    processedOn: new Date(),
    executionStatus: ExecutionStatusEnum.SUCCESS,
    failedReason: null,
    attemptsMade: job.attemptsMade,
    delay: job.opts.delay,
  };
  cb(null, result);
}
