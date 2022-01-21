import {InjectRepository} from '@nestjs/typeorm';
import jobCreatorFactory from 'src/scheduler/factories/abstract/job-factory';
import {User} from 'src/user/entities/user.entity';
import {Repository} from 'typeorm';
import {AsymKey} from '../entities/AsymKey.entity';
import {fingerprint} from '../helpers/fingerprint.helper';

export class PublicKeyManager {
  constructor(
    @InjectRepository(AsymKey)
    private readonly keyRepository: Repository<AsymKey>,
  ) {}
  persistPublicKey = async (owner: User, publicKey: string) => {
    const fingprint = await fingerprint(publicKey);
    const keyEntity = this.keyRepository.create({
      fingerprint: fingprint,
      publicKey: publicKey,
      owner,
    });
    await this.keyRepository.save(keyEntity);
    return keyEntity;
  };
}
