import {Job, DoneCallback} from 'bull';
import {CompressionJobPayload} from 'src/scheduler/interfaces/CompressionJobPayload.interface';
import {randomBytes, createCipheriv, createPublicKey} from 'crypto';
import {createReadStream, createWriteStream} from 'fs';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {Readable} from 'stream';
import {EncryptionJobPayload} from '../../../scheduler/interfaces/EncryptionJobPayload.interface';
import NodeRSA = require('node-rsa');
export default function (job: Job<EncryptionJobPayload>, cb: DoneCallback) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const rawKey = job.data.publicKey;
  const key: NodeRSA = new NodeRSA(rawKey);
  promisify(pipeline)(
    key.encrypt(createReadStream(job.data.sourcePath), 'binary'),
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
