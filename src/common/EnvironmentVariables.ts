export interface EnvironmentVariables {
  PORT: number;
  HOST: string;
  DB_PORT: number | string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  SEED_NUMBER: number;
}
