import {createReadStream, createWriteStream} from 'fs';
import {DoneCallback, Job} from 'bull';
import {createGzip} from 'zlib';
import {pipeline} from 'stream';
import {EncryptionJobPayload} from '../../interfaces/EncryptionJobPayload.interface';
import {formattedDate} from '../../../utils/formatted-date';
export default function (job: Job<EncryptionJobPayload>, cb: DoneCallback) {
  const {sourcePath, outputPath} = job.data;
  console.log(`[${process.pid}] Attempting Compression delegated by ${job.id}`);
  const gzip = createGzip();
  const source = createReadStream(sourcePath);
  const currentDate = formattedDate();
  const destination = createWriteStream(outputPath + '-' + currentDate + '.gz');
  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An Error occured in the Compression Processor:', err);
      process.exitCode = 1;
      cb(new Error((job as Job).stacktrace[0]));
    }
  });

  console.log('Finished writing file to Disk!');
  return new Date().getTime();
  // console.log('CHILD ', process.pid);
  // cb(null, 'It works');
}
