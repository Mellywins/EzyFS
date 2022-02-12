import {Module} from '@nestjs/common';
import {RegistrationAuthorityService} from './registration-authority.service';
import {RegistrationAuthorityResolver} from './registration-authority.resolver';
import {RegistrationAuthorityGRPCClientModule} from '@ezyfs/internal/grpc-clients/registration-authority-client.module';

@Module({
  providers: [RegistrationAuthorityResolver, RegistrationAuthorityService],
  imports: [RegistrationAuthorityGRPCClientModule],
})
export class RegistrationAuthorityModule {}
