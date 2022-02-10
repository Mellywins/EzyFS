/* eslint-disable @typescript-eslint/no-unused-vars */
import {ConsulServiceKeys} from '@ezyfs/internal';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConsulService} from 'nestjs-consul';
import {join} from 'path';

export const dbConnectionFactory = async (
  consul: ConsulService<any>,
  key: ConsulServiceKeys,
  entityPath: string,
): Promise<TypeOrmModuleOptions> => {
  const config = await consul.get<any>(key);
  const typeORMOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: config.database.postgres.host,
    port: config.database.postgres.port,
    username: config.database.postgres.username,
    password: config.database.postgres.password,
    database: config.database.postgres.name,
    entities: [join(process.cwd() + entityPath)],
    synchronize: true,
  };
  return typeORMOptions;
};
