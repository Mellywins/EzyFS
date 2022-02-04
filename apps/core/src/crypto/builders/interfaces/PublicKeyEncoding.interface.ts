import {KeyEncodingTypeEnum} from '../../../crypto/enums/public-key-encoding-type.enum';

export interface PublicKeyEncoding {
  type: 'spki' | 'pkcs1';
  format?: string;
}
