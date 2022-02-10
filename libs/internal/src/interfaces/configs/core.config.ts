import {BaseConfig} from './config-blocks/base.config';
import {PostgresConfig} from './config-blocks/postgres.config';
import {RedisConfig} from './config-blocks/redis.config';

export type CoreConfig = BaseConfig & {databases: PostgresConfig & RedisConfig};
