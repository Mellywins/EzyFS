import fs from 'fs';
import {DoneCallback} from 'bull';
import tar from 'tar';
import {QueuedJob} from '../../entities/Job.entity';

export default async (job: QueuedJob, cb: DoneCallback) => {
  const {sourcePath, outputPath} = job;
  tar
    .c(
      {
        gzip: true,
      },
      [sourcePath],
    )
    .pipe(fs.createWriteStream(outputPath));
  cb(null, 'It works');
};
