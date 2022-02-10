import {ConsulServiceKeys} from '@ezyfs/internal';
import {microserviceSetup} from '../../../libs/internal/src/setup/grpc.setup';
import {RegistrationAuthorityModule} from './registration-authority.module';

async function bootstrap() {
  microserviceSetup(
    RegistrationAuthorityModule,
    'registration-authority.proto',
    ConsulServiceKeys.REGISTRATION_AUTHORITY,
    {
      enableMqtt: false,
      enableNats: false,
    },
  );
}
bootstrap();
