import {Injectable} from '@nestjs/common';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';
import {AsymKey} from './entities/AsymKey.entity';
import {PublicKeyManager} from './managers/public-key-manager';
@Injectable()
export class CryptoService {
  constructor(private readonly publicKeyManager: PublicKeyManager) {}
  async createKeyPair(createCryptoInput: CreateKeyPairInput): Promise<AsymKey> {
    const {
      algorithm,
      publicKeyEncodingType,
      privateKeyEncodingType,
      pirvateKeyPassphrase,
      ownerId,
    } = createCryptoInput;
    const {publicKey, privateKey} = await keyBuilder(algorithm)({
      type: publicKeyEncodingType,
    })({
      type: privateKeyEncodingType,
      passphrase: pirvateKeyPassphrase,
    });
    const pubKeyData = await this.publicKeyManager.persistPublicKey(
      ownerId,
      publicKey,
    );
    return pubKeyData;
  }
}
