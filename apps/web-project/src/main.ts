import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
// eslint-disable-next-line import/extensions
import {AppModule} from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  Logger.log(`Server start on http://localhost:${port}/graphql`, 'BOOTSTRAP');
}
bootstrap();
