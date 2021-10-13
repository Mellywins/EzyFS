/* eslint-disable no-empty-function */
import {Injectable} from '@nestjs/common';
// eslint-disable-next-line import/extensions
import {ConfigService} from '@nestjs/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import os from 'os';
import {parse} from 'pg-connection-string';
import {EnvironmentVariables} from '../../common/EnvironmentVariables';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
class DatabaseConfigService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    let delimiter;
    if (os.platform() === 'win32') {
      delimiter = '\\';
    } else {
      delimiter = '/';
    }
    const path = __dirname.split(delimiter);
    const entitiesPath = path.splice(0, path.length - 1).join(delimiter);
    const host = this.configService.get<string>('HOST');
    const port = this.configService.get<number>('DB_PORT');
    const username = this.configService.get<string>('POSTGRES_USER');
    const password = this.configService.get<string>('POSTGRES_PASSWORD');
    const database = this.configService.get<string>('POSTGRES_DB');
    const url = `postgres://${username}:${password}@${host}:${port}/${database}`;
    const config = parse(url);
    return {
      type: 'postgres',
      url,
      username: config.user,
      password: config.password,
      database: config.database,
      host: config.host,
      port: config.port as unknown as number,
      entities: [`${entitiesPath}/**/*.entity{.ts,.js}`],
      // logging:true,
      synchronize: true,
      keepConnectionAlive: true,
    };
  }
}

const databaseConfigService = new DatabaseConfigService(
  new ConfigService<EnvironmentVariables>(),
).getTypeOrmConfig();

// eslint-disable-next-line import/prefer-default-export
export {databaseConfigService};
