import {Job, DoneCallback} from 'bull';
import {createReadStream, createWriteStream, writeFileSync} from 'fs';
import {createDecipheriv} from 'crypto';
import {createUnzip} from 'zlib';
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';

export default async function (
  job: Job<DecryptionJobPayload>,
  cb: DoneCallback,
) {
  console.log(
    `[${process.pid}] Attempting Decryption delegated to job with UUID:  ${job.id}`,
  );
  const {sourcePath, outputPath, cipherKey} = job.data;
  const readInitVect = createReadStream(sourcePath, {end: 15});
  let initVect;
  console.log(Buffer.from(cipherKey).length);
  readInitVect.on('data', (chunk) => {
    initVect = chunk;
  });
  readInitVect.on('close', () => {
    const readStream = createReadStream(sourcePath, {start: 16});
    const decipher = createDecipheriv(
      'aes256',
      Buffer.from(cipherKey),
      initVect,
    );
    const unzip = createUnzip();
    const writeStream = createWriteStream(`${outputPath}.unenc`);

    readStream
      .pipe(decipher)
      .pipe(unzip)
      .pipe(writeStream)
      .on('finish', () => cb(null, 'SUCCESS'))
      .on('error', () => cb(new Error(), 'FAILED'));
  });
  // })
  // .catch((err) => {
  //   cb(err, 'FAILED READING THE MESSAGE FROM STREAM');
  // });
}
