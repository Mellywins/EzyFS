import {InjectRepository} from '@nestjs/typeorm';
import jobCreatorFactory from '../../scheduler/factories/abstract/job-factory';
import {User} from '@ezyfs/repositories/entities';
import {Repository} from 'typeorm';
import {AsymKey} from '@ezyfs/repositories/entities';
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
