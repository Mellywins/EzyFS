import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {databaseConfigService} from './config/database-config-service/database-config-service.service';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {RedisCacheModule} from './redis-cache/redis-cache.module';
import {EmailModule} from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfigService),
    ConfigModule.forRoot({isGlobal: true}),
    UserModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      introspection: true,
      playground: true,
      fieldResolverEnhancers: ['guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
    }),
    AuthModule,
    RedisCacheModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line import/prefer-default-export
export class AppModule {}
