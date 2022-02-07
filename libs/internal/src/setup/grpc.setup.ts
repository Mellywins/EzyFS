import {INestApplication, Logger, NestModule} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {Module} from '@nestjs/core/injector/module';
import {Transport} from '@nestjs/microservices';
import {join} from 'path';

interface MicroserviceSetupOptions {
  enableMqtt?: boolean;
  enableNats?: boolean;
  hostname?: string;
}

export async function microserviceSetup(
  appModule: any,
  protoPath: string,
  options?: MicroserviceSetupOptions,
) {
  const {hostname = '0.0.0.0', enableMqtt, enableNats} = options;
  const app = await NestFactory.create(appModule);
  const APP_PORT = app.get<ConfigService>(ConfigService).get<number>('port');
  const pkgName = app
    .get<ConfigService>(ConfigService)
    .get<string>('service_name');
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
