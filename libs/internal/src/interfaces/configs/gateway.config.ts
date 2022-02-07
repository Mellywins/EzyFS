export interface GatewayConfig {
  app: {
    port: number;
    caching: {
      ttl: number;
      max: number;
    };
    auth: {
      enableJwtAuth: boolean;
      enableSessionAuth: boolean;
      jwtSettings: {
        secret: string;
      };
    };
  };
  database: {
    postgres: {
      uri: string;
      name: string;
      options: string;
    };
    redis: {
      host: string;
      port: number;
      password: string;
    };
  };
}
