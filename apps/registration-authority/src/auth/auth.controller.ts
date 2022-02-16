/* eslint-disable camelcase */
import {CredentialsInput} from '@ezyfs/common/dtos';
import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {AuthService} from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthentificationService', 'Login')
  async Login(credentialsInput: CredentialsInput) {
    return this.authService.login(credentialsInput);
  }

  @GrpcMethod('AuthentificationService', 'RefreshToken')
  async RefreshToken(input: {refreshToken: string}) {
    return this.authService.refreshToken(input.refreshToken);
  }
}
