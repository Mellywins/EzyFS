import {ConsulConfigModule} from '@ezyfs/internal';
import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {UserModule} from 'apps/core/src/user/user.module';
import {ApiGatewayController} from './api-gateway.controller';
import {ApiGatewayService} from './api-gateway.service';
import {GqlConfigService} from './config/gql-config.service';
import {UsersResolver} from './users/users.resolver';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    ConsulConfigModule,
    UserModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, UsersResolver],
})
export class ApiGatewayModule {}
