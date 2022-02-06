/* eslint-disable @typescript-eslint/no-var-requires */
import {ConfigService} from '@nestjs/config';
import {EnvironmentVariables} from '@ezyfs/common/types';

require('dotenv').config();

class EmailConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  public getEmailCredentials() {
    return {
      user: this.configService.get<string>('PROJECT_EMAIL_LOGIN'),
      pass: this.configService.get<string>('PROJECT_EMAIL_PASSWORD'),
    };
  }
}
export const emailCredentials = new EmailConfigService(
  new ConfigService<EnvironmentVariables>(),
).getEmailCredentials();
