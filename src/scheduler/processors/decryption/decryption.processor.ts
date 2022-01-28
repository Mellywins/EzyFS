import {Job, DoneCallback} from 'bull';
import {createReadStream, createWriteStream, writeFileSync} from 'fs';
import {DecryptionJobPayload} from '../../interfaces/DecryptionJobPayload.interface';
import * as opengpg from 'openpgp';
import {DecryptMessageResult, NodeStream} from 'openpgp';
import {Readable} from 'typeorm/platform/PlatformTools';
import {PassThrough} from 'stream';
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
  const tempStream = new PassThrough();
  const outputStream = createWriteStream(outputPath);
  tempStream.pipe(outputStream);

  opengpg
    .readMessage({
      binaryMessage: sourceStream,
    })
    .then((M) => {
      opengpg
        .decrypt({
          message: M,
          decryptionKeys: pKey,
          format: 'binary',
        })
        .then(
          async (e: DecryptMessageResult & {data: NodeStream<Uint8Array>}) => {
            console.log(e);
            const chunks = [];
            for await (const chunk of e.data) {
              chunks.push(chunk);
              tempStream.push(chunk);
            }
            tempStream.emit('end');
            cb(null, 'SUCCESS');
          },
        );
      // .on('finish', (e) => cb(null, e))
      // .on('error', (e) => cb(new Error('Error Occured'), 'FAILED'));
    })
    .catch((err) => cb(err, 'FAILED'));
  // })
  // .catch((err) => {
  //   cb(err, 'FAILED READING THE MESSAGE FROM STREAM');
  // });
}
