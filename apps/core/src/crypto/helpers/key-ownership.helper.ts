import {InjectRepository} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {Repository} from 'typeorm';
import {AsymKey} from '@ezyfs/repositories/entities';

export class KeyOwnershipHelper {
  constructor(
    @InjectRepository(AsymKey)
    private readonly keyRepository: Repository<AsymKey>,
  ) {}
  hasKey = async (user: User): Promise<Boolean> => {
    const ownedKey = await this.keyRepository.findOne({
      owner: user,
    });
    return ownedKey ? true : false;
  };
}
