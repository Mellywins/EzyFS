import {Module} from '@nestjs/common';
import {CryptoService} from './crypto.service';
import {CryptoResolver} from './crypto.resolver';
import {PublicKeyManager} from './managers/public-key-manager';
import {AsymKey} from './entities/AsymKey.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../user/entities/user.entity';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {UserModule} from 'src/user/user.module';

@Module({
  providers: [
    CryptoResolver,
    CryptoService,
    PublicKeyManager,
    KeyOwnershipHelper,
  ],
  imports: [TypeOrmModule.forFeature([User, AsymKey]), UserModule],
  exports: [CryptoService],
})
export class CryptoModule {}
