import fs from 'fs';
import {DoneCallback, Job} from 'bull';
import tar from 'tar';
import {EncryptionJobPayload} from '../../interfaces/EncryptionJobPayload.interface';

export default async (job: Job<EncryptionJobPayload>, cb: DoneCallback) => {
  const {sourcePath, outputPath} = job.data;
  console.log(`[${process.pid}] Attempting Compression delegated by ${job.id}`);
  tar
    .c(
      {
        gzip: true,
      },
      [sourcePath],
      (er) => cb(er, null),
    )
    .pipe(fs.createWriteStream(outputPath));
  cb(null, {
    ...job,
  });
};
