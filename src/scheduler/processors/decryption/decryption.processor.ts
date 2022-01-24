import {Job, DoneCallback} from 'bull';
import {CompressionJobPayload} from 'src/scheduler/interfaces/CompressionJobPayload.interface';
import {randomBytes, createCipheriv, createPublicKey} from 'crypto';
import {createReadStream, createWriteStream} from 'fs';
import {pipeline, Stream} from 'stream';
import {promisify} from 'util';
import {Readable} from 'stream';
import {EncryptionJobPayload} from '../../../scheduler/interfaces/EncryptionJobPayload.interface';
import NodeRSA = require('node-rsa');
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';
export default function (job: Job<DecryptionJobPayload>, cb: DoneCallback) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const rawKey = job.data.privateKey.slice(-2);
  const key: NodeRSA = new NodeRSA(rawKey, 'pkcs8');
  promisify(pipeline)(
    key.decrypt(
      createReadStream(job.data.sourcePath) as unknown as Buffer,
      'binary',
    ),
    createWriteStream(job.data.outputPath),
  )
    .then(() => {
      console.log('Decryption done successfully');
      cb(null, 'Success');
    })
    .catch((err) => {
      console.log('Decryption failed');
      cb(err, null);
    });
}
async function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();

    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(`error converting stream - ${err}`));
  });
}
