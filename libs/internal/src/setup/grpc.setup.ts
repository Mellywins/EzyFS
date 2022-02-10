import {INestApplication, Logger, NestModule} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {Module} from '@nestjs/core/injector/module';
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
  const {hostname = '0.0.0.0', enableMqtt, enableNats} = options;
  const app = await NestFactory.create(appModule);
  const appConfig = await app
    .get<ConsulService<any>>(ConsulService)
    .get<any>(key);
  const APP_PORT = appConfig.app.port;
  const pkgName = appConfig.app.name;
  (await app).connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `${hostname}:${APP_PORT}`,
      package: pkgName,
      protoPath: join(process.cwd(), `/dist/libs/proto-schema/${protoPath}`),
    },
  });
  Logger.log(`Microservice ${pkgName} listening on ${hostname}:${APP_PORT}`);
}
