import {KeyEncodingTypeEnum} from 'src/crypto/enums/public-key-encoding-type.enum';

export interface PublicKeyEncoding {
  type: 'spki' | 'pkcs1';
  format?: string;
}
