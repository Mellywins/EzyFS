/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ChannelCredentials} from '@grpc/grpc-js';
import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import {ConsulService} from 'nestjs-consul';
import {join} from 'path';
import {ConsulServiceKeys} from '..';

interface MicroserviceSetupOptions {
  enableMqtt?: boolean;
  enableNats?: boolean;
  hostname?: string;
}

export async function microserviceSetup(
  appModule: any,
  protoPath: string,
  key: ConsulServiceKeys,
  options?: MicroserviceSetupOptions,
) {
  const {hostname = '172.28.1.2', enableMqtt, enableNats} = options;
  const app = await NestFactory.create(appModule);
  const appConfig = await app
    .get<ConsulService<any>>(ConsulService)
    .get<any>(key);
  const APP_PORT = appConfig.app.port;
  const pkgName = appConfig.app.name;
  (await app).connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:3001', // APP_PORT=3001
      package: pkgName,
      protoPath: join(process.cwd(), protoPath),
      credentials: ChannelCredentials.createInsecure(),
    },
  });
  app.listen(APP_PORT);
  Logger.log(`Microservice ${pkgName} listening on ${hostname}:${APP_PORT}`);
}
