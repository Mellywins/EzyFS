import {ConsulConfigModule} from '@ezyfs/internal';
import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApiGatewayController} from './api-gateway.controller';
import {ApiGatewayService} from './api-gateway.service';
import {GqlConfigService} from './config/gql-config.service';
import {RegistrationAuthorityModule} from './registration-authority/registration-authority.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    ConsulConfigModule,
    RegistrationAuthorityModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
