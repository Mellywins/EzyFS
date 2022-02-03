import { Module } from '@nestjs/common';
import { RegistrationAuthorityController } from './registration-authority.controller';
import { RegistrationAuthorityService } from './registration-authority.service';

@Module({
  imports: [],
  controllers: [RegistrationAuthorityController],
  providers: [RegistrationAuthorityService],
})
export class RegistrationAuthorityModule {}
