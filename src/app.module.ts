import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {databaseConfigService} from './config/database-config-service/database-config-service.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfigService),
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line import/prefer-default-export
export class AppModule {}
