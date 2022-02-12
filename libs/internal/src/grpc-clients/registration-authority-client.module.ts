import {Module} from '@nestjs/common';
import {ClientsModule, GrpcService, Transport} from '@nestjs/microservices';
import {join} from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REGISTRATION_AUTHORITY',
        transport: Transport.GRPC,
        options: {
          package: 'REGISTRATION_AUTHORITY',
          protoPath: join(
            `${process.cwd()}/dist/apps/api-gateway/registrationAuthority.proto`,
          ),
        },
      },
    ]),
  ],
  providers: [],
  exports: [],
})
export class RegistrationAuthorityGRPCClientModule {}
