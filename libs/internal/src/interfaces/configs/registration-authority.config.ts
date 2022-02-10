import {BaseConfig} from './config-blocks/base.config';
import {PostgresConfig} from './config-blocks/postgres.config';
import {RedisConfig} from './config-blocks/redis.config';

export type RegistrationAuthorityConfig = BaseConfig & {
  database: PostgresConfig & RedisConfig;
};
