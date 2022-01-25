import {Job, DoneCallback} from 'bull';
import {CompressionJobPayload} from 'src/scheduler/interfaces/CompressionJobPayload.interface';
import {randomBytes, createCipheriv, createPublicKey} from 'crypto';
import {createReadStream, createWriteStream} from 'fs';
import {pipeline} from 'stream';
import {promisify} from 'util';
import {Readable} from 'stream';
import {EncryptionJobPayload} from '../../../scheduler/interfaces/EncryptionJobPayload.interface';
import NodeRSA = require('node-rsa');
import * as opengpg from 'openpgp';
export default async function (
  job: Job<EncryptionJobPayload>,
  cb: DoneCallback,
) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const {privateKey, publicKey, signWithEncryption, sourcePath, outputPath} =
    job.data;
  const pubKey = await opengpg.readKey({armoredKey: publicKey});
  const sourceStream = createReadStream(sourcePath);
  const encrypted = await opengpg.encrypt({
    message: await opengpg.createMessage({text: sourceStream}),
    encryptionKeys: pubKey,
    // signingKeys: signWithEncryption ? privKey : null,
  });
  encrypted
    .pipe(createWriteStream(outputPath + '.enc'))
    .on('end', cb(null, 'SUCCESS'))
    .on('error', cb(new Error(), 'FAILED'));
}
