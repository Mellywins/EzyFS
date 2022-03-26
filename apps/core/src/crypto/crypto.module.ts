import {Module} from '@nestjs/common';
import {CryptoService} from './crypto.service';
import {CryptoResolver} from './crypto.resolver';
import {PublicKeyManager} from './managers/public-key-manager';
import {AsymKey} from '@ezyfs/repositories/entities';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {ChannelCredentials} from '@grpc/grpc-js';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';

@Module({
  providers: [
    CryptoResolver,
    CryptoService,
    PublicKeyManager,
    KeyOwnershipHelper,
  ],
  imports: [
    TypeOrmModule.forFeature([User, AsymKey]),
    ClientsModule.register([
      {
        name: 'RA',
        transport: Transport.GRPC,
        options: {
          url: '172.28.1.2:3001',
          package: 'REGISTRATION_AUTHORITY',
          protoPath: join(
            `${process.cwd()}/libs/proto-schema/src/proto/registrationAuthority.proto`,
          ),
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
