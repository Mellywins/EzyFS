import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApiGatewayController} from './api-gateway.controller';
import {ApiGatewayService} from './api-gateway.service';
import {GqlConfigService} from './config/gql-config.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
