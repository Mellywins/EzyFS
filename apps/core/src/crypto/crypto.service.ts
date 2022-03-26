import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {USER_ALREADY_OWNS_KEY} from '../utils/constants';
import {Repository} from 'typeorm';
import {keyBuilder} from './builders/asymetric-key.builder';
import {CreateKeyPairInput} from './dto/createKeyPair.input';
import {AsymKey} from '@ezyfs/repositories/entities';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {PublicKeyManager} from './managers/public-key-manager';
import {createHash, randomBytes} from 'crypto';
import {
  createMessage,
  decrypt,
  encrypt,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';
import {ClientGrpc} from '@nestjs/microservices';
import {Observable} from 'rxjs';
@Injectable()
export class CryptoService implements OnModuleInit {
  private userServiceRPC: {
    internalFindOne(id: number): Observable<User>;
  };

  constructor(
    private readonly publicKeyManager: PublicKeyManager,
    private readonly keyOwnershipHelper: KeyOwnershipHelper,
    @InjectRepository(AsymKey)
    private readonly keyRepository: Repository<AsymKey>,
    @Inject('RA') private RA_Client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.userServiceRPC = this.RA_Client.getService(
      'RegistrationAuthorityInternalService',
    );
  }
  async createKeyPair(
    createCryptoInput: CreateKeyPairInput,
  ): Promise<{privateKey: string; fingerprint: string} | ConflictException> {
    const {algorithm, passphrase, ownerId} = createCryptoInput;
    const user = await this.userServiceRPC.internalFindOne(ownerId).toPromise();
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
  generateSymmetricKey(): string {
    const r = (Math.random() * 100000000).toString(25);

    return createHash('sha256').update(r).digest('base64').substring(0, 32);
  }
  generateInitVector(): Buffer {
    return randomBytes(8 * 2);
  }
  async encryptString(data: string, pubKey: string): Promise<string> {
    const pKey = await readKey({armoredKey: pubKey});
    const encrypted = await encrypt({
      message: await createMessage({
        text: data,
      }),
      encryptionKeys: pKey,
    });
    return encrypted;
  }
  async decryptString(data: string, privKey: string): Promise<string> {
    const privateKey = await readPrivateKey({armoredKey: privKey});
    const msg = await readMessage({
      armoredMessage: data,
    });
    const {data: decrypted, signatures} = await decrypt({
      message: msg,
      decryptionKeys: privateKey,
    });
    return decrypted;
  }
}
