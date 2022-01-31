import {Job, DoneCallback} from 'bull';
import {createReadStream, createWriteStream} from 'fs';
import {EncryptionJobPayload} from '../../../scheduler/interfaces/EncryptionJobPayload.interface';
import {createGzip} from 'zlib';
import {createCipheriv} from 'crypto';
import AppendInitVect from './helpers/iv-append';
export default async function (
  job: Job<EncryptionJobPayload>,
  cb: DoneCallback,
) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const {privateKey, sourcePath, outputPath, cipherIV, cipherKey} = job.data;
  const sourceStream = createReadStream(sourcePath);
  const outputStream = createWriteStream(outputPath + '.enc');
  const appendIV = new AppendInitVect(cipherIV);
  console.log(cipherKey);
  console.log(cipherIV);
  try {
    const cipher = createCipheriv(
      'aes256',
      Buffer.from(cipherKey),
      Buffer.from(cipherIV),
    );
    sourceStream
      .pipe(createGzip())
      .pipe(cipher)
      .pipe(appendIV)
      .pipe(outputStream)
      .on('finish', () => cb(null, 'SUCCESS'))
      .on('error', () => cb(new Error(), 'FAILED'));
  } catch (err) {
    cb(err, 'FAILED');
  }
}
