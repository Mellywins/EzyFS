import {NestFactory} from '@nestjs/core';
import {ApiGatewayModule} from './api-gateway.module';

async function bootstrap() {
  console.log(process.cwd());
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
