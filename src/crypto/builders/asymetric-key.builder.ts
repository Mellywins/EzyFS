import {EncryptionAlgorithmEnum} from '../enums/enc-algorithms.enum';
import {generateKeyPair, KeyObject} from 'crypto';
import {PublicKeyEncoding} from './interfaces/PublicKeyEncoding.interface';
import {PrivateKeyEncoding} from './interfaces/PrivateKeyEncoding.interface';
import {EncryptionAlgorithm} from './interfaces/EncryptionAlgorithm.interfacee';
export const keyBuilder =
  (algo) => (pubEnc: PublicKeyEncoding) => (privEnc: PrivateKeyEncoding) =>
    generateKeyPair(
      algo,
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: pubEnc.type,
          format: 'pem',
        },
        privateKeyEncoding: {
          type: privEnc.type,
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: privEnc.passphrase,
        },
      },
      (
        err: Error | null,
        publicKey: string | KeyObject,
        privateKey: string | KeyObject,
      ) => {
        if (err) throw err;
        console.log('keys: ', publicKey, privateKey);
        return {publicKey, privateKey};
      },
    );
