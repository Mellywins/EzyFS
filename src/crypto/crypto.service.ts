import {Injectable} from '@nestjs/common';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';

@Injectable()
export class CryptoService {
  createKeyPair(createCryptoInput: CreateKeyPairInput) {
    return keyBuilder(createCryptoInput.algorithm)({
      type: createCryptoInput.publicKeyEncodingType,
    })({
      type: createCryptoInput.privateKeyEncodingType,
      passphrase: createCryptoInput.pirvateKeyPassphrase,
    });
  }

  // findAll() {
  //   return `This action returns all crypto`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} crypto`;
  // }

  // update(id: number, updateCryptoInput: UpdateCryptoInput) {
  //   return `This action updates a #${id} crypto`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} crypto`;
  // }
}
