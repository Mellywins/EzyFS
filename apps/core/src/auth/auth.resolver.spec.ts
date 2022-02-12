import {Test, TestingModule} from '@nestjs/testing';
import {User} from '../user/entities/user.entity';
import {AuthResolver} from './auth.resolver';
import {AuthService} from './auth.service';
import {CredentialsInput} from '../../../../libs/common/src/dtos/registration-authority/credentials.input';
import {TokenModel} from './dto/token.model';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const token: TokenModel = {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    user: new User(),
  };
  const credentialsInput: CredentialsInput = {
    username: 'ahmed grati',
    password: 'pass123',
  };
  const mockAuthService = {
    login: jest.fn().mockReturnValue(token),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should perform a user login', () => {
    expect(resolver.login(credentialsInput)).toMatchObject(token);
    expect(mockAuthService.login).toBeCalledTimes(1);
  });
});
