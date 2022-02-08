import {Injectable} from '@nestjs/common';
import {GqlModuleOptions, GqlOptionsFactory} from '@nestjs/graphql';
import {RedisCache} from 'apollo-server-cache-redis';
import {corsApollOptions} from '@ezyfs/common';
import {buildContext} from 'graphql-passport';
import {ConsulService} from 'nestjs-consul';
import {ConsulServiceKeys, GatewayConfig, GqlContext} from '@ezyfs/internal';
// import {
//   AccessTokenRpcClientService,
//   AccountsRpcClientService,
//   BillingsRpcClientService,
//   GqlContext,
//   RolesRpcClientService,
//   TenantsRpcClientService,
//   WebhooksRpcClientService,
// } from '@ultimatebackend/core';
import {RedisOptions} from 'ioredis';
import {join} from 'path';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly consul: ConsulService<GatewayConfig>, // private readonly accessToken: AccessTokenRpcClientService, // private readonly role: RolesRpcClientService, // private readonly billing: BillingsRpcClientService, // private readonly webhook: WebhooksRpcClientService,
  ) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    /* Get redis config from consul */
    const redisOptions: RedisOptions = await {
      host: (
        await this.consul.get<GatewayConfig>(`${ConsulServiceKeys.API_GATEWAY}`)
      ).database.redis.host,
      port: (
        await this.consul.get<GatewayConfig>(`${ConsulServiceKeys.API_GATEWAY}`)
      ).database.redis.port,
    };

    /* initialize cache */
    const cache = new RedisCache(redisOptions);
    return {
      autoSchemaFile: join(
        process.cwd(),
        'apps/api-gateway/src/schema.graphql',
      ),

      cors: corsApollOptions,
      context: ({req, res, payload, connection}): GqlContext => {
        const bc = buildContext({req, res});

        return {
          // @ts-ignore
          payload,
          connection,
          ...bc,
          req: {
            ...req,
            ...bc.req,
          },
          rpc: {
            // accessToken: this.accessToken,
            // account: this.account,
            // billing: this.billing,
            // role: this.role,
            // webhook: this.webhook,
            // tenant: this.tenant,
          },
        };
      },
      cache,

      /**
       * Enable this at your own detriment. Without this, namespaced mutation won't work,
       * I have taken time to make sure resolvers guards are place in the right places.
       * While extending the application, be careful
       * Here is the reason https://github.com/nestjs/graphql/issues/295
       */
      fieldResolverEnhancers: ['guards', 'interceptors'],
      persistedQueries: {
        cache,
      },
      playground: true,
      introspection: true,
      installSubscriptionHandlers: true,
    };
  }
}
