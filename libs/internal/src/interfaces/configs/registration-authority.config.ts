export interface RegistrationAuthorityConfig {
  app: {
    port: number;
  };
  database: {
    postgres: {
      uri: string;
      name: string;
      username: string;
      password: string;
      options: string;
      host: string;
      port: number;
    };
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
}
