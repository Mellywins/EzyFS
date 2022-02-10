import {BaseConfig} from './config-blocks/base.config';
import {RedisConfig} from './config-blocks/redis.config';

export type GatewayConfig = {
  caching: {ttl: number; max: number};
} & BaseConfig & {databases: RedisConfig} & {
    auth: {
      enableJwtAuth: boolean;
      enableSessionAuth: boolean;
      jwtSettings: {
        secret: string;
      };
    };
  };
