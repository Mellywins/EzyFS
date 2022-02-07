import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {RegistrationAuthorityController} from './registration-authority.controller';
import {RegistrationAuthorityService} from './registration-authority.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/registration-authority/.ra.env'],
    }),
  ],
  controllers: [RegistrationAuthorityController],
  providers: [RegistrationAuthorityService],
})
export class RegistrationAuthorityModule {}
