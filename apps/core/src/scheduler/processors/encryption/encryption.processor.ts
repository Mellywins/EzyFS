import {Job, DoneCallback} from 'bull';
import {createReadStream, createWriteStream} from 'fs';
import * as opengpg from 'openpgp';
import {EncryptionJobPayload} from '../../interfaces/EncryptionJobPayload.interface';

export default async function (
  job: Job<EncryptionJobPayload>,
  cb: DoneCallback,
) {
  console.log(
    `[${process.pid}] Attempting Encryption delegated to job with UUID:  ${job.id}`,
  );
  const {privateKey, publicKey, signWithEncryption, sourcePath, outputPath} =
    job.data;
  console.log(publicKey);
  if (
    publicKey == undefined ||
    sourcePath == undefined ||
    outputPath == undefined
  ) {
    cb(
      new Error(
        'No public key passed to the worker OR sourcePath or outputPath is undefined',
      ),
    );
  }
  const pubKey = await opengpg.readKey({armoredKey: publicKey});
  const sourceStream = createReadStream(sourcePath);
  const encrypted = await opengpg.encrypt({
    message: await opengpg.createMessage({binary: sourceStream}),
    encryptionKeys: pubKey,
    format: 'binary',
    // signingKeys: signWithEncryption ? privKey : null,
  });
  (encrypted as any)
    .pipe(createWriteStream(`${outputPath}.enc`))
    .on('finish', () => cb(null, 'SUCCESS'))
    .on('error', () => cb(new Error(), 'FAILED'));
}
