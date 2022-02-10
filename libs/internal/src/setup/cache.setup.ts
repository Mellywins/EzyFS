import {CacheModuleOptions} from '@nestjs/common';
import {ConsulService} from 'nestjs-consul';
import * as redisStore from 'cache-manager-redis-store';
import {ConsulServiceKeys} from '..';

export const cacheSetupFactory = async (
  consul: ConsulService<any>,
  key: ConsulServiceKeys,
): Promise<CacheModuleOptions<Record<any, any>>> => {
  const redisConfig = await consul.get<any>(key);
  return {
    redis: redisStore,
    host: redisConfig.databases.redis.host,
    port: redisConfig.databases.redis.port,
  };
};
