import {Module} from '@nestjs/common';
import {RegistrationAuthorityGRPCClientModule} from '@ezyfs/internal/grpc-clients/registration-authority-client.module';
import {ClientsModule, GrpcMethod, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {RegistrationAuthorityService} from './registration-authority.service';
import {RegistrationAuthorityResolver} from './registration-authority.resolver';
import {ChannelCredentials} from '@grpc/grpc-js';

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
  ],
})
export class RegistrationAuthorityModule {}
