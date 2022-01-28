import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../user/entities/user.entity';
import {USER_ALREADY_OWNS_KEY} from '../utils/constants';
import {Repository} from 'typeorm';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';
import {AsymKey} from './entities/AsymKey.entity';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {PublicKeyManager} from './managers/public-key-manager';
import {UserService} from '../user/user.service';
import {createCipheriv, createHash, publicEncrypt, randomBytes} from 'crypto';
import {encrypt, PublicKey} from 'openpgp';
@Injectable()
export class CryptoService {
  constructor(
    private readonly publicKeyManager: PublicKeyManager,
    private readonly keyOwnershipHelper: KeyOwnershipHelper,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(AsymKey)
    private readonly keyRepository: Repository<AsymKey>,
    private readonly userService: UserService,
  ) {}
  async createKeyPair(
    createCryptoInput: CreateKeyPairInput,
  ): Promise<{privateKey: string; fingerprint: string} | ConflictException> {
    const {algorithm, passphrase, ownerId} = createCryptoInput;
    const user = await this.userService.internalFindOne(ownerId);
    const userOwnsKey = await this.keyOwnershipHelper.hasKey(user);
    if (userOwnsKey) {
      return new ConflictException(USER_ALREADY_OWNS_KEY);
    }
    const {publicKey, privateKey} = await keyBuilder({
      type: algorithm,
      user,
      passphrase,
    });
    const pubKeyData = await this.publicKeyManager.persistPublicKey(
      user,
      publicKey,
    );
    return {privateKey, fingerprint: pubKeyData.fingerprint};
  }
  async getUserKey(owner: User): Promise<AsymKey> {
    return await this.keyRepository.findOneOrFail({where: {owner}});
  }
  // generate a 32 byte key
  generateSymmetricKey(): Buffer {
    const r = (Math.random() * 100000000).toString(25);

    return createHash('sha256').update(r).digest();
  }
  generateInitVector(): Buffer {
    return randomBytes(16);
  }
  encryptBuffer(data: Buffer, pubKey: string) {
    return publicEncrypt(pubKey, data);
  }
}
