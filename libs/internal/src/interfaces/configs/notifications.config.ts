import {BaseConfig} from './config-blocks/base.config';
import {EmailConfig} from './config-blocks/email.config';
import {PostgresConfig} from './config-blocks/postgres.config';
import {RedisConfig} from './config-blocks/redis.config';

export type NotificationsConfig = BaseConfig & {
  database: PostgresConfig & RedisConfig;
} & {notification: {email: EmailConfig}};
