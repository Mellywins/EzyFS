import {User} from '../../../user/entities/user.entity';

export interface KeyBuildingBlock {
  type: 'ecc' | 'rsa';
  user: User;
  passphrase: string;
}
