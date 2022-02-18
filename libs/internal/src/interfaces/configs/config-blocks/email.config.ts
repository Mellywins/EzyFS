export interface EmailConfig {
  transport: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
  defaults: {
    from: string;
  };
}
