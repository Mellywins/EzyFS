import {Job, DoneCallback} from 'bull';
import {CompressionJobPayload} from 'src/scheduler/interfaces/CompressionJobPayload.interface';
import {randomBytes, createCipheriv, createPublicKey} from 'crypto';
import {createReadStream, createWriteStream} from 'fs';
import {pipeline, Stream} from 'stream';
import {promisify} from 'util';
import {Readable} from 'stream';
import {EncryptionJobPayload} from '../../../scheduler/interfaces/EncryptionJobPayload.interface';
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';
import * as opengpg from 'openpgp';
export default async function (
  job: Job<DecryptionJobPayload>,
  cb: DoneCallback,
) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const {privateKey} = job.data;
}
