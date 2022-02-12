import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationAuthorityResolver } from './registration-authority.resolver';
import { RegistrationAuthorityService } from './registration-authority.service';

describe('RegistrationAuthorityResolver', () => {
  let resolver: RegistrationAuthorityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationAuthorityResolver, RegistrationAuthorityService],
    }).compile();

    resolver = module.get<RegistrationAuthorityResolver>(RegistrationAuthorityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
