import {KeyEncodingTypeEnum} from '../../../crypto/enums/public-key-encoding-type.enum';

export interface PrivateKeyEncoding {
  type: 'pkcs1' | 'pkcs8';
  format?: string;
  passphrase: string;
}
