import {generateKeyPair} from 'crypto';
import {generateKey} from 'openpgp';
import {PublicKeyEncoding} from './interfaces/PublicKeyEncoding.interface';
import {PrivateKeyEncoding} from './interfaces/PrivateKeyEncoding.interface';
import {KeyBuildingBlock} from './interfaces/KeyBuildingBlock.interface';
export const keyBuilder = (
  payload: KeyBuildingBlock,
): Promise<{publicKey: string; privateKey: string; revocationCertificate}> =>
  generateKey({
    type: payload.type, // Type of the key, defaults to ECC
    curve: payload.type === 'ecc' ? 'curve25519' : null, // ECC curve name, defaults to curve25519
    rsaBits: payload.type === 'ecc' ? null : 4096,
    userIDs: [{name: payload.user.username, email: payload.user.email}], // you can pass multiple user IDs
    passphrase: payload.passphrase, // protects the private key
    format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });
