import {BaseConfig} from './config-blocks/base.config';
import {PostgresConfig} from './config-blocks/postgres.config';
import {RedisConfig} from './config-blocks/redis.config';

export type GatewayConfig = {caching: {ttl: number; max: number}} & BaseConfig &
  PostgresConfig &
  RedisConfig & {
    auth: {
      enableJwtAuth: boolean;
      enableSessionAuth: boolean;
      jwtSettings: {
        secret: string;
      };
    };
  };
