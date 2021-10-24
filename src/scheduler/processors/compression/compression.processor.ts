import fs from 'fs';
import {Job, DoneCallback} from 'bull';
import tar from 'tar';
import {QueuedJob} from '../../entities/Job.entity';

export default async function (job: QueuedJob, cb: DoneCallback) {
  const {sourcePath, sourceType, outputPath} = job;
  tar
    .c(
      {
        gzip: true,
      },
      [sourcePath],
    )
    .pipe(fs.createWriteStream(outputPath));
  cb(null, 'It works');
}
