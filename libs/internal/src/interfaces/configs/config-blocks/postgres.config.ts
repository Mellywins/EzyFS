export interface PostgresConfig {
  postgres: {
    uri?: string;
    name: string;
    username: string;
    password: string;
    options?: string;
    host: string;
    port: number;
  };
}
