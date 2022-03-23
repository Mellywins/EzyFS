import {InjectRepository} from '@nestjs/typeorm';
import {User, AsymKey} from '@ezyfs/repositories/entities';
import {Repository} from 'typeorm';

export class KeyOwnershipHelper {
  constructor(
    @InjectRepository(AsymKey)
    private readonly keyRepository: Repository<AsymKey>,
  ) {}

  hasKey = async (user: User): Promise<boolean> => {
    const ownedKey = await this.keyRepository.findOne({
      owner: user,
    });
    return !!ownedKey;
  };
}
