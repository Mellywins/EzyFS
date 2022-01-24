import {Job, DoneCallback} from 'bull';
import {CompressionJobPayload} from 'src/scheduler/interfaces/CompressionJobPayload.interface';
import {randomBytes, createCipher} from 'crypto';
import {createReadStream, createWriteStream} from 'fs';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {publicEncrypt} from 'crypto';
import {constants} from 'crypto';
import {createPublicKey} from 'crypto';
import {EncryptionJobPayload} from 'src/scheduler/interfaces/EncryptionJobPayload.interface';
export default function (job: Job<EncryptionJobPayload>, cb: DoneCallback) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const key = job.data.publicKey;

  promisify(pipeline)(
    createReadStream(job.data.sourcePath),
    createCipher('aes-256-cbc', key),
    createWriteStream(job.data.outputPath + '.enc'),
  )
    .then(() => {
      console.log('Encryption done successfully');
      cb(null, 'Success');
    })
    .catch((err) => {
      console.log('Encryption failed');
      cb(err, null);
    });
}
