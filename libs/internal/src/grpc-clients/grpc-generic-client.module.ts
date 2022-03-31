import {ChannelCredentials} from '@grpc/grpc-js';
import {DynamicModule, Global, Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConsulService} from 'nestjs-consul';
import {join} from 'path';
import {ConsulServiceKeys, RegistrationAuthorityConfig} from '..';
import {NotificationsConfig} from '../interfaces/configs/notifications.config';
import {ConsulConfigModule} from '../modules/consul-config.module';
import {GrpcGenericClientService} from './grpc-generic-client.service';
import {GrpcToken} from './types';

export interface GrpcGenericClientModuleAsyncOptions {
  servicesList: GrpcToken[];
}

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
        ClientsModule.registerAsync([
          {
            useFactory: async (consul: ConsulService<any>) => {
              const RegistrationAuthConfig =
                await consul.get<RegistrationAuthorityConfig>(
                  ConsulServiceKeys.REGISTRATION_AUTHORITY,
                );
              return {
                name: RegistrationAuthConfig.app.protoPackage,
                transport: Transport.GRPC,
                options: {
                  package: RegistrationAuthConfig.app.protoPackage,
                  url: `${RegistrationAuthConfig.app.host}:${RegistrationAuthConfig.app.port}`,
                  protoPath: join(
                    `${process.cwd()}/libs/proto-schema/src/proto/registrationAuthority.proto`,
                  ),
                },
              };
            },
            name: 'REGISTRATION_AUTHORITY',
            inject: [ConsulService],
            imports: [ConsulConfigModule],
          },
          {
            useFactory: async (consul: ConsulService<any>) => {
              const NotificationsConfig = await consul.get<NotificationsConfig>(
                ConsulServiceKeys.NOTIFICATIONS,
              );
              return {
                name: NotificationsConfig.app.protoPackage,
                transport: Transport.GRPC,
                options: {
                  package: NotificationsConfig.app.protoPackage,
                  url: `${NotificationsConfig.app.host}:${NotificationsConfig.app.port}`,
                  protoPath: join(
                    `${process.cwd()}/libs/proto-schema/src/proto/notifications.proto`,
                  ),
                  credentials: ChannelCredentials.createInsecure(),
                },
              };
            },
            name: 'NOTIFICATIONS',
            inject: [ConsulService],
            imports: [ConsulConfigModule],
          },
        ]),
      ],
      exports: [GrpcGenericClientService],
    };
  }
}
