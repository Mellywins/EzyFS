import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';
import {Repository} from 'typeorm';
import {AsymKey} from '../entities/AsymKey.entity';

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
