import {Global, Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REGISTRATION_AUTHORITY',
        transport: Transport.GRPC,
        options: {
          package: 'REGISTRATION_AUTHORITY',
          url: '172.28.1.2:3001',
          protoPath: join(
            `${process.cwd()}/libs/proto-schema/src/proto/registrationAuthority.proto`,
          ),
        },
      },
    ]),
  ],
  providers: [],
  exports: [],
})
export class GrpcGenericClientModule {
  //   private static registerAsync();
}
export interface GrpcGenericClientModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<GrpcGenericClientModule>;
}
