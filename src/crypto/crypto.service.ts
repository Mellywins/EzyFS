import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';
import {USER_ALREADY_OWNS_KEY} from 'src/utils/constants';
import {Repository} from 'typeorm';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';
import {AsymKey} from './entities/AsymKey.entity';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {PublicKeyManager} from './managers/public-key-manager';
@Injectable()
export class CryptoService {
  constructor(
    private readonly publicKeyManager: PublicKeyManager,
    private readonly keyOwnershipHelper: KeyOwnershipHelper,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createKeyPair(
    createCryptoInput: CreateKeyPairInput,
  ): Promise<{privateKey: string; fingerprint: string} | ConflictException> {
    const {
      algorithm,
      publicKeyEncodingType,
      privateKeyEncodingType,
      pirvateKeyPassphrase,
      ownerId,
    } = createCryptoInput;
    const user = await this.userRepository.findOne(ownerId);
    const userOwnsKey = await this.keyOwnershipHelper.hasKey(user);
    if (userOwnsKey) {
      return new ConflictException(USER_ALREADY_OWNS_KEY);
    }
    const {publicKey, privateKey} = await keyBuilder(algorithm)({
      type: publicKeyEncodingType,
    })({
      type: privateKeyEncodingType,
      passphrase: pirvateKeyPassphrase,
    });
    const pubKeyData = await this.publicKeyManager.persistPublicKey(
      user,
      publicKey,
    );
    return {privateKey, fingerprint: pubKeyData.fingerprint};
  }
}
