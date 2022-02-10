import {ConsulServiceKeys} from '@ezyfs/internal';
import {cacheSetupFactory} from '@ezyfs/internal/setup/cache.setup';
import {CacheModule, Module} from '@nestjs/common';
import {ConsulModule, ConsulService} from 'nestjs-consul';
import {RedisCacheService} from './redis-cache.service';

@Module({
  providers: [RedisCacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConsulModule],
      inject: [ConsulService],
      useFactory: async (consul: ConsulService<any>) =>
        cacheSetupFactory(consul, ConsulServiceKeys.API_GATEWAY),
    }),
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
