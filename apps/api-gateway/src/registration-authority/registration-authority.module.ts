import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {ChannelCredentials} from '@grpc/grpc-js';
import {RegistrationAuthorityService} from './registration-authority.service';
import {RegistrationAuthorityResolver} from './registration-authority.resolver';
import {GrpcGenericClientModule} from '@ezyfs/internal/grpc-clients/grpc-generic-client.module';
import {GrpcToken} from '@ezyfs/internal/grpc-clients/types';

@Module({
  providers: [RegistrationAuthorityResolver, RegistrationAuthorityService],
  imports: [
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
    GrpcGenericClientModule.registerAsync({
      servicesList: [GrpcToken.REGISTRATION_AUTHORITY],
    }),
  ],
})
export class RegistrationAuthorityModule {}
