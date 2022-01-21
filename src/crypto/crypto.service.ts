import {Injectable} from '@nestjs/common';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';

@Injectable()
export class CryptoService {
  async createKeyPair(createCryptoInput: CreateKeyPairInput) {
    const {
      algorithm,
      publicKeyEncodingType,
      privateKeyEncodingType,
      pirvateKeyPassphrase,
      ownerId,
    } = createCryptoInput;
    return await keyBuilder(algorithm)({
      type: publicKeyEncodingType,
    })({
      type: privateKeyEncodingType,
      passphrase: pirvateKeyPassphrase,
    });
  }
}
