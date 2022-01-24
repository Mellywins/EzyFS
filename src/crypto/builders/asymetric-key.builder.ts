import {generateKeyPair} from 'crypto';
import {PublicKeyEncoding} from './interfaces/PublicKeyEncoding.interface';
import {PrivateKeyEncoding} from './interfaces/PrivateKeyEncoding.interface';
export const keyBuilder =
  (algo) =>
  (pubEnc: PublicKeyEncoding) =>
  (
    privEnc: PrivateKeyEncoding,
  ): Promise<{publicKey: string; privateKey: string}> =>
    new Promise((resolve, reject) => {
      generateKeyPair(
        algo,
        {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: pubEnc.type,
            format: 'pem',
          },
          privateKeyEncoding: {
            type: privEnc.type,
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
          },
        },
        (err: Error | null, publicKey: string, privateKey: string) => {
          if (err) reject(err);
          return resolve({publicKey, privateKey});
        },
      );
    });
