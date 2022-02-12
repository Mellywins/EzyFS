import {Module} from '@nestjs/common';
import {RegistrationAuthorityService} from './registration-authority.service';
import {RegistrationAuthorityResolver} from './registration-authority.resolver';

@Module({
  providers: [RegistrationAuthorityResolver, RegistrationAuthorityService],
})
export class RegistrationAuthorityModule {}
