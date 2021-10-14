/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  PartialType,
} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {TokenModel} from './dto/token.model';
import {CredentialsInput} from './dto/credentials.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => TokenModel)
  login(@Args('credentialsInput') credentialsInput: CredentialsInput) {
    return this.authService.login(credentialsInput);
  }

  @Query((returns) => TokenModel)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
