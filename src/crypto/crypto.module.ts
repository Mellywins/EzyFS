import {Module} from '@nestjs/common';
import {CryptoService} from './crypto.service';
import {CryptoResolver} from './crypto.resolver';
import {PublicKeyManager} from './managers/public-key-manager';
import {AsymKey} from './entities/AsymKey.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';

@Module({
  providers: [
    CryptoResolver,
    CryptoService,
    PublicKeyManager,
    KeyOwnershipHelper,
  ],
  imports: [TypeOrmModule.forFeature([User, AsymKey])],
})
export class CryptoModule {}
