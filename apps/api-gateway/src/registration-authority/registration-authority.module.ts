import {Module} from '@nestjs/common';
import {RegistrationAuthorityService} from './registration-authority.service';
import {RegistrationAuthorityController} from './registration-authority.controller';

@Module({
  controllers: [RegistrationAuthorityController],
  providers: [RegistrationAuthorityService],
})
export class RegistrationAuthorityModule {}
