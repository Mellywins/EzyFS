import {ChannelCredentials} from '@grpc/grpc-js';
import {DynamicModule, Global, Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {GrpcGenericClientService} from './grpc-generic-client.service';
import {GrpcToken} from './types';

export interface GrpcGenericClientModuleAsyncOptions {
  servicesList: GrpcToken[];
}

@Global()
@Module({})
export class GrpcGenericClientModule {
  //   private static registerAsync();
  __GRPC_CLIENTS = {};

  static registerAsync(
    options: GrpcGenericClientModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GrpcGenericClientModule,
      providers: [
        {
          provide: 'ServiceList',
          useValue: options,
        },
        GrpcGenericClientService,
      ],
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
        ClientsModule.register([
          {
            name: 'NOTIFICATIONS',
            transport: Transport.GRPC,
            options: {
              package: 'NOTIFICATIONS',
              url: '172.28.1.4:3005',
              protoPath: join(
                `${process.cwd()}/libs/proto-schema/src/proto/notifications.proto`,
              ),
              credentials: ChannelCredentials.createInsecure(),
            },
          },
        ]),
      ],
      exports: [GrpcGenericClientService],
    };
  }
}
