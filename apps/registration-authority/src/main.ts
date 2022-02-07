import {microserviceSetup} from '../../../libs/internal/src/setup/grpc.setup';
import {RegistrationAuthorityModule} from './registration-authority.module';

async function bootstrap() {
  microserviceSetup(
    RegistrationAuthorityModule,
    'registration-authority.proto',
    {
      enableMqtt: false,
      enableNats: false,
    },
  );
}
bootstrap();
