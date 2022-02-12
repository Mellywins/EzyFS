import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REGISTRATION_AUTHORITY',
        transport: Transport.GRPC,
        options: {
          package: 'REGISTRATION_AHTORITY',
          protoPath: join(
            `${process.cwd()}/dist/apps/registration-authority/libs/proto-schema/src/proto/registration-authority.proto`,
          ),
        },
      },
    ]),
  ],
  providers: [],
  exports: [ClientsModule],
})
export class RegistrationAuthorityGRPCClientModule {}
