import {Job, DoneCallback} from 'bull';
import {createReadStream, createWriteStream} from 'fs';
import * as opengpg from 'openpgp';
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';

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
  const outputStream = createWriteStream(outputPath, 'binary');

  opengpg
    .readMessage({
      binaryMessage: sourceStream,
    })
    .then(async (M) => {
      (
        (
          await opengpg.decrypt({
            message: M,
            decryptionKeys: pKey,
            format: 'binary',
          })
        ).data as any
      ).pipe(outputStream);
      cb(null, 'SUCCESS');
    })
    .catch((err) => cb(err, 'FAILED'));
  // })
  // .catch((err) => {
  //   cb(err, 'FAILED READING THE MESSAGE FROM STREAM');
  // });
}
