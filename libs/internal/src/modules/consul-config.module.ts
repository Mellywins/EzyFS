import {Module} from '@nestjs/common';
import {ConsulModule} from 'nestjs-consul';
import {ConsulServiceKeys} from '../enums';

@Module({
  imports: [
    ConsulModule.forRoot({
      keys: [
        {
          key: ConsulServiceKeys.REGISTRATION_AUTHORITY as string,
        },
        {
          key: ConsulServiceKeys.SCHEDULER as string,
        },
        {key: ConsulServiceKeys.API_GATEWAY as string},
      ],
      updateCron: '1 * * * * *',
      connection: {
        protocol: 'http',
        port: 8500,
        host: 'consul-server',
        token: '',
      },
    }),
  ],
})
export class ConsulConfigModule {}
