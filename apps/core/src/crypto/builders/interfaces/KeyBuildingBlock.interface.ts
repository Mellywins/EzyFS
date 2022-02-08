import {User} from '@ezyfs/repositories/entities';

export interface KeyBuildingBlock {
  type: 'ecc' | 'rsa';
  user: User;
  passphrase: string;
}
