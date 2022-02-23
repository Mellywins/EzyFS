import {Module} from '@nestjs/common';
import {CryptoService} from './crypto.service';
import {CryptoResolver} from './crypto.resolver';
import {PublicKeyManager} from './managers/public-key-manager';
import {AsymKey} from '@ezyfs/repositories/entities';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';

@Module({
  providers: [
    CryptoResolver,
    CryptoService,
    PublicKeyManager,
    KeyOwnershipHelper,
  ],
  imports: [TypeOrmModule.forFeature([User, AsymKey])],
  exports: [CryptoService],
})
export class CryptoModule {}
