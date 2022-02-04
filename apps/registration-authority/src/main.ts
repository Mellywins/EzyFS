import { NestFactory } from '@nestjs/core';
import { RegistrationAuthorityModule } from './registration-authority.module';

async function bootstrap() {
  const app = await NestFactory.create(RegistrationAuthorityModule);
  await app.listen(3000);
}
bootstrap();
