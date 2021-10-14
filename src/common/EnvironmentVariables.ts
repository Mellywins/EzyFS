export interface EnvironmentVariables {
  PORT: number;
  HOST: string;
  DB_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  PROJECT_EMAIL_LOGIN: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  PROJECT_EMAIL_PASSWORD: string;
  SEED_NUMBER: number;
}
