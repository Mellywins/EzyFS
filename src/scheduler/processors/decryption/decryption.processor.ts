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
    `[${process.pid}] Attempting Decryption delegated to job with UUID:  ${job.id}`,
  );
  const {privateKey, sourcePath, outputPath} = job.data;
  const pKey = await opengpg.readPrivateKey({armoredKey: privateKey});
  const sourceStream = createReadStream(sourcePath);
  opengpg
    .readMessage({
      armoredMessage: sourceStream,
    })
    .then((M) => {
      opengpg
        .decrypt({
          message: M,
          decryptionKeys: pKey,
        })
        .then((e) => {
          e.data
            .pipe(createWriteStream(outputPath))
            .on('end', () => cb(null, 'SUCCESS'))
            .on('error', () => cb(new Error('Error Occured'), 'FAILED'));
        })
        .catch((err) => cb(err, 'FAILED'));
    })
    .catch((err) => {
      cb(err, 'FAILED READING THE MESSAGE FROM STREAM');
    });
}
